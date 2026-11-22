<?php

namespace App\Filament\Resources\Orders\Tables;

use App\Mail\OrderMail;
use App\Models\Order;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('order_number')->label('Order')->searchable()->weight('bold')->copyable(),
                TextColumn::make('name')->searchable()->description(fn (Order $r) => $r->phone),
                TextColumn::make('package_title')->label('Package')->searchable(),
                TextColumn::make('amount')->label('Total')->formatStateUsing(fn ($state, Order $r) => $r->formattedAmount($r->total()))
                    ->description(fn (Order $r) => (float) $r->charge > 0 ? 'incl. ' . $r->formattedAmount($r->charge) . ' charge' : null),
                TextColumn::make('payment_method')->label('Method')->badge()->formatStateUsing(fn ($state) => Order::METHODS[$state] ?? $state),
                TextColumn::make('transaction_id')->label('Trx ID')->searchable()->copyable(),
                TextColumn::make('status')->badge()
                    ->formatStateUsing(fn ($state) => Order::STATUSES[$state] ?? $state)
                    ->color(fn ($state) => match ($state) {
                        'pending'   => 'warning',
                        'confirmed' => 'success',
                        'rejected'  => 'danger',
                        default     => 'gray',
                    }),
                TextColumn::make('created_at')->since()->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')->options(Order::STATUSES),
                SelectFilter::make('payment_method')->label('Method')->options(Order::METHODS),
            ])
            ->recordActions([
                self::confirmAction(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([DeleteBulkAction::make()]),
            ]);
    }

    public static function confirmAction(): Action
    {
        return Action::make('confirm')
            ->label('Confirm payment')
            ->icon('heroicon-o-check-circle')
            ->color('success')
            ->visible(fn (Order $record) => $record->status === 'pending')
            ->requiresConfirmation()
            ->modalDescription(fn (Order $record) => "Only confirm after you've found {$record->formattedAmount($record->total())} with transaction ID {$record->transaction_id} in your {$record->methodLabel()} account. The customer will be emailed.")
            ->action(function (Order $record) {
                $record->update(['status' => 'confirmed', 'confirmed_at' => now()]);
                self::notifyCustomer($record, 'confirmed');
            });
    }

    public static function rejectAction(): Action
    {
        return Action::make('reject')
            ->label('Reject')
            ->icon('heroicon-o-x-circle')
            ->color('danger')
            ->visible(fn (Order $record) => $record->status === 'pending')
            ->requiresConfirmation()
            ->modalDescription('Use this when the transaction ID or amount does not match. The customer will be emailed and asked for proof of payment.')
            ->action(function (Order $record) {
                $record->update(['status' => 'rejected']);
                self::notifyCustomer($record, 'rejected');
            });
    }

    private static function notifyCustomer(Order $order, string $event): void
    {
        try {
            Mail::to($order->email)->send(new OrderMail($order, forAdmin: false, event: $event));
            Notification::make()->success()->title("Order {$order->order_number} {$event}. Customer emailed.")->send();
        } catch (\Throwable $e) {
            Log::warning('Order status mail failed', ['order' => $order->order_number, 'error' => $e->getMessage()]);
            Notification::make()->warning()->title("Order {$event}, but the email to the customer failed.")->send();
        }
    }
}
