<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $client = $request->user()->client;

        if (! $client) {
            return response()->json(['invoices' => []]);
        }

        $invoices = Invoice::with('project')
            ->where('client_id', $client->id)
            ->latest()
            ->get();

        return response()->json(['invoices' => $invoices]);
    }

    public function show(Request $request, string $id)
    {
        $client = $request->user()->client;

        $invoice = Invoice::with('project')
            ->where('client_id', $client?->id)
            ->findOrFail($id);

        return response()->json(['invoice' => $invoice]);
    }
}
