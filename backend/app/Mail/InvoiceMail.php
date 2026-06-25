<?php

namespace App\Mail;

use App\Models\Invoice;
use App\Services\InvoiceDocument;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public Invoice $invoice,
        public string  $customMessage = ''
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Invoice ' . $this->invoice->invoice_number . ' from ' . config('app.name'),
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.invoice');
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        $doc = InvoiceDocument::for($this->invoice);

        return [
            Attachment::fromData(fn () => $doc->pdf()->output(), $doc->fileName())
                ->withMime('application/pdf'),
        ];
    }
}
