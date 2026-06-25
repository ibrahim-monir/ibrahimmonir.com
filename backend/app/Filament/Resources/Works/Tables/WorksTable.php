<?php

namespace App\Filament\Resources\Works\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\BooleanColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class WorksTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('thumbnail')->size(48)->rounded(),
                TextColumn::make('title')->searchable()->sortable(),
                TextColumn::make('category')->badge()->searchable(),
                TextColumn::make('url')->label('URL')->url(fn ($record) => $record->url)->limit(30)->placeholder('—'),
                BooleanColumn::make('is_featured')->label('Featured'),
                BooleanColumn::make('is_active')->label('Active'),
                TextColumn::make('order')->sortable(),
            ])
            ->filters([
                SelectFilter::make('category')->options([
                    'WordPress'  => 'WordPress',
                    'Laravel'    => 'Laravel',
                    'Next.js'    => 'Next.js',
                    'E-Commerce' => 'E-Commerce',
                    'SaaS'       => 'SaaS',
                    'Plugin'     => 'Plugin',
                    'API'        => 'API',
                    'Other'      => 'Other',
                ]),
                TernaryFilter::make('is_featured')->label('Featured'),
                TernaryFilter::make('is_active')->label('Active'),
            ])
            ->defaultSort('order')
            ->reorderable('order')
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
