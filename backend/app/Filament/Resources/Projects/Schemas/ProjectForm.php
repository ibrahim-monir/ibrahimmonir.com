<?php

namespace App\Filament\Resources\Projects\Schemas;

use App\Models\Client;
use App\Models\Service;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Project Details')->components([
                Grid::make(2)->components([
                    TextInput::make('title')->required()->maxLength(255),
                    Select::make('client_id')
                        ->label('Client')
                        ->options(Client::with('user')->get()->pluck('user.name', 'id'))
                        ->required()
                        ->searchable(),
                ]),
                Grid::make(2)->components([
                    Select::make('service_id')
                        ->label('Service')
                        ->options(Service::where('is_active', true)->pluck('title', 'id'))
                        ->nullable(),
                    Select::make('status')
                        ->options([
                            'pending'     => 'Pending',
                            'in_progress' => 'In Progress',
                            'review'      => 'Review',
                            'completed'   => 'Completed',
                            'cancelled'   => 'Cancelled',
                        ])
                        ->default('pending')
                        ->required(),
                ]),
                Textarea::make('description')->rows(3)->columnSpanFull(),
            ]),
            Section::make('Timeline & Budget')->columns(2)->components([
                DatePicker::make('start_date'),
                DatePicker::make('end_date'),
                TextInput::make('budget')->numeric()->prefix('$'),
                TextInput::make('progress')->numeric()->minValue(0)->maxValue(100)->suffix('%'),
            ]),
            Section::make('Notes')->components([
                Textarea::make('notes')->rows(3)->columnSpanFull(),
            ]),
        ]);
    }
}
