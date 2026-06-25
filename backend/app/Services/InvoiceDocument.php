<?php

namespace App\Services;

use App\Models\Invoice;
use App\Models\SiteSetting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

/**
 * Builds the branded invoice document shared by the browser preview,
 * the PDF download and the e-mail attachment, so all three stay identical.
 */
class InvoiceDocument
{
    public function __construct(private Invoice $invoice) {}

    public static function for(Invoice $invoice): self
    {
        return new self($invoice);
    }

    /**
     * Data passed to the invoices.document Blade view.
     */
    public function data(): array
    {
        $invoice = $this->invoice->loadMissing(['client.user', 'project']);
        $s = SiteSetting::getAll();

        return [
            'invoice'  => $invoice,
            'business' => [
                'name'    => $s['site_name']      ?? config('app.name', 'Ibrahim Monir'),
                'tagline' => $s['site_tagline']   ?? null,
                'email'   => $s['contact_email']  ?? ($s['site_email'] ?? null),
                'phone'   => $s['contact_phone']  ?? null,
                'address' => $s['contact_address'] ?? null,
                'logo'    => $this->logoDataUri($s['site_logo'] ?? null),
            ],
        ];
    }

    /**
     * Rendered HTML for the in-browser preview.
     */
    public function html(): string
    {
        return view('invoices.document', $this->data())->render();
    }

    /**
     * dompdf instance for streaming/downloading/attaching.
     */
    public function pdf()
    {
        return Pdf::loadView('invoices.document', $this->data())
            ->setPaper('a4', 'portrait');
    }

    public function fileName(): string
    {
        return 'Invoice-' . $this->invoice->invoice_number . '.pdf';
    }

    /**
     * Embed the logo as a base64 data URI so dompdf renders it without
     * needing remote access or the storage symlink.
     */
    private function logoDataUri(?string $logo): ?string
    {
        if (! $logo) {
            return null;
        }

        try {
            if (! Storage::disk('public')->exists($logo)) {
                return null;
            }
            $contents = Storage::disk('public')->get($logo);
            $mime = Storage::disk('public')->mimeType($logo) ?: 'image/png';

            return 'data:' . $mime . ';base64,' . base64_encode($contents);
        } catch (\Throwable $e) {
            return null;
        }
    }
}
