<?php

namespace App\Filament\Resources\Invoices\Schemas;

use App\Models\Client;
use App\Models\Project;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class InvoiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Grid::make(2)->schema([
                    Section::make('Invoice Details')->schema([
                        TextInput::make('invoice_number')
                            ->label('Invoice #')
                            ->required()
                            ->unique(ignoreRecord: true)
                            ->default(fn () => 'INV-' . strtoupper(substr(uniqid(), -6))),

                        Select::make('client_id')
                            ->label('Client')
                            ->options(
                                Client::with('user')
                                    ->get()
                                    ->mapWithKeys(fn ($c) => [$c->id => $c->user?->name . ($c->company ? " ({$c->company})" : '')])
                            )
                            ->searchable()
                            ->required()
                            ->reactive()
                            ->afterStateUpdated(fn (callable $set) => $set('project_id', null)),

                        Select::make('project_id')
                            ->label('Project')
                            ->options(fn (callable $get) =>
                                Project::where('client_id', $get('client_id'))->pluck('title', 'id')
                            )
                            ->searchable()
                            ->required(),

                        Select::make('status')
                            ->options([
                                'pending'   => 'Pending',
                                'partial'   => 'Partial Payment',
                                'paid'      => 'Paid',
                                'overdue'   => 'Overdue',
                                'cancelled' => 'Cancelled',
                            ])
                            ->default('pending')
                            ->required(),
                    ]),

                    Section::make('Amount & Dates')->schema([
                        TextInput::make('amount')
                            ->label('Total Amount')
                            ->numeric()
                            ->prefix('$')
                            ->required()
                            ->minValue(0),

                        TextInput::make('paid_amount')
                            ->label('Amount Paid')
                            ->numeric()
                            ->prefix('$')
                            ->default(0)
                            ->minValue(0),

                        DatePicker::make('due_date')->native(false),

                        DateTimePicker::make('paid_at')->label('Paid At')->native(false)->nullable(),

                        Textarea::make('notes')->rows(3)->nullable(),
                    ]),
                ]),
            ]);
    }
}
