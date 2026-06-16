<?php

namespace App\Filament\Resources\Clients\RelationManagers;

use App\Models\DirectMessage;
use Filament\Actions\Action;
use Filament\Forms\Components\Textarea;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DirectMessagesRelationManager extends RelationManager
{
    protected static string $relationship = 'directMessages';

    protected static ?string $title = 'Chat Messages';

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
                    ->limit(100)
                    ->placeholder('(attachment)'),
                TextColumn::make('attachment_name')
                    ->label('Attachment')
                    ->limit(30)
                    ->placeholder('—')
                    ->url(fn ($record) => $record->attachment_path
                        ? Storage::disk('public')->url($record->attachment_path) : null)
                    ->openUrlInNewTab(),
                BadgeColumn::make('is_read')
                    ->label('Read')
                    ->colors(['success' => true, 'gray' => false])
                    ->formatStateUsing(fn ($state) => $state ? 'Read' : 'Unread'),
                TextColumn::make('created_at')
                    ->label('Time')
                    ->dateTime('d M, H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'asc')
            ->headerActions([
                Action::make('reply')
                    ->label('Send Message')
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
                        DirectMessage::create([
                            'user_id'   => Auth::id(),
                            'client_id' => $this->getOwnerRecord()->id,
                            'body'      => $data['body'],
                            'is_read'   => false,
                        ]);
                    }),
            ])
            ->recordActions([])
            ->toolbarActions([]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }
}
