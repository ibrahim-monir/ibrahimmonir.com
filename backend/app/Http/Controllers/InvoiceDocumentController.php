<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Services\InvoiceDocument;
use Illuminate\Http\Response;

class InvoiceDocumentController extends Controller
{
    /**
     * Render the invoice in the browser so it can be reviewed before sending.
     */
    public function preview(Invoice $invoice): Response
    {
        return response(InvoiceDocument::for($invoice)->html());
    }

    /**
     * Stream the invoice PDF inline (opens in the browser's PDF viewer).
     */
    public function pdf(Invoice $invoice): Response
    {
        $doc = InvoiceDocument::for($invoice);

        return $doc->pdf()->stream($doc->fileName());
    }

    /**
     * Force-download the invoice PDF.
     */
    public function download(Invoice $invoice): Response
    {
        $doc = InvoiceDocument::for($invoice);

        return $doc->pdf()->download($doc->fileName());
    }
}
