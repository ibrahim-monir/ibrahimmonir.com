<?php

use App\Http\Controllers\InvoiceDocumentController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/*
| Invoice document routes — admin-only (same session guard as the Filament
| panel). Used by the "Preview" and "Download PDF" actions on invoices.
*/
Route::middleware('auth')->group(function () {
    Route::get('/admin/invoices/{invoice}/preview', [InvoiceDocumentController::class, 'preview'])
        ->name('invoices.preview');

    Route::get('/admin/invoices/{invoice}/pdf', [InvoiceDocumentController::class, 'pdf'])
        ->name('invoices.pdf');

    Route::get('/admin/invoices/{invoice}/download', [InvoiceDocumentController::class, 'download'])
        ->name('invoices.download');
});
