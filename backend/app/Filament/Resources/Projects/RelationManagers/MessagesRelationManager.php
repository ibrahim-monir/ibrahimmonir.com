<?php

namespace App\Filament\Resources\Projects\RelationManagers;

use App\Models\Message;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;

class MessagesRelationManager extends RelationManager
{
    protected static string $relationship = 'messages';

    protected static ?string $title = 'Messages';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user.name')
                    ->label('From')
                    ->weight('bold')
                    ->color(fn ($record) => $record->user->role === 'admin' ? 'warning' : 'gray'),
                TextColumn::make('body')
                    ->label('Message')
                    ->wrap()
                    ->limit(120),
                BadgeColumn::make('is_read')
                    ->label('Read')
                    ->colors(['success' => true, 'gray' => false])
                    ->formatStateUsing(fn ($state) => $state ? 'Read' : 'Unread'),
                TextColumn::make('created_at')
                    ->label('Sent')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'asc')
            ->headerActions([
                Action::make('reply')
                    ->label('Send Reply')
                    ->icon('heroicon-o-paper-airplane')
                    ->color('warning')
                    ->form([
                        Textarea::make('body')
                            ->label('Message')
                            ->required()
                            ->rows(3)
                            ->maxLength(2000),
                    ])
                    ->action(function (array $data): void {
                        Message::create([
                            'project_id' => $this->getOwnerRecord()->id,
                            'user_id'    => Auth::id(),
                            'body'       => $data['body'],
                            'is_read'    => false,
                        ]);
                    })
                    ->successNotificationTitle('Reply sent!'),
            ])
            ->recordActions([])
            ->toolbarActions([]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }
}
