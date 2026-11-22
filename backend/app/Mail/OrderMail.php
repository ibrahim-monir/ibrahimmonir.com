<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * One mailable, two audiences: the admin gets the full order to verify the
 * payment; the customer gets a receipt with what happens next.
 */
class OrderMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public bool $forAdmin = false,
        public string $event = 'placed', // placed | confirmed | rejected
        // Portal login for the customer receipt: ['status' => created|existing, 'email' => ..., 'password' => ...]
        public ?array $account = null,
    ) {}

    public function envelope(): Envelope
    {
        $o = $this->order;

        $subject = match (true) {
            $this->forAdmin                => "New order {$o->order_number}: {$o->package_title} ({$o->formattedAmount()} via {$o->methodLabel()})",
            $this->event === 'confirmed'   => "Payment confirmed: order {$o->order_number}",
            $this->event === 'rejected'    => "About your order {$o->order_number}",
            default                        => "We received your order {$o->order_number}",
        };

        return new Envelope(
            subject: $subject,
            replyTo: $this->forAdmin ? [$o->email] : [],
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.order');
    }

    public function attachments(): array
    {
        return [];
    }
}
