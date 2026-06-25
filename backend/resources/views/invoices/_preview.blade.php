@php
    $statusLabels = [
        'pending' => 'Pending', 'partial' => 'Partial', 'paid' => 'Paid',
        'overdue' => 'Overdue', 'cancelled' => 'Cancelled',
    ];
    $statusColors = [
        'pending'   => ['#fef3c7', '#92400e'],
        'partial'   => ['#dbeafe', '#1e40af'],
        'paid'      => ['#d1fae5', '#065f46'],
        'overdue'   => ['#fee2e2', '#991b1b'],
        'cancelled' => ['#f3f4f6', '#6b7280'],
    ];
    $st = $status ?: 'pending';
    [$badgeBg, $badgeFg] = $statusColors[$st] ?? $statusColors['pending'];
    $balance = max(0, $amount - $paid);
    $due = null;
    if (!empty($dueDate)) { try { $due = \Illuminate\Support\Carbon::parse($dueDate); } catch (\Throwable $e) {} }
@endphp

<div style="background:#ffffff;border-radius:12px;padding:24px;color:#1f2937;font-family:'Segoe UI',Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.35);font-size:13px;line-height:1.5;">

    {{-- Header --}}
    <div style="display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #111827;padding-bottom:14px;margin-bottom:16px;">
        <div>
            <div style="font-size:16px;font-weight:700;color:#111827;letter-spacing:-.3px;">{{ $business['name'] }}</div>
            @if(!empty($business['tagline']))
                <div style="font-size:11px;color:#6b7280;margin-top:2px;">{{ $business['tagline'] }}</div>
            @endif
        </div>
        <div style="text-align:right;">
            <div style="font-size:22px;font-weight:800;color:#f59e0b;letter-spacing:1px;">INVOICE</div>
            <div style="font-size:11px;color:#6b7280;">{{ $invoiceNumber ?: '—' }}</div>
        </div>
    </div>

    {{-- Bill To --}}
    <div style="margin-bottom:16px;">
        <div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;font-weight:700;margin-bottom:4px;">Bill To</div>
        <div style="font-size:13px;font-weight:700;color:#111827;">{{ $clientName ?: 'No client selected' }}</div>
        @if(!empty($clientCompany))<div style="font-size:11px;color:#6b7280;">{{ $clientCompany }}</div>@endif
        @if(!empty($clientEmail))<div style="font-size:11px;color:#6b7280;">{{ $clientEmail }}</div>@endif
    </div>

    {{-- Meta --}}
    <div style="display:flex;gap:8px;margin-bottom:16px;">
        <div style="flex:1;background:#f9fafb;border:1px solid #f1f1f4;border-radius:6px;padding:8px 10px;">
            <div style="font-size:8px;text-transform:uppercase;letter-spacing:.6px;color:#9ca3af;font-weight:700;">Due Date</div>
            <div style="font-size:12px;font-weight:700;color:{{ $due && $due->isPast() && $st !== 'paid' ? '#dc2626' : '#111827' }};">
                {{ $due ? $due->format('d M Y') : '—' }}
            </div>
        </div>
        <div style="flex:1;background:#f9fafb;border:1px solid #f1f1f4;border-radius:6px;padding:8px 10px;">
            <div style="font-size:8px;text-transform:uppercase;letter-spacing:.6px;color:#9ca3af;font-weight:700;">Status</div>
            <div style="margin-top:3px;">
                <span style="display:inline-block;padding:2px 9px;border-radius:4px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;background:{{ $badgeBg }};color:{{ $badgeFg }};">
                    {{ $statusLabels[$st] ?? ucfirst($st) }}
                </span>
            </div>
        </div>
    </div>

    {{-- Line item --}}
    <table style="width:100%;border-collapse:collapse;">
        <thead>
            <tr>
                <th style="background:#111827;color:#fff;font-size:9px;text-transform:uppercase;letter-spacing:.6px;padding:8px 10px;text-align:left;border-radius:4px 0 0 4px;">Description</th>
                <th style="background:#111827;color:#fff;font-size:9px;text-transform:uppercase;letter-spacing:.6px;padding:8px 10px;text-align:right;border-radius:0 4px 4px 0;">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding:11px 10px;border-bottom:1px solid #eef0f3;vertical-align:top;">
                    <div style="font-size:12px;font-weight:700;color:#111827;">{{ $projectTitle ?: 'Project Milestone' }}</div>
                    <div style="font-size:11px;color:#6b7280;margin-top:2px;">{{ $notes ?: 'Project milestone payment' }}</div>
                </td>
                <td style="padding:11px 10px;border-bottom:1px solid #eef0f3;text-align:right;font-weight:700;white-space:nowrap;">${{ number_format($amount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    {{-- Totals --}}
    <div style="margin-top:14px;">
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px;">
            <span style="color:#6b7280;">Subtotal</span>
            <span style="font-weight:700;">${{ number_format($amount, 2) }}</span>
        </div>
        @if($paid > 0)
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px;">
            <span style="color:#6b7280;">Amount Paid</span>
            <span style="font-weight:700;color:#10b981;">&minus; ${{ number_format($paid, 2) }}</span>
        </div>
        @endif
        <div style="display:flex;justify-content:space-between;align-items:center;background:#111827;border-radius:6px;padding:11px 14px;margin-top:8px;">
            <span style="font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:#d1d5db;">{{ $balance > 0 ? 'Balance Due' : 'Total' }}</span>
            <span style="font-size:16px;font-weight:800;color:#f59e0b;">${{ number_format($balance > 0 ? $balance : $amount, 2) }}</span>
        </div>
    </div>

</div>
