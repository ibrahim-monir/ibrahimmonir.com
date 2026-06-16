<?php

namespace App\Filament\Resources\Clients\Tables;

use App\Filament\Resources\Clients\ClientResource;
use App\Models\DirectMessage;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Forms\Components\Textarea;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;

class ClientsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('avatar')
                    ->disk('public')
                    ->circular()
                    ->imageSize(36)
                    ->defaultImageUrl('/images/default-avatar.png'),

                TextColumn::make('user.name')
                    ->label('Name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('user.email')
                    ->label('Email')
                    ->searchable()
                    ->copyable(),

                TextColumn::make('company')
                    ->searchable()
                    ->sortable()
                    ->placeholder('—'),

                TextColumn::make('phone')
                    ->placeholder('—'),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn ($state) => match ($state) {
                        'active'    => 'success',
                        'inactive'  => 'gray',
                        'suspended' => 'danger',
                        default     => 'gray',
                    }),

                TextColumn::make('projects_count')
                    ->label('Projects')
                    ->counts('projects')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                TextColumn::make('active_projects_count')
                    ->label('In Progress')
                    ->getStateUsing(fn ($record) => $record->projects()->where('status', 'in_progress')->count())
                    ->badge()
                    ->color('warning'),

                TextColumn::make('created_at')
                    ->date()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    'active'    => 'Active',
                    'inactive'  => 'Inactive',
                    'suspended' => 'Suspended',
                ]),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([
                Action::make('view')
                    ->label('')
                    ->icon('heroicon-o-eye')
                    ->color('info')
                    ->tooltip('View Profile')
                    ->url(fn ($record) => ClientResource::getUrl('view', ['record' => $record])),

                Action::make('send_message')
                    ->label('')
                    ->icon('heroicon-o-paper-airplane')
                    ->color('warning')
                    ->tooltip('Send Message')
                    ->schema([
                        Textarea::make('body')
                            ->label('Message')
                            ->required()
                            ->rows(3)
                            ->maxLength(2000),
                    ])
                    ->action(function (array $data, $record): void {
                        DirectMessage::create([
                            'user_id'   => Auth::id(),
                            'client_id' => $record->id,
                            'body'      => $data['body'],
                            'is_read'   => false,
                        ]);
                    })
                    ->successNotificationTitle('Message sent!'),
            ])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
