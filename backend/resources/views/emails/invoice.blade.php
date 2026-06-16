<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Invoice {{ $invoice->invoice_number }}</title>
<style>
  body  { margin:0; padding:0; background:#f3f4f6; font-family:'Segoe UI',Arial,sans-serif; color:#1f2937; }
  .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.08); }
  .hdr  { background:#111827; padding:32px; }
  .hdr h1 { margin:0; font-size:22px; color:#f59e0b; letter-spacing:-.5px; }
  .hdr p  { margin:4px 0 0; font-size:13px; color:#9ca3af; }
  .body { padding:32px; }
  .msg  { background:#fef3c7; border-left:4px solid #f59e0b; border-radius:6px; padding:12px 16px; font-size:14px; margin-bottom:24px; color:#92400e; }
  .row  { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid #f3f4f6; font-size:14px; }
  .row:last-child { border-bottom:none; }
  .label { color:#6b7280; }
  .value { font-weight:600; }
  .amount-box { background:#f9fafb; border-radius:8px; padding:20px; margin:20px 0; }
  .amount-row { display:flex; justify-content:space-between; font-size:14px; margin-bottom:8px; }
  .amount-row.total { font-size:18px; font-weight:700; padding-top:12px; border-top:2px solid #e5e7eb; }
  .balance { color:#ef4444; }
  .badge { display:inline-block; padding:3px 12px; border-radius:999px; font-size:12px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; }
  .badge-pending  { background:#fef3c7; color:#92400e; }
  .badge-partial  { background:#dbeafe; color:#1e40af; }
  .badge-paid     { background:#d1fae5; color:#065f46; }
  .badge-overdue  { background:#fee2e2; color:#991b1b; }
  .badge-cancelled{ background:#f3f4f6; color:#6b7280; }
  .cta  { text-align:center; margin:28px 0; }
  .btn  { display:inline-block; background:#f59e0b; color:#000; font-weight:700; text-decoration:none; padding:12px 28px; border-radius:8px; font-size:14px; }
  .ftr  { background:#f9fafb; padding:20px 32px; text-align:center; font-size:12px; color:#9ca3af; border-top:1px solid #f3f4f6; }
</style>
</head>
<body>
<div class="wrap">

  <div class="hdr">
    <h1>{{ config('app.name') }}</h1>
    <p>Invoice {{ $invoice->invoice_number }}</p>
  </div>

  <div class="body">

    @if($customMessage)
      <div class="msg">{{ $customMessage }}</div>
    @else
      <p style="font-size:15px;margin-top:0;">
        Hi {{ $invoice->client?->user?->name ?? 'there' }},<br>
        Please find your invoice details below. If you have any questions, don't hesitate to reply to this email.
      </p>
    @endif

    <div class="row">
      <span class="label">Invoice #</span>
      <span class="value">{{ $invoice->invoice_number }}</span>
    </div>
    <div class="row">
      <span class="label">Project</span>
      <span class="value">{{ $invoice->project?->title ?? '—' }}</span>
    </div>
    <div class="row">
      <span class="label">Issue Date</span>
      <span class="value">{{ $invoice->created_at->format('d M Y') }}</span>
    </div>
    @if($invoice->due_date)
    <div class="row">
      <span class="label">Due Date</span>
      <span class="value {{ $invoice->due_date->isPast() && $invoice->status !== 'paid' ? 'balance' : '' }}">
        {{ $invoice->due_date->format('d M Y') }}
      </span>
    </div>
    @endif
    <div class="row">
      <span class="label">Status</span>
      <span class="badge badge-{{ $invoice->status }}">{{ ucfirst($invoice->status) }}</span>
    </div>

    <div class="amount-box">
      <div class="amount-row">
        <span style="color:#6b7280;">Total Amount</span>
        <span>${{ number_format($invoice->amount, 2) }}</span>
      </div>
      @if((float)$invoice->paid_amount > 0)
      <div class="amount-row">
        <span style="color:#6b7280;">Amount Paid</span>
        <span style="color:#10b981;">– ${{ number_format($invoice->paid_amount, 2) }}</span>
      </div>
      @endif
      <div class="amount-row total">
        <span>Balance Due</span>
        <span class="{{ $invoice->balance() > 0 ? 'balance' : '' }}">${{ number_format($invoice->balance(), 2) }}</span>
      </div>
    </div>

    @if($invoice->notes)
      <p style="font-size:13px;color:#6b7280;margin:0 0 20px;"><strong>Notes:</strong> {{ $invoice->notes }}</p>
    @endif

    <div class="cta">
      <a href="{{ config('app.frontend_url') }}/portal/invoices" class="btn">View in Client Portal →</a>
    </div>

  </div>

  <div class="ftr">
    © {{ date('Y') }} {{ config('app.name') }} · This is an automated invoice notification.
  </div>

</div>
</body>
</html>
