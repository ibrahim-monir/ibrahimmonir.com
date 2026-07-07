<?php

namespace App\Filament\Resources\Invoices\Tables;

use App\Mail\InvoiceMail;
use App\Models\Invoice;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Mail;

class InvoicesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('invoice_number')->label('Invoice #')->searchable()->sortable()->copyable(),
                TextColumn::make('client.user.name')->label('Client')->searchable()->sortable(),
                TextColumn::make('project.title')->label('Project')->searchable()->limit(30),
                TextColumn::make('milestone_no')->label('Milestone')->placeholder('—')->sortable()
                    ->formatStateUsing(fn ($state, $record) => $record->total_milestones ? "{$state} of {$record->total_milestones}" : $state)
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('amount')->money(fn ($record) => $record->currency ?? 'USD')->sortable(),
                TextColumn::make('paid_amount')->label('Paid')->money(fn ($record) => $record->currency ?? 'USD')->sortable()
                    ->color(fn ($record) => (float)$record->paid_amount > 0 ? 'success' : null),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match($state) {
                        'pending'   => 'warning',
                        'partial'   => 'info',
                        'paid'      => 'success',
                        'overdue'   => 'danger',
                        'cancelled' => 'gray',
                        default     => 'gray',
                    }),
                TextColumn::make('due_date')->date()->sortable(),
                TextColumn::make('sent_at')->label('Sent')->since()->placeholder('Not sent')
                    ->sortable()->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('paid_at')->since()->placeholder('—')->sortable()->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')->date()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    'pending'   => 'Pending',
                    'partial'   => 'Partial',
                    'paid'      => 'Paid',
                    'overdue'   => 'Overdue',
                    'cancelled' => 'Cancelled',
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([
                EditAction::make(),
                Action::make('preview')
                    ->label('Preview')
                    ->icon('heroicon-o-eye')
                    ->color('gray')
                    ->url(fn (Invoice $record) => route('invoices.preview', $record))
                    ->openUrlInNewTab(),
                Action::make('downloadPdf')
                    ->label('PDF')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('gray')
                    ->url(fn (Invoice $record) => route('invoices.pdf', $record))
                    ->openUrlInNewTab(),
                Action::make('sendEmail')
                    ->label('Send')
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
                            Notification::make()->title('Client has no email address')->danger()->send();
                            return;
                        }
                        Mail::to($email)->send(new InvoiceMail($record, $data['message'] ?? ''));
                        $record->update(['sent_at' => now()]);
                        Notification::make()->title('Invoice sent to ' . $email)->success()->send();
                    }),
            ])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
