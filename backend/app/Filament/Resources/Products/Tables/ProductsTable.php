<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\BooleanColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')->size(48)->rounded(),
                TextColumn::make('title')->searchable()->sortable(),
                TextColumn::make('category')->badge()
                    ->colors(['info' => 'theme', 'warning' => 'plugin', 'success' => 'system', 'gray' => 'script']),
                TextColumn::make('price')->money('USD')->sortable(),
                TextColumn::make('downloads')->sortable(),
                BooleanColumn::make('is_featured')->label('Featured'),
                BooleanColumn::make('is_active')->label('Active'),
                TextColumn::make('created_at')->date()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category')->options([
                    'theme'  => 'Theme',
                    'plugin' => 'Plugin',
                    'system' => 'System',
                    'script' => 'Script',
                ]),
                TernaryFilter::make('is_featured')->label('Featured'),
                TernaryFilter::make('is_active')->label('Active'),
            ])
            ->defaultSort('created_at', 'desc')
            ->recordActions([EditAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
