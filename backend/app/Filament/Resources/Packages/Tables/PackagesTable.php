<?php

namespace App\Filament\Resources\Packages\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\BooleanColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class PackagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order')->sortable()->label('#'),
                TextColumn::make('title')->searchable()->sortable(),
                TextColumn::make('price')->money('USD')->sortable(),
                TextColumn::make('billing_cycle')
                    ->badge()
                    ->formatStateUsing(fn ($state) => match($state) {
                        'once'    => 'One-time',
                        'monthly' => 'Monthly',
                        'yearly'  => 'Yearly',
                        default   => $state,
                    })
                    ->colors(['gray' => 'once', 'info' => 'monthly', 'success' => 'yearly']),
                BooleanColumn::make('is_popular')->label('Popular'),
                BooleanColumn::make('is_active')->label('Active'),
            ])
            ->filters([
                TernaryFilter::make('is_popular')->label('Popular'),
                TernaryFilter::make('is_active')->label('Active'),
            ])
            ->defaultSort('order')
            ->reorderable('order')
            ->recordActions([EditAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
