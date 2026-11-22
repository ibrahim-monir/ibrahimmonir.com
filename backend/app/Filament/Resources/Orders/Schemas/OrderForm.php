<?php

namespace App\Filament\Resources\Orders\Schemas;

use App\Models\Order;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

/**
 * Everything the customer submitted is read-only; the admin only changes the
 * status and keeps an internal note.
 */
class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        $show = fn (string $label, callable $value) => Placeholder::make($label)->content(fn (?Order $record) => $record ? ($value($record) ?: '—') : '—');

        return $schema->components([
            Section::make('Payment')->schema([
                $show('Order', fn ($r) => $r->order_number),
                $show('Package', fn ($r) => $r->package_title),
                $show('Package price', fn ($r) => $r->formattedAmount($r->package_price)),
                $show('Advance due', fn ($r) => $r->formattedAmount() . " ({$r->advance_percent}%)"),
                $show('Method', fn ($r) => $r->methodLabel()),
                $show('Paid from', fn ($r) => $r->payer_account),
                $show('Transaction ID', fn ($r) => $r->transaction_id),
                $show('Placed', fn ($r) => $r->created_at?->format('d M Y, h:i A')),
            ])->columns(4)->columnSpanFull(),

            Section::make('Customer')->schema([
                $show('Name', fn ($r) => $r->name),
                $show('Email', fn ($r) => $r->email),
                $show('Phone', fn ($r) => $r->phone),
                $show('Company', fn ($r) => $r->company),
                $show('Project details', fn ($r) => $r->project_details)->columnSpanFull(),
            ])->columns(4)->columnSpanFull(),

            Section::make('Admin')->schema([
                Select::make('status')->options(Order::STATUSES)->required()
                    ->helperText('Use the Confirm / Reject buttons above to also email the customer.'),
                Textarea::make('admin_note')->label('Internal note')->rows(3),
            ])->columnSpanFull(),
        ]);
    }
}
