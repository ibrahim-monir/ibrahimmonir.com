<?php

namespace App\Filament\Resources\Invoices\Pages;

use App\Filament\Resources\Invoices\InvoiceResource;
use App\Mail\InvoiceMail;
use App\Models\Invoice;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Mail;

class EditInvoice extends EditRecord
{
    protected static string $resource = InvoiceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('splitInvoice')
                ->label('Split Invoice')
                ->icon('heroicon-o-scissors')
                ->color('warning')
                ->modalDescription(fn (Invoice $record) =>
                    'Invoice ' . $record->invoice_number . ' · Total $' . number_format($record->amount, 2) .
                    ' — define installments below. Amounts must add up to the total.'
                )
                ->schema(fn (Invoice $record) => [
                    Repeater::make('installments')
                        ->label('Installments')
                        ->schema([
                            TextInput::make('label')
                                ->label('Label')
                                ->required()
                                ->placeholder('e.g. 1st Installment'),

                            TextInput::make('amount')
                                ->label('Amount ($)')
                                ->numeric()
                                ->prefix('$')
                                ->required()
                                ->minValue(0.01),

                            DatePicker::make('due_date')
                                ->label('Due Date')
                                ->native(false),
                        ])
                        ->columns(3)
                        ->minItems(2)
                        ->maxItems(6)
                        ->addActionLabel('+ Add Installment')
                        ->default([
                            [
                                'label'    => '1st Installment',
                                'amount'   => number_format($record->amount / 2, 2, '.', ''),
                                'due_date' => null,
                            ],
                            [
                                'label'    => '2nd Installment',
                                'amount'   => number_format($record->amount / 2, 2, '.', ''),
                                'due_date' => null,
                            ],
                        ]),
                ])
                ->action(function (array $data, Invoice $record) {
                    $installments = $data['installments'];

                    $splitTotal = collect($installments)->sum(fn ($i) => (float) $i['amount']);
                    if (abs($splitTotal - (float) $record->amount) > 0.01) {
                        Notification::make()
                            ->title('Split total $' . number_format($splitTotal, 2) . ' ≠ invoice total $' . number_format($record->amount, 2))
                            ->danger()
                            ->send();
                        return;
                    }

                    foreach ($installments as $idx => $inst) {
                        Invoice::create([
                            'project_id'     => $record->project_id,
                            'client_id'      => $record->client_id,
                            'invoice_number' => $record->invoice_number . '-' . ($idx + 1),
                            'amount'         => $inst['amount'],
                            'paid_amount'    => 0,
                            'status'         => 'pending',
                            'due_date'       => $inst['due_date'] ?? null,
                            'notes'          => $inst['label'] . ($record->notes ? ' · ' . $record->notes : ''),
                        ]);
                    }

                    $record->update(['status' => 'cancelled']);

                    Notification::make()
                        ->title(count($installments) . ' installment invoices created — original cancelled')
                        ->success()
                        ->send();

                    $this->redirect('/admin/invoices');
                })
                ->modalHeading('Split Invoice into Installments')
                ->modalSubmitActionLabel('Create Installments')
                ->modalWidth('4xl'),

            Action::make('sendEmail')
                ->label('Send Invoice Email')
                ->icon('heroicon-o-envelope')
                ->color('primary')
                ->modalDescription(fn (Invoice $record) =>
                    'Sending to: ' . ($record->client?->user?->email ?? 'No email on file')
                )
                ->schema([
                    Textarea::make('message')
                        ->label('Custom message (optional)')
                        ->rows(3)
                        ->placeholder('Hi, please find your invoice details below...'),
                ])
                ->action(function (array $data, Invoice $record) {
                    $email = $record->client?->user?->email;
                    if (! $email) {
                        Notification::make()->title('No email address found for this client')->danger()->send();
                        return;
                    }
                    Mail::to($email)->send(new InvoiceMail($record, $data['message'] ?? ''));
                    $record->update(['sent_at' => now()]);
                    Notification::make()
                        ->title('Invoice sent to ' . $email)
                        ->success()
                        ->send();
                })
                ->modalHeading('Send Invoice by Email')
                ->modalSubmitActionLabel('Send Now'),

            Action::make('recordPayment')
                ->label('Record Payment')
                ->icon('heroicon-o-banknotes')
                ->color('success')
                ->schema(fn (Invoice $record) => [
                    TextInput::make('paid_amount')
                        ->label('Amount Paid ($)')
                        ->numeric()
                        ->prefix('$')
                        ->required()
                        ->default(fn () => $record->paid_amount)
                        ->minValue(0)
                        ->maxValue(fn () => $record->amount),

                    DateTimePicker::make('paid_at')
                        ->label('Payment Date')
                        ->native(false)
                        ->default(now()),
                ])
                ->action(function (array $data, Invoice $record) {
                    $record->paid_amount = $data['paid_amount'];
                    $record->paid_at     = $data['paid_at'];
                    $record->recalculateStatus();

                    Notification::make()
                        ->title('Payment of $' . number_format($data['paid_amount'], 2) . ' recorded')
                        ->success()
                        ->send();

                    $this->refreshFormData(['status', 'paid_amount', 'paid_at']);
                })
                ->modalHeading('Record Payment')
                ->modalSubmitActionLabel('Save Payment'),

            DeleteAction::make(),
        ];
    }
}
