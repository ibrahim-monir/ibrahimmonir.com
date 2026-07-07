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
    $symbol = ($currency ?? 'USD') === 'BDT' ? '৳' : '$';
    $due = null;
    if (!empty($dueDate)) { try { $due = \Illuminate\Support\Carbon::parse($dueDate); } catch (\Throwable $e) {} }
@endphp

<div style="background:#ffffff;border-radius:12px;overflow:hidden;color:#1f2937;font-family:'Segoe UI',Arial,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.35);font-size:13px;line-height:1.5;">

    {{-- Header band --}}
    <div style="background:#0f172a;padding:16px 18px 12px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
                <div style="font-size:14px;font-weight:700;color:#fff;letter-spacing:-.2px;text-transform:uppercase;">{{ $business['name'] }}</div>
                @if(!empty($business['tagline']))
                    <div style="font-size:9px;color:#94a3b8;margin-top:2px;letter-spacing:.5px;text-transform:uppercase;">{{ $business['tagline'] }}</div>
                @endif
            </div>
            <div style="text-align:right;">
                <div style="font-size:19px;font-weight:800;color:#f97316;letter-spacing:1px;">INVOICE</div>
                <div style="font-size:10px;color:#cbd5e1;">{{ $invoiceNumber ?: '—' }}</div>
            </div>
        </div>
    </div>
    <div style="height:4px;background:#f97316;"></div>

    <div style="padding:18px;">

    {{-- Invoice To --}}
    <div style="margin-bottom:16px;">
        <span style="display:inline-block;background:#0f172a;color:#fff;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;padding:4px 10px;border-radius:3px;margin-bottom:6px;">Invoice To</span>
        <div style="font-size:13px;font-weight:700;color:#111827;margin-top:2px;">{{ $clientName ?: 'No client selected' }}</div>
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
                <th style="background:#f97316;color:#fff;font-size:9px;text-transform:uppercase;letter-spacing:.6px;padding:8px 10px;text-align:left;border-radius:4px 0 0 4px;">Description</th>
                <th style="background:#f97316;color:#fff;font-size:9px;text-transform:uppercase;letter-spacing:.6px;padding:8px 10px;text-align:right;border-radius:0 4px 4px 0;">Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="padding:11px 10px;border-bottom:1px solid #eef0f3;vertical-align:top;">
                    <div style="font-size:12px;font-weight:700;color:#111827;">
                        {{ $projectTitle ?: 'Project Milestone' }}
                        @if(!empty($milestoneNo))
                            &mdash; Milestone {{ $milestoneNo }}@if(!empty($totalMilestones)) of {{ $totalMilestones }}@endif
                        @elseif(!empty($totalMilestones))
                            &mdash; {{ $totalMilestones }} Milestones Total
                        @endif
                    </div>
                    <div style="font-size:11px;color:#6b7280;margin-top:2px;">{{ $notes ?: 'Project milestone payment' }}</div>
                    @if(!empty($totalBudget))
                    <div style="font-size:10px;color:#9ca3af;margin-top:3px;">Total project budget: {{ $symbol }}{{ number_format((float) $totalBudget, 2) }}</div>
                    @endif
                </td>
                <td style="padding:11px 10px;border-bottom:1px solid #eef0f3;text-align:right;font-weight:700;white-space:nowrap;">{{ $symbol }}{{ number_format($amount, 2) }}</td>
            </tr>
        </tbody>
    </table>

    {{-- Totals --}}
    <div style="margin-top:14px;">
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px;">
            <span style="color:#6b7280;">Subtotal</span>
            <span style="font-weight:700;">{{ $symbol }}{{ number_format($amount, 2) }}</span>
        </div>
        @if($paid > 0)
        <div style="display:flex;justify-content:space-between;padding:5px 0;font-size:12px;">
            <span style="color:#6b7280;">Amount Paid</span>
            <span style="font-weight:700;color:#10b981;">&minus; {{ $symbol }}{{ number_format($paid, 2) }}</span>
        </div>
        @endif
        <div style="display:flex;justify-content:space-between;align-items:center;background:#0f172a;border-radius:6px;padding:11px 14px;margin-top:8px;">
            <span style="font-size:11px;text-transform:uppercase;letter-spacing:.6px;color:#d1d5db;">{{ $balance > 0 ? 'Balance Due' : 'Total' }}</span>
            <span style="font-size:16px;font-weight:800;color:#f97316;">{{ $symbol }}{{ number_format($balance > 0 ? $balance : $amount, 2) }}</span>
        </div>
    </div>

    {{-- Signature --}}
    <div style="display:flex;justify-content:flex-end;margin-top:28px;">
        <div style="text-align:center;">
            @if(!empty($signature['image']))
                <img src="{{ $signature['image'] }}" alt="signature" style="max-height:34px;max-width:120px;display:block;margin:0 auto 4px;">
            @endif
            <div style="border-top:1px solid #9ca3af;padding-top:4px;min-width:140px;">
                <div style="font-size:11px;font-weight:700;color:#111827;">{{ $signature['name'] ?? $business['name'] }}</div>
                <div style="font-size:8px;text-transform:uppercase;letter-spacing:.8px;color:#9ca3af;margin-top:1px;">Authorized Signature</div>
            </div>
        </div>
    </div>

    {{-- Footer --}}
    <div style="margin-top:20px;padding-top:12px;border-top:1px solid #e5e7eb;text-align:center;">
        <div style="font-size:11px;font-weight:700;color:#111827;">Thank you for your business!</div>
        <div style="font-size:9px;color:#9ca3af;margin-top:3px;">
            {{ $business['name'] }}@if(!empty($business['email'])) &middot; {{ $business['email'] }}@endif
            @if(!empty($business['phone'])) &middot; {{ $business['phone'] }}@endif
        </div>
    </div>

    </div>
</div>
