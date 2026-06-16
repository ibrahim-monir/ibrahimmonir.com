<?php

namespace App\Filament\Resources\Projects\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ProjectsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')->searchable()->sortable(),
                TextColumn::make('client.user.name')->label('Client')->searchable()->sortable(),
                BadgeColumn::make('status')
                    ->colors([
                        'gray'    => 'pending',
                        'warning' => 'in_progress',
                        'info'    => 'review',
                        'success' => 'completed',
                        'danger'  => 'cancelled',
                    ]),
                TextColumn::make('progress')->suffix('%')->sortable(),
                TextColumn::make('end_date')->date()->sortable(),
                TextColumn::make('created_at')->date()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    'pending'     => 'Pending',
                    'in_progress' => 'In Progress',
                    'review'      => 'Review',
                    'completed'   => 'Completed',
                    'cancelled'   => 'Cancelled',
                ]),
            ])
            ->recordActions([EditAction::make()])
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }
}
