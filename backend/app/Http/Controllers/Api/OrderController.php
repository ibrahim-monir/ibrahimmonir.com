<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OrderMail;
use App\Models\Client;
use App\Models\Order;
use App\Models\Pricing;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * Orders from the Pricing page, paid manually (bKash / Nagad / bank transfer).
 *
 * The amount is never taken from the browser: it is recomputed here from the
 * package price and the advance percentage in Settings, so a tampered request
 * can't record a smaller payment.
 */
class OrderController extends Controller
{
    /** Payment methods the admin has filled in under Settings → Invoicing. */
    public static function availableMethods(): array
    {
        $s = SiteSetting::getAll();
        $methods = [];

        if (! empty($s['payment_bkash_number'])) {
            $methods[] = 'bkash';
        }
        if (! empty($s['payment_nagad_number'])) {
            $methods[] = 'nagad';
        }
        if (! empty($s['bank_account_number'])) {
            $methods[] = 'bank';
        }

        return $methods;
    }

    public static function advancePercent(): int
    {
        $p = (int) SiteSetting::get('payment_advance_percent', 50);

        return $p >= 1 && $p <= 100 ? $p : 50;
    }

    /** Default cash-out charges (Nov 2026): bKash regular agent Tk 18.50/1000, Nagad app Tk 12.50/1000. */
    public const DEFAULT_CHARGES = ['bkash' => 1.85, 'nagad' => 1.25];

    /** MFS charge % for a method; Settings can override it (0 turns it off). Bank transfer has none. */
    public static function chargePercent(string $method): float
    {
        if (! isset(self::DEFAULT_CHARGES[$method])) {
            return 0.0;
        }

        $raw = SiteSetting::get("payment_{$method}_charge");
        $p = ($raw === null || $raw === '') ? self::DEFAULT_CHARGES[$method] : (float) $raw;

        return max(0.0, min(10.0, $p));
    }

    public function store(Request $request): JsonResponse
    {
        // Honeypot: real visitors never see or fill this field.
        if (filled($request->input('website'))) {
            return response()->json(['message' => 'Order received.'], 201);
        }

        $methods = self::availableMethods();

        $data = $request->validate([
            'pricing_id'      => ['required', 'integer', Rule::exists('pricings', 'id')->where('is_active', true)],
            'currency'        => ['required', Rule::in(['BDT', 'USD'])],
            'name'            => ['required', 'string', 'max:120'],
            'email'           => ['required', 'email', 'max:190'],
            'phone'           => ['required', 'string', 'max:30', 'regex:/^[+\d\s()-]{6,30}$/'],
            'company'         => ['nullable', 'string', 'max:150'],
            'project_details' => ['nullable', 'string', 'max:3000'],
            'payment_method'  => ['required', Rule::in($methods)],
            'payer_account'   => ['nullable', 'string', 'max:60', Rule::requiredIf(in_array($request->input('payment_method'), ['bkash', 'nagad'], true))],
            'transaction_id'  => ['required', 'string', 'min:4', 'max:64'],
        ], [
            'payment_method.in'      => 'This payment method is not available right now.',
            'payer_account.required' => 'Enter the number you sent the money from.',
            'phone.regex'            => 'Enter a valid phone number.',
        ]);

        $plan = Pricing::findOrFail($data['pricing_id']);

        // Mobile banking is BDT-only.
        $currency = in_array($data['payment_method'], ['bkash', 'nagad'], true) ? 'BDT' : $data['currency'];
        $price = (float) ($currency === 'BDT' ? $plan->bdt_price : $plan->price);

        if ($price <= 0) {
            throw ValidationException::withMessages([
                'pricing_id' => 'This package is priced on request. Please contact us for a quote.',
            ]);
        }

        $trx = strtoupper(trim($data['transaction_id']));

        $reused = Order::where('transaction_id', $trx)
            ->where('payment_method', $data['payment_method'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($reused) {
            throw ValidationException::withMessages([
                'transaction_id' => 'This transaction ID has already been used for another order.',
            ]);
        }

        $percent = self::advancePercent();
        $amount = $currency === 'BDT'
            ? round($price * $percent / 100)
            : round($price * $percent / 100, 2);

        // Charge is rounded up to the next taka so the full advance always arrives.
        $chargePercent = self::chargePercent($data['payment_method']);
        $charge = $chargePercent > 0 ? ceil($amount * $chargePercent / 100) : 0;

        [$order, $account] = DB::transaction(function () use ($data, $plan, $currency, $price, $percent, $amount, $chargePercent, $charge, $trx, $request) {
            $account = $this->clientAccount($data);

            $order = Order::create([
                'order_number'    => Order::newNumber(),
                'pricing_id'      => $plan->id,
                'client_id'       => $account['client_id'],
                'package_title'   => $plan->title,
                'billing_cycle'   => $plan->billing_cycle,
                'name'            => $data['name'],
                'email'           => $data['email'],
                'phone'           => $data['phone'],
                'company'         => $data['company'] ?? null,
                'project_details' => $data['project_details'] ?? null,
                'currency'        => $currency,
                'package_price'   => $price,
                'advance_percent' => $percent,
                'amount'          => $amount,
                'charge_percent'  => $chargePercent,
                'charge'          => $charge,
                'payment_method'  => $data['payment_method'],
                'payer_account'   => $data['payer_account'] ?? null,
                'transaction_id'  => $trx,
                'status'          => 'pending',
                'ip'              => $request->ip(),
            ]);

            return [$order, $account];
        });

        // Mail must never cost the customer their order.
        try {
            if ($admin = config('mail.admin_email')) {
                Mail::to($admin)->send(new OrderMail($order, forAdmin: true));
            }
            Mail::to($order->email)->send(new OrderMail($order, forAdmin: false, account: $account['mail']));
        } catch (\Throwable $e) {
            Log::warning('Order mail failed', ['order' => $order->order_number, 'error' => $e->getMessage()]);
        }

        return response()->json([
            'message'      => 'Order received.',
            'order_number' => $order->order_number,
            'amount'       => $order->formattedAmount($order->total()),
            'status'       => $order->status,
            'account'      => $account['status'], // created | existing | none
        ], 201);
    }

    /**
     * Finds or creates the customer's client-portal account.
     *
     * New customers get a client user whose login is their email and whose
     * password is their phone number (digits only), as the site owner chose.
     * An existing account is linked but its password is never changed, and
     * an admin's email never gets a client profile attached.
     */
    private function clientAccount(array $data): array
    {
        $email = strtolower(trim($data['email']));
        $user = User::whereRaw('LOWER(email) = ?', [$email])->first();

        if ($user && $user->isAdmin()) {
            return ['status' => 'none', 'client_id' => null, 'mail' => null];
        }

        if ($user) {
            $client = $user->client ?? Client::create([
                'user_id' => $user->id,
                'company' => $data['company'] ?? null,
                'phone'   => $data['phone'],
            ]);

            return [
                'status'    => 'existing',
                'client_id' => $client->id,
                'mail'      => ['status' => 'existing', 'email' => $user->email, 'password' => null],
            ];
        }

        $password = Order::phoneDigits($data['phone']);

        $user = User::create([
            'name'     => $data['name'],
            'email'    => $email,
            'password' => Hash::make($password),
            'role'     => 'client',
        ]);

        $client = Client::create([
            'user_id' => $user->id,
            'company' => $data['company'] ?? null,
            'phone'   => $data['phone'],
        ]);

        return [
            'status'    => 'created',
            'client_id' => $client->id,
            'mail'      => ['status' => 'created', 'email' => $email, 'password' => $password],
        ];
    }
}
