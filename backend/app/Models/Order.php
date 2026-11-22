<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    public const STATUSES = [
        'pending'   => 'Pending verification',
        'confirmed' => 'Confirmed',
        'rejected'  => 'Rejected',
        'cancelled' => 'Cancelled',
    ];

    public const METHODS = [
        'bkash' => 'bKash',
        'nagad' => 'Nagad',
        'bank'  => 'Bank transfer',
    ];

    protected $fillable = [
        'order_number', 'pricing_id', 'package_title', 'billing_cycle',
        'name', 'email', 'phone', 'company', 'project_details',
        'currency', 'package_price', 'advance_percent', 'amount',
        'payment_method', 'payer_account', 'transaction_id',
        'status', 'admin_note', 'confirmed_at', 'ip',
    ];

    protected $casts = [
        'package_price' => 'decimal:2',
        'amount'        => 'decimal:2',
        'confirmed_at'  => 'datetime',
    ];

    public function pricing(): BelongsTo
    {
        return $this->belongsTo(Pricing::class);
    }

    /** e.g. ORD-261122-4821 — short enough to read out on the phone. */
    public static function newNumber(): string
    {
        do {
            $number = 'ORD-' . now()->format('ymd') . '-' . random_int(1000, 9999);
        } while (static::where('order_number', $number)->exists());

        return $number;
    }

    public function formattedAmount(?string $value = null): string
    {
        $value ??= $this->amount;
        $symbol = $this->currency === 'BDT' ? '৳' : '$';

        return $symbol . number_format((float) $value, $this->currency === 'BDT' ? 0 : 2);
    }

    public function methodLabel(): string
    {
        return self::METHODS[$this->payment_method] ?? $this->payment_method;
    }
}
