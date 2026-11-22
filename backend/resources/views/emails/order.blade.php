@php
    $o = $order;
    $heading = match (true) {
        $forAdmin              => 'New order — verify payment',
        $event === 'confirmed' => 'Your payment is confirmed',
        $event === 'rejected'  => 'We could not verify your payment',
        default                => 'Thanks — we received your order',
    };
@endphp
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $heading }}</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; color: #111827; }
        .card { background: #fff; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,.08); }
        .header { background: #0b0b10; color: #fff; padding: 24px 32px; border-bottom: 4px solid #ed1c24; }
        .header h1 { margin: 0; font-size: 20px; }
        .header p { margin: 6px 0 0; color: #a1a1aa; font-size: 13px; }
        .body { padding: 28px 32px; font-size: 15px; line-height: 1.55; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        td { padding: 9px 0; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
        td.k { color: #6b7280; width: 40%; font-size: 13px; }
        .amount { font-size: 22px; font-weight: bold; color: #ed1c24; }
        .note { background: #f9fafb; border-left: 4px solid #ed1c24; padding: 14px 16px; border-radius: 4px; }
        .footer { padding: 16px 32px; background: #f9fafb; font-size: 12px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
<div class="card">
    <div class="header">
        <h1>{{ $heading }}</h1>
        <p>Order {{ $o->order_number }} · {{ $o->created_at->format('d M Y, h:i A') }}</p>
    </div>
    <div class="body">
        @unless($forAdmin)
            <p>Hi {{ $o->name }},</p>
            @if($event === 'confirmed')
                <p>We've verified your advance payment for <strong>{{ $o->package_title }}</strong>. Your project is now in the queue — I'll be in touch within one working day to start the discovery call.</p>
            @elseif($event === 'rejected')
                <p>We couldn't match your payment for <strong>{{ $o->package_title }}</strong> with the transaction ID you gave. Please reply to this email with a screenshot of the payment and we'll sort it out quickly.</p>
            @else
                <p>Thanks for ordering <strong>{{ $o->package_title }}</strong>. We'll verify your payment (usually within a few hours) and email you as soon as it's confirmed.</p>
            @endif
        @endunless

        <table>
            <tr><td class="k">Package</td><td>{{ $o->package_title }}</td></tr>
            <tr><td class="k">Package price</td><td>{{ $o->formattedAmount($o->package_price) }}</td></tr>
            <tr><td class="k">Advance paid ({{ $o->advance_percent }}%)</td><td class="amount">{{ $o->formattedAmount() }}</td></tr>
            @if($o->advance_percent < 100)
                <tr><td class="k">Remaining</td><td>{{ $o->formattedAmount($o->package_price - $o->amount) }} — invoiced on delivery</td></tr>
            @endif
            <tr><td class="k">Paid via</td><td>{{ $o->methodLabel() }}@if($o->payer_account) (from {{ $o->payer_account }})@endif</td></tr>
            <tr><td class="k">Transaction ID</td><td><strong>{{ $o->transaction_id }}</strong></td></tr>
            @if($forAdmin)
                <tr><td class="k">Name</td><td>{{ $o->name }}</td></tr>
                <tr><td class="k">Email</td><td><a href="mailto:{{ $o->email }}">{{ $o->email }}</a></td></tr>
                <tr><td class="k">Phone</td><td>{{ $o->phone }}</td></tr>
                @if($o->company)<tr><td class="k">Company</td><td>{{ $o->company }}</td></tr>@endif
            @endif
        </table>

        @if($o->project_details)
            <div class="note">{!! nl2br(e($o->project_details)) !!}</div>
        @endif

        @if($forAdmin)
            <p style="margin-top:20px">Check the transaction in your {{ $o->methodLabel() }} account, then confirm or reject it in <a href="{{ url('/admin/orders') }}">Admin → Orders</a>.</p>
        @endif
    </div>
    <div class="footer">Ibrahim Monir · ibrahimmonir.com</div>
</div>
</body>
</html>
