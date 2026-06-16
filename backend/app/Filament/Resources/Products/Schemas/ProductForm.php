<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Grid::make(2)->schema([
                    Section::make('Product Info')->schema([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),

                        TextInput::make('slug')->required()->unique(ignoreRecord: true),

                        Select::make('category')
                            ->options([
                                'theme'   => 'Theme',
                                'plugin'  => 'Plugin',
                                'system'  => 'System',
                                'script'  => 'Script',
                            ])
                            ->required(),

                        TextInput::make('price')->numeric()->prefix('$')->default(0)->required(),
                        TextInput::make('preview_url')->label('Preview URL')->url()->nullable(),
                        TextInput::make('demo_url')->label('Demo URL')->url()->nullable(),
                        Toggle::make('is_featured')->label('Featured')->default(false),
                        Toggle::make('is_active')->label('Active')->default(true),
                    ]),

                    Section::make('Media')->schema([
                        FileUpload::make('image')->image()->disk('public')->directory('products')->imageEditor(),
                        Textarea::make('short_desc')->label('Short Description')->rows(3),
                    ]),
                ]),

                Section::make('Full Description')->schema([
                    RichEditor::make('description')
                        ->toolbarButtons(['bold', 'italic', 'underline', 'h2', 'h3', 'bulletList', 'orderedList', 'link', 'redo', 'undo'])
                        ->columnSpanFull(),
                ]),
            ]);
    }
}

