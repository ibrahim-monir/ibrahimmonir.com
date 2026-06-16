<?php

namespace App\Filament\Resources\Clients\RelationManagers;

use Filament\Actions\Action;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProjectsRelationManager extends RelationManager
{
    protected static string $relationship = 'projects';
    protected static ?string $title       = 'Projects';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->weight('bold')
                    ->searchable(),
                BadgeColumn::make('status')
                    ->colors([
                        'gray'    => 'pending',
                        'warning' => 'in_progress',
                        'info'    => 'review',
                        'success' => 'completed',
                        'danger'  => 'cancelled',
                    ])
                    ->formatStateUsing(fn ($state) => match ($state) {
                        'pending'     => 'Pending',
                        'in_progress' => 'In Progress',
                        'review'      => 'Review',
                        'completed'   => 'Completed',
                        'cancelled'   => 'Cancelled',
                        default       => $state,
                    }),
                TextColumn::make('progress')
                    ->suffix('%')
                    ->sortable(),
                TextColumn::make('start_date')
                    ->date('d M Y')
                    ->placeholder('—'),
                TextColumn::make('end_date')
                    ->label('Deadline')
                    ->date('d M Y')
                    ->placeholder('—'),
                TextColumn::make('budget')
                    ->money('USD')
                    ->placeholder('—'),
            ])
            ->defaultSort('created_at', 'desc')
            ->headerActions([
                Action::make('manage')
                    ->label('Go to Projects')
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->color('gray')
                    ->url(fn () => '/admin/projects?tableFilters[client_id][value]=' . $this->getOwnerRecord()->id)
                    ->openUrlInNewTab(),
            ])
            ->recordActions([
                Action::make('edit')
                    ->label('Edit')
                    ->icon('heroicon-o-pencil')
                    ->url(fn ($record) => '/admin/projects/' . $record->id . '/edit')
                    ->openUrlInNewTab(),
            ])
            ->toolbarActions([]);
    }

    public function form(Schema $schema): Schema
    {
        return $schema->components([]);
    }
}
