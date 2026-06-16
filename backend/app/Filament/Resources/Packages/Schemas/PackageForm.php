<?php

namespace App\Filament\Resources\Packages\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PackageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Grid::make(2)->schema([
                    Section::make('Package Details')->schema([
                        TextInput::make('title')->required()->maxLength(255),

                        TextInput::make('price')
                            ->numeric()
                            ->prefix('$')
                            ->required()
                            ->minValue(0),

                        Select::make('billing_cycle')
                            ->options([
                                'once'    => 'One-time',
                                'monthly' => 'Monthly',
                                'yearly'  => 'Yearly',
                            ])
                            ->default('once')
                            ->required(),

                        TextInput::make('order')->numeric()->default(0),
                        Toggle::make('is_popular')->label('Mark as Popular')->default(false),
                        Toggle::make('is_active')->label('Active')->default(true),
                    ]),

                    Section::make('Content')->schema([
                        Textarea::make('description')->rows(4),

                        TagsInput::make('features')
                            ->label('Features List')
                            ->placeholder('Add a feature and press Enter')
                            ->helperText('Each feature will show as a bullet point'),
                    ]),
                ]),
            ]);
    }
}
