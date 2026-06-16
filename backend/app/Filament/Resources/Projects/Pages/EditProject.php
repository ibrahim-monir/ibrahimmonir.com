<?php

namespace App\Filament\Resources\Projects\Pages;

use App\Filament\Resources\Projects\ProjectResource;
use App\Models\Invoice;
use App\Models\Project;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditProject extends EditRecord
{
    protected static string $resource = ProjectResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('generateInvoice')
                ->label('Generate Invoice')
                ->icon('heroicon-o-document-currency-dollar')
                ->color('success')
                ->schema(fn (Project $record) => [
                    TextInput::make('invoice_number')
                        ->label('Invoice #')
                        ->required()
                        ->default('INV-' . strtoupper(substr(uniqid(), -6))),

                    TextInput::make('amount')
                        ->label('Total Amount ($)')
                        ->numeric()
                        ->prefix('$')
                        ->required()
                        ->minValue(0)
                        ->default($record->budget ?? null)
                        ->reactive(),

                    DatePicker::make('due_date')
                        ->label('Due Date')
                        ->native(false),

                    Textarea::make('notes')
                        ->rows(2)
                        ->nullable(),

                    Toggle::make('split')
                        ->label('Split into installments')
                        ->reactive()
                        ->default(false),

                    Repeater::make('installments')
                        ->label('Installments')
                        ->hidden(fn (callable $get) => ! $get('split'))
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
                            ['label' => '1st Installment', 'amount' => '', 'due_date' => null],
                            ['label' => '2nd Installment', 'amount' => '', 'due_date' => null],
                        ]),
                ])
                ->action(function (array $data, Project $record) {
                    $isSplit = $data['split'] ?? false;

                    if ($isSplit) {
                        $installments = $data['installments'] ?? [];
                        if (empty($installments)) {
                            Notification::make()->title('Add at least 2 installments')->danger()->send();
                            return;
                        }

                        $splitTotal = collect($installments)->sum(fn ($i) => (float) $i['amount']);
                        if (abs($splitTotal - (float) $data['amount']) > 0.01) {
                            Notification::make()
                                ->title('Installment total ($' . number_format($splitTotal, 2) . ') must equal the amount ($' . number_format($data['amount'], 2) . ')')
                                ->danger()
                                ->send();
                            return;
                        }

                        foreach ($installments as $idx => $inst) {
                            Invoice::create([
                                'project_id'     => $record->id,
                                'client_id'      => $record->client_id,
                                'invoice_number' => $data['invoice_number'] . '-' . ($idx + 1),
                                'amount'         => $inst['amount'],
                                'paid_amount'    => 0,
                                'status'         => 'pending',
                                'due_date'       => $inst['due_date'] ?? null,
                                'notes'          => $inst['label'] . ($data['notes'] ? ' · ' . $data['notes'] : ''),
                            ]);
                        }

                        Notification::make()
                            ->title(count($installments) . ' installment invoices created')
                            ->success()
                            ->send();

                        $this->redirect('/admin/invoices');
                    } else {
                        $invoice = Invoice::create([
                            'project_id'     => $record->id,
                            'client_id'      => $record->client_id,
                            'invoice_number' => $data['invoice_number'],
                            'amount'         => $data['amount'],
                            'paid_amount'    => 0,
                            'status'         => 'pending',
                            'due_date'       => $data['due_date'] ?? null,
                            'notes'          => $data['notes'] ?? null,
                        ]);

                        Notification::make()
                            ->title('Invoice ' . $invoice->invoice_number . ' created')
                            ->success()
                            ->send();

                        $this->redirect('/admin/invoices/' . $invoice->id . '/edit');
                    }
                })
                ->modalHeading('Generate Invoice for this Project')
                ->modalSubmitActionLabel('Create Invoice')
                ->modalWidth('3xl'),

            DeleteAction::make(),
        ];
    }
}
