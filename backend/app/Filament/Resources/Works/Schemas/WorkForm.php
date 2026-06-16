<?php

namespace App\Filament\Resources\Works\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class WorkForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Grid::make(2)->schema([
                    Section::make('Project Details')->schema([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),

                        TextInput::make('slug')->required()->unique(ignoreRecord: true),

                        Select::make('category')
                            ->options([
                                'WordPress'  => 'WordPress',
                                'Laravel'    => 'Laravel',
                                'Next.js'    => 'Next.js',
                                'E-Commerce' => 'E-Commerce',
                                'SaaS'       => 'SaaS',
                                'Plugin'     => 'Plugin',
                                'API'        => 'API',
                                'Other'      => 'Other',
                            ])
                            ->searchable(),

                        TextInput::make('url')->label('Live URL')->url()->nullable(),

                        TagsInput::make('technologies')
                            ->label('Technologies Used')
                            ->placeholder('Add technology')
                            ->suggestions(['WordPress', 'Laravel', 'Next.js', 'React', 'PHP', 'MySQL', 'Tailwind CSS', 'TypeScript']),

                        TextInput::make('order')->numeric()->default(0),

                        Toggle::make('is_featured')->label('Featured')->default(false),
                        Toggle::make('is_active')->label('Active')->default(true),
                    ]),

                    Section::make('Media')->schema([
                        FileUpload::make('thumbnail')
                            ->image()
                            ->disk('public')->directory('works')
                            ->imageEditor()
                            ->label('Thumbnail'),

                        FileUpload::make('images')
                            ->image()
                            ->disk('public')->directory('works/gallery')
                            ->multiple()
                            ->reorderable()
                            ->label('Gallery Images'),
                    ]),
                ]),

                Section::make('Description')->schema([
                    Textarea::make('description')->rows(4)->columnSpanFull(),
                ]),
            ]);
    }
}

