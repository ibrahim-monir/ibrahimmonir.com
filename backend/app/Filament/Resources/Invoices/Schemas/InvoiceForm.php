<?php

namespace App\Filament\Resources\Invoices\Schemas;

use App\Models\Client;
use App\Models\Project;
use App\Models\SiteSetting;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\HtmlString;

class InvoiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(3)
            ->components([
                // ---- Left: form fields (2/3) ----
                Group::make()
                    ->columnSpan(2)
                    ->schema([
                        Grid::make(2)->schema([
                            Section::make('Invoice Details')->schema([
                                TextInput::make('invoice_number')
                                    ->label('Invoice #')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->default(fn () => 'INV-' . strtoupper(substr(uniqid(), -6)))
                                    ->live(onBlur: true),

                                Select::make('client_id')
                                    ->label('Client')
                                    ->options(
                                        Client::with('user')
                                            ->get()
                                            ->mapWithKeys(fn ($c) => [$c->id => $c->user?->name . ($c->company ? " ({$c->company})" : '')])
                                    )
                                    ->searchable()
                                    ->required()
                                    ->live()
                                    ->afterStateUpdated(fn (callable $set) => $set('project_id', null)),

                                Select::make('project_id')
                                    ->label('Project')
                                    ->options(fn (callable $get) =>
                                        Project::where('client_id', $get('client_id'))->pluck('title', 'id')
                                    )
                                    ->searchable()
                                    ->required()
                                    ->live(),

                                Grid::make(2)->schema([
                                    TextInput::make('milestone_no')
                                        ->label('Current Milestone')
                                        ->numeric()
                                        ->minValue(1)
                                        ->placeholder('e.g. 2')
                                        ->live(onBlur: true),

                                    TextInput::make('total_milestones')
                                        ->label('Total Milestones')
                                        ->numeric()
                                        ->minValue(1)
                                        ->placeholder('e.g. 5')
                                        ->live(onBlur: true),
                                ])->columnSpanFull(),

                                TextInput::make('total_budget')
                                    ->label('Total Project Budget')
                                    ->numeric()
                                    ->prefix(fn (callable $get) => $get('currency') === 'BDT' ? '৳' : '$')
                                    ->minValue(0)
                                    ->placeholder('e.g. 42000')
                                    ->helperText('Reference only — the whole project\'s budget across all milestones. Does not affect this invoice\'s total.')
                                    ->live(onBlur: true),

                                Select::make('status')
                                    ->options([
                                        'pending'   => 'Pending',
                                        'partial'   => 'Partial Payment',
                                        'paid'      => 'Paid',
                                        'overdue'   => 'Overdue',
                                        'cancelled' => 'Cancelled',
                                    ])
                                    ->default('pending')
                                    ->required()
                                    ->live(),
                            ]),

                            Section::make('Amount & Dates')->schema([
                                Select::make('currency')
                                    ->options([
                                        'USD' => 'USD ($)',
                                        'BDT' => 'BDT (৳)',
                                    ])
                                    ->default('USD')
                                    ->required()
                                    ->live(),

                                TextInput::make('amount')
                                    ->label('Invoice Amount')
                                    ->helperText('The amount due for this invoice (e.g. this milestone), not the whole project.')
                                    ->numeric()
                                    ->prefix(fn (callable $get) => $get('currency') === 'BDT' ? '৳' : '$')
                                    ->required()
                                    ->minValue(0)
                                    ->live(onBlur: true),

                                TextInput::make('paid_amount')
                                    ->label('Amount Paid')
                                    ->numeric()
                                    ->prefix(fn (callable $get) => $get('currency') === 'BDT' ? '৳' : '$')
                                    ->default(0)
                                    ->minValue(0)
                                    ->live(onBlur: true),

                                DatePicker::make('due_date')->native(false)->live(),

                                DateTimePicker::make('paid_at')->label('Paid At')->native(false)->nullable(),

                                Textarea::make('notes')->rows(3)->nullable()->live(onBlur: true),
                            ]),
                        ]),
                    ]),

                // ---- Right: live preview (1/3) ----
                Section::make('Live Preview')
                    ->columnSpan(1)
                    ->icon('heroicon-o-eye')
                    ->schema([
                        Placeholder::make('preview')
                            ->hiddenLabel()
                            ->content(fn (callable $get) => new HtmlString(self::previewHtml($get))),
                    ]),
            ]);
    }

    protected static function previewHtml(callable $get): string
    {
        $client  = $get('client_id') ? Client::with('user')->find($get('client_id')) : null;
        $project = $get('project_id') ? Project::find($get('project_id')) : null;
        $s = SiteSetting::getAll();

        return view('invoices._preview', [
            'invoiceNumber' => $get('invoice_number'),
            'clientName'    => $client?->user?->name,
            'clientCompany' => $client?->company,
            'clientEmail'   => $client?->user?->email,
            'projectTitle'  => $project?->title,
            'milestoneNo'      => $get('milestone_no'),
            'totalMilestones'  => $get('total_milestones'),
            'totalBudget'      => $get('total_budget'),
            'status'        => $get('status') ?: 'pending',
            'currency'      => $get('currency') ?: 'USD',
            'amount'        => (float) $get('amount'),
            'paid'          => (float) $get('paid_amount'),
            'dueDate'       => $get('due_date'),
            'notes'         => $get('notes'),
            'business'      => [
                'name'    => $s['site_name']    ?? config('app.name', 'Ibrahim Monir'),
                'tagline' => $s['site_tagline'] ?? null,
                'email'   => $s['contact_email'] ?? ($s['site_email'] ?? null),
                'phone'   => $s['contact_phone'] ?? null,
            ],
            'signature' => [
                'name'  => $s['invoice_signature_name'] ?? ($s['site_name'] ?? config('app.name', 'Ibrahim Monir')),
                'image' => !empty($s['invoice_signature_image']) ? Storage::disk('public')->url($s['invoice_signature_image']) : null,
            ],
        ])->render();
    }
}
