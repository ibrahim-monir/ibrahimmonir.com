<?php

namespace App\Filament\Resources\Media\Tables;

use App\Models\Media;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class MediaTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('path')
                    ->disk('public')
                    ->label('Preview')
                    ->size(56)
                    ->square(),
                TextColumn::make('name')->searchable()->sortable(),
                TextColumn::make('mime_type')->label('Type')->badge()->searchable(),
                TextColumn::make('size')
                    ->label('Size')
                    ->formatStateUsing(function (int $state): string {
                        if ($state < 1024) {
                            return "{$state} B";
                        }
                        if ($state < 1048576) {
                            return number_format($state / 1024, 1).' KB';
                        }

                        return number_format($state / 1048576, 1).' MB';
                    })
                    ->sortable(),
                TextColumn::make('url')
                    ->label('URL')
                    ->getStateUsing(fn (Media $record) => $record->url)
                    ->copyable()
                    ->copyMessage('URL copied!')
                    ->limit(36)
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')->label('Uploaded')->since()->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([
                EditAction::make()
                    ->schema([
                        TextInput::make('url')
                            ->label('Image URL')
                            ->readOnly()
                            ->dehydrated(false)
                            ->afterStateHydrated(function (TextInput $component, Media $record) {
                                $component->state($record->url);
                            })
                            ->copyable(copyMessage: 'URL copied!'),
                        TextInput::make('name')->label('Title')->required(),
                        TextInput::make('alt_text')->label('Alternative Text')->helperText('Used for accessibility & SEO. Leave empty if the image is purely decorative.'),
                        TextInput::make('caption')->helperText('Displayed as a caption under the image, if used.'),
                        Textarea::make('description')->rows(3),
                    ]),
                Action::make('download')
                    ->label('Download')
                    ->icon('heroicon-o-arrow-down-tray')
                    ->color('gray')
                    ->url(fn (Media $record) => $record->url)
                    ->openUrlInNewTab(),
                DeleteAction::make()->label('Delete permanently'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([DeleteBulkAction::make()]),
            ]);
    }
}
