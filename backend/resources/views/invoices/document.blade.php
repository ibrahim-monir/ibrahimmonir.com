<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Invoice {{ $invoice->invoice_number }}</title>
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { margin: 0; size: A4; }
    body {
        font-family: 'DejaVu Sans', 'Helvetica', sans-serif;
        color: #1f2937;
        font-size: 12px;
        line-height: 1.5;
    }
    .page { padding-bottom: 40px; }
    .content { padding: 0 44px; }

    /* ---------- Header ---------- */
    .header-band { width: 100%; background: #0f172a; }
    .header-band td { padding: 32px 44px 20px; vertical-align: top; }
    .brand-name { font-size: 20px; font-weight: bold; color: #ffffff; letter-spacing: 0.5px; text-transform: uppercase; }
    .brand-tag { font-size: 10px; color: #94a3b8; margin-top: 4px; letter-spacing: 1px; text-transform: uppercase; }
    .brand-logo { max-height: 48px; max-width: 170px; }
    .doc-title { font-size: 30px; font-weight: bold; color: #f97316; letter-spacing: 2px; text-align: right; }
    .doc-number { font-size: 11px; color: #cbd5e1; text-align: right; margin-top: 4px; letter-spacing: 0.5px; }
    .header-stripe { height: 6px; background: #f97316; font-size: 0; line-height: 0; }

    /* ---------- Parties ---------- */
    .parties { width: 100%; border-collapse: collapse; margin: 28px 0 20px; }
    .parties td { vertical-align: top; width: 50%; padding-right: 18px; }
    .party-badge {
        display: inline-block; background: #0f172a; color: #fff; font-size: 10px;
        font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;
        padding: 5px 12px; border-radius: 3px; margin-bottom: 8px;
    }
    .party-name { font-size: 13px; font-weight: bold; color: #111827; margin-top: 2px; }
    .party-line { font-size: 11px; color: #4b5563; margin-top: 2px; }

    /* ---------- Meta cards ---------- */
    .meta { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
    .meta td {
        width: 33.33%;
        background: #f9fafb;
        border: 1px solid #f1f1f4;
        padding: 12px 14px;
    }
    .meta td.mid { border-left: 0; border-right: 0; }
    .meta-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.8px; color: #9ca3af; font-weight: bold; }
    .meta-value { font-size: 13px; font-weight: bold; color: #111827; margin-top: 3px; }
    .overdue { color: #dc2626; }

    /* ---------- Status badge ---------- */
    .badge {
        display: inline-block; padding: 4px 12px; border-radius: 4px;
        font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .badge-pending   { background: #fef3c7; color: #92400e; }
    .badge-partial   { background: #dbeafe; color: #1e40af; }
    .badge-paid      { background: #d1fae5; color: #065f46; }
    .badge-overdue   { background: #fee2e2; color: #991b1b; }
    .badge-cancelled { background: #f3f4f6; color: #6b7280; }

    /* ---------- Items table ---------- */
    .items { width: 100%; border-collapse: collapse; margin: 26px 0 0; }
    .items thead th {
        background: #f97316; color: #fff; font-size: 10px; text-transform: uppercase;
        letter-spacing: 0.6px; padding: 11px 14px; text-align: left;
    }
    .items thead th.r { text-align: right; }
    .items tbody td { padding: 14px; border-bottom: 1px solid #eef0f3; vertical-align: top; }
    .items tbody td.r { text-align: right; }
    .item-title { font-size: 13px; font-weight: bold; color: #111827; }
    .item-desc { font-size: 11px; color: #6b7280; margin-top: 3px; }

    /* ---------- Bottom section: payment/contact + totals ---------- */
    .bottom { width: 100%; border-collapse: collapse; margin-top: 22px; }
    .bottom td { vertical-align: top; }
    .info-col { width: 30%; padding-right: 16px; }
    .info-badge {
        display: inline-block; background: #0f172a; color: #fff; font-size: 9px;
        font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;
        padding: 4px 10px; border-radius: 3px; margin-bottom: 8px;
    }
    .info-line { font-size: 10.5px; color: #4b5563; margin-top: 3px; }
    .info-line strong { color: #111827; }

    .tot-col { width: 40%; }
    .tot-row { width: 100%; border-collapse: collapse; }
    .tot-row td { padding: 7px 0; font-size: 12px; }
    .tot-row td.k { color: #6b7280; }
    .tot-row td.v { text-align: right; font-weight: bold; color: #111827; }
    .grand {
        background: #0f172a; color: #fff; border-radius: 6px; width: 100%; border-collapse: collapse;
    }
    .grand td { padding: 13px 16px; }
    .grand .gk { font-size: 12px; text-transform: uppercase; letter-spacing: 0.6px; color: #d1d5db; }
    .grand .gv { font-size: 18px; font-weight: bold; text-align: right; color: #f97316; }

    /* ---------- Notes ---------- */
    .notes { margin-top: 24px; padding: 14px 16px; background: #fffbeb; border-left: 3px solid #f97316; }
    .notes .label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #92400e; font-weight: bold; margin-bottom: 4px; }
    .notes p { font-size: 11px; color: #78350f; }

    /* ---------- Signature ---------- */
    .signature { width: 100%; border-collapse: collapse; margin-top: 44px; }
    .signature td { width: 50%; vertical-align: bottom; }
    .sig-image { max-height: 46px; max-width: 160px; margin-bottom: 4px; }
    .sig-line { border-top: 1px solid #9ca3af; width: 200px; padding-top: 6px; }
    .sig-name { font-size: 12px; font-weight: bold; color: #111827; }
    .sig-label { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-top: 2px; }

    /* ---------- Footer ---------- */
    .footer { margin-top: 30px; padding: 16px 44px 0; text-align: center; }
    .footer .thanks { font-size: 13px; font-weight: bold; color: #111827; }
    .footer .sub { font-size: 10px; color: #9ca3af; margin-top: 4px; }
    .footer-stripe { height: 8px; background: #0f172a; margin-top: 20px; font-size: 0; line-height: 0; }
    .footer-stripe-accent { height: 8px; background: #f97316; width: 35%; font-size: 0; line-height: 0; }

    .watermark-paid {
        position: absolute; top: 340px; left: 0; right: 0; text-align: center;
        font-size: 90px; font-weight: bold; color: #10b981; opacity: 0.08;
        letter-spacing: 8px;
    }
</style>
</head>
<body>
@php
    $statusLabels = [
        'pending' => 'Pending', 'partial' => 'Partial', 'paid' => 'Paid',
        'overdue' => 'Overdue', 'cancelled' => 'Cancelled',
    ];
    $amount  = (float) $invoice->amount;
    $paid    = (float) $invoice->paid_amount;
    $balance = max(0, $amount - $paid);
    $isOverdue = $invoice->due_date && $invoice->due_date->isPast() && $invoice->status !== 'paid';
    $symbol = ($invoice->currency ?? 'USD') === 'BDT' ? '৳' : '$';
    $hasBank = !empty($bank['name']) || !empty($bank['account_number']) || !empty($bank['account_name']);
@endphp

@if($invoice->status === 'paid')
    <div class="watermark-paid">PAID</div>
@endif

<div class="page">

    {{-- Header --}}
    <table class="header-band">
        <tr>
            <td style="width:55%;">
                @if(!empty($business['logo']))
                    <img src="{{ $business['logo'] }}" class="brand-logo" alt="logo">
                @else
                    <div class="brand-name">{{ $business['name'] }}</div>
                    @if(!empty($business['tagline']))
                        <div class="brand-tag">{{ $business['tagline'] }}</div>
                    @endif
                @endif
            </td>
            <td style="width:45%;">
                <div class="doc-title">INVOICE</div>
                <div class="doc-number">ID NO: {{ $invoice->invoice_number }}</div>
            </td>
        </tr>
    </table>
    <div class="header-stripe"></div>

    <div class="content">

    {{-- Invoice To / From --}}
    <table class="parties">
        <tr>
            <td>
                <span class="party-badge">Invoice From</span>
                <div class="party-name">{{ $business['name'] }}</div>
                @if(!empty($business['email']))<div class="party-line">{{ $business['email'] }}</div>@endif
                @if(!empty($business['phone']))<div class="party-line">{{ $business['phone'] }}</div>@endif
                @if(!empty($business['address']))<div class="party-line">{{ $business['address'] }}</div>@endif
            </td>
            <td>
                <span class="party-badge">Invoice To</span>
                <div class="party-name">{{ $invoice->client?->user?->name ?? 'Client' }}</div>
                @if($invoice->client?->company)<div class="party-line">{{ $invoice->client->company }}</div>@endif
                @if($invoice->client?->user?->email)<div class="party-line">{{ $invoice->client->user->email }}</div>@endif
                @if($invoice->client?->phone)<div class="party-line">{{ $invoice->client->phone }}</div>@endif
                @if($invoice->client?->address)<div class="party-line">{{ $invoice->client->address }}</div>@endif
            </td>
        </tr>
    </table>

    {{-- Meta --}}
    <table class="meta">
        <tr>
            <td>
                <div class="meta-label">Issue Date</div>
                <div class="meta-value">{{ $invoice->created_at?->format('d M Y') ?? '—' }}</div>
            </td>
            <td class="mid">
                <div class="meta-label">Due Date</div>
                <div class="meta-value {{ $isOverdue ? 'overdue' : '' }}">
                    {{ $invoice->due_date ? $invoice->due_date->format('d M Y') : '—' }}
                </div>
            </td>
            <td>
                <div class="meta-label">Status</div>
                <div style="margin-top:4px;">
                    <span class="badge badge-{{ $invoice->status }}">{{ $statusLabels[$invoice->status] ?? ucfirst($invoice->status) }}</span>
                </div>
            </td>
        </tr>
    </table>

    {{-- Line item (project milestone) --}}
    <table class="items">
        <thead>
            <tr>
                <th>Description</th>
                <th class="r">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <div class="item-title">{{ $invoice->project?->title ?? 'Project Milestone' }}</div>
                    <div class="item-desc">
                        {{ $invoice->notes ?: 'Project milestone payment' }}
                    </div>
                </td>
                <td class="r"><strong>{{ $symbol }}{{ number_format($amount, 2) }}</strong></td>
            </tr>
        </tbody>
    </table>

    {{-- Payment Method / Contact Info / Totals --}}
    <table class="bottom">
        <tr>
            <td class="info-col">
                @if($hasBank)
                    <span class="info-badge">Payment Method</span>
                    @if(!empty($bank['account_number']))<div class="info-line">A/C No: <strong>{{ $bank['account_number'] }}</strong></div>@endif
                    @if(!empty($bank['account_name']))<div class="info-line">A/C Name: <strong>{{ $bank['account_name'] }}</strong></div>@endif
                    @if(!empty($bank['name']))<div class="info-line">Bank: <strong>{{ $bank['name'] }}</strong></div>@endif
                    @if(!empty($bank['branch']))<div class="info-line">Branch: <strong>{{ $bank['branch'] }}</strong></div>@endif
                @endif
            </td>
            <td class="info-col">
                <span class="info-badge">Contact Info</span>
                @if(!empty($business['phone']))<div class="info-line">Phone: <strong>{{ $business['phone'] }}</strong></div>@endif
                @if(!empty($business['email']))<div class="info-line">Email: <strong>{{ $business['email'] }}</strong></div>@endif
            </td>
            <td class="tot-col">
                <table class="tot-row">
                    <tr>
                        <td class="k">Subtotal</td>
                        <td class="v">{{ $symbol }}{{ number_format($amount, 2) }}</td>
                    </tr>
                    @if($paid > 0)
                    <tr>
                        <td class="k">Amount Paid</td>
                        <td class="v" style="color:#10b981;">&minus; {{ $symbol }}{{ number_format($paid, 2) }}</td>
                    </tr>
                    @endif
                </table>
                <table class="grand" style="margin-top:8px;">
                    <tr>
                        <td class="gk">{{ $balance > 0 ? 'Balance Due' : 'Total' }}</td>
                        <td class="gv">{{ $symbol }}{{ number_format($balance > 0 ? $balance : $amount, 2) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- Notes --}}
    @if($invoice->notes)
    <div class="notes">
        <div class="label">Notes</div>
        <p>{{ $invoice->notes }}</p>
    </div>
    @endif

    {{-- Signature --}}
    <table class="signature">
        <tr>
            <td></td>
            <td style="text-align:right;">
                @if(!empty($signature['image']))
                    <img src="{{ $signature['image'] }}" class="sig-image" alt="signature" style="display:inline-block;">
                    <br>
                @endif
                <div class="sig-line" style="display:inline-block; text-align:center;">
                    <div class="sig-name">{{ $signature['name'] }}</div>
                    <div class="sig-label">Authorized Signature</div>
                </div>
            </td>
        </tr>
    </table>

    {{-- Footer --}}
    <div class="footer">
        <div class="thanks">Thank you for your business!</div>
        <div class="sub">
            {{ $business['name'] }}@if(!empty($business['email'])) &middot; {{ $business['email'] }}@endif
            @if(!empty($business['phone'])) &middot; {{ $business['phone'] }}@endif
        </div>
    </div>

    </div>

</div>

<div class="footer-stripe"></div>
</body>
</html>
