<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Invoice {{ $invoice->invoice_number }}</title>
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { margin: 0; }
    body {
        font-family: 'DejaVu Sans', 'Helvetica', sans-serif;
        color: #1f2937;
        font-size: 12px;
        line-height: 1.5;
    }
    .page { padding: 40px 44px; }

    /* ---------- Header ---------- */
    .header { width: 100%; border-collapse: collapse; }
    .header td { vertical-align: top; }
    .brand-name { font-size: 22px; font-weight: bold; color: #111827; letter-spacing: -0.3px; }
    .brand-tag { font-size: 11px; color: #6b7280; margin-top: 2px; }
    .brand-logo { max-height: 52px; max-width: 180px; }
    .doc-title { font-size: 30px; font-weight: bold; color: #f59e0b; letter-spacing: 1px; text-align: right; }
    .doc-number { font-size: 12px; color: #6b7280; text-align: right; margin-top: 2px; }

    .rule { height: 3px; background: #111827; margin: 18px 0 22px; font-size: 0; line-height: 0; }

    /* ---------- Parties ---------- */
    .parties { width: 100%; border-collapse: collapse; margin-bottom: 26px; }
    .parties td { vertical-align: top; width: 50%; padding-right: 18px; }
    .block-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; font-weight: bold; margin-bottom: 6px; }
    .party-name { font-size: 13px; font-weight: bold; color: #111827; }
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
        background: #111827; color: #fff; font-size: 10px; text-transform: uppercase;
        letter-spacing: 0.6px; padding: 11px 14px; text-align: left;
    }
    .items thead th.r { text-align: right; }
    .items tbody td { padding: 14px; border-bottom: 1px solid #eef0f3; vertical-align: top; }
    .items tbody td.r { text-align: right; }
    .item-title { font-size: 13px; font-weight: bold; color: #111827; }
    .item-desc { font-size: 11px; color: #6b7280; margin-top: 3px; }

    /* ---------- Totals ---------- */
    .totals { width: 100%; border-collapse: collapse; margin-top: 18px; }
    .totals td { vertical-align: top; }
    .totals .spacer { width: 55%; }
    .tot-row { width: 100%; border-collapse: collapse; }
    .tot-row td { padding: 7px 0; font-size: 12px; }
    .tot-row td.k { color: #6b7280; }
    .tot-row td.v { text-align: right; font-weight: bold; color: #111827; }
    .grand {
        background: #111827; color: #fff; border-radius: 6px;
    }
    .grand td { padding: 13px 16px; }
    .grand .gk { font-size: 12px; text-transform: uppercase; letter-spacing: 0.6px; color: #d1d5db; }
    .grand .gv { font-size: 18px; font-weight: bold; text-align: right; color: #f59e0b; }

    /* ---------- Notes / footer ---------- */
    .notes { margin-top: 30px; padding: 14px 16px; background: #fffbeb; border-left: 3px solid #f59e0b; }
    .notes .block-label { color: #92400e; }
    .notes p { font-size: 11px; color: #78350f; }

    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; }
    .footer .thanks { font-size: 13px; font-weight: bold; color: #111827; }
    .footer .sub { font-size: 10px; color: #9ca3af; margin-top: 4px; }

    .watermark-paid {
        position: absolute; top: 300px; left: 0; right: 0; text-align: center;
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
@endphp

@if($invoice->status === 'paid')
    <div class="watermark-paid">PAID</div>
@endif

<div class="page">

    {{-- Header --}}
    <table class="header">
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
                <div class="doc-number">{{ $invoice->invoice_number }}</div>
            </td>
        </tr>
    </table>

    <div class="rule"></div>

    {{-- From / Bill To --}}
    <table class="parties">
        <tr>
            <td>
                <div class="block-label">From</div>
                <div class="party-name">{{ $business['name'] }}</div>
                @if(!empty($business['email']))<div class="party-line">{{ $business['email'] }}</div>@endif
                @if(!empty($business['phone']))<div class="party-line">{{ $business['phone'] }}</div>@endif
                @if(!empty($business['address']))<div class="party-line">{{ $business['address'] }}</div>@endif
            </td>
            <td>
                <div class="block-label">Bill To</div>
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
                <td class="r"><strong>${{ number_format($amount, 2) }}</strong></td>
            </tr>
        </tbody>
    </table>

    {{-- Totals --}}
    <table class="totals">
        <tr>
            <td class="spacer"></td>
            <td>
                <table class="tot-row">
                    <tr>
                        <td class="k">Subtotal</td>
                        <td class="v">${{ number_format($amount, 2) }}</td>
                    </tr>
                    @if($paid > 0)
                    <tr>
                        <td class="k">Amount Paid</td>
                        <td class="v" style="color:#10b981;">&minus; ${{ number_format($paid, 2) }}</td>
                    </tr>
                    @endif
                </table>
                <table class="grand" style="margin-top:8px;">
                    <tr>
                        <td class="gk">{{ $balance > 0 ? 'Balance Due' : 'Total' }}</td>
                        <td class="gv">${{ number_format($balance > 0 ? $balance : $amount, 2) }}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    {{-- Notes --}}
    @if($invoice->notes)
    <div class="notes">
        <div class="block-label">Notes</div>
        <p>{{ $invoice->notes }}</p>
    </div>
    @endif

    {{-- Footer --}}
    <div class="footer">
        <div class="thanks">Thank you for your business!</div>
        <div class="sub">
            {{ $business['name'] }}@if(!empty($business['email'])) &middot; {{ $business['email'] }}@endif
            @if(!empty($business['phone'])) &middot; {{ $business['phone'] }}@endif
        </div>
    </div>

</div>
</body>
</html>
