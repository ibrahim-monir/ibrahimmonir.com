<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .card { background: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .header { background: #0f172a; color: #ffffff; padding: 24px 32px; }
        .header h1 { margin: 0; font-size: 20px; }
        .body { padding: 32px; }
        .field { margin-bottom: 20px; }
        .label { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #6b7280; margin-bottom: 4px; }
        .value { font-size: 15px; color: #111827; }
        .message-box { background: #f9fafb; border-left: 4px solid #6366f1; padding: 16px; border-radius: 4px; color: #374151; line-height: 1.6; }
        .footer { padding: 16px 32px; background: #f9fafb; font-size: 12px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>New Contact Message</h1>
        </div>
        <div class="body">
            <div class="field">
                <div class="label">Name</div>
                <div class="value">{{ $senderName }}</div>
            </div>
            <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:{{ $senderEmail }}">{{ $senderEmail }}</a></div>
            </div>
            @if($phone)
            <div class="field">
                <div class="label">Phone</div>
                <div class="value">{{ $phone }}</div>
            </div>
            @endif
            <div class="field">
                <div class="label">Subject</div>
                <div class="value">{{ $subject }}</div>
            </div>
            <div class="field">
                <div class="label">Message</div>
                <div class="message-box">{{ $body }}</div>
            </div>
        </div>
        <div class="footer">
            Sent from ibrahimmonir.com contact form
        </div>
    </div>
</body>
</html>
