<?php

namespace App\Filament\Resources\Services\Schemas;

use App\Filament\Support\MediaSelect;
use App\Models\Media;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ServiceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Grid::make(2)->schema([

                    // Left: main fields
                    Section::make('Service Details')->schema([
                        Grid::make(2)->schema([
                            TextInput::make('title')
                                ->required()
                                ->maxLength(255)
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn ($state, callable $set) => $set('slug', \Str::slug($state))),

                            TextInput::make('slug')
                                ->required()
                                ->unique(ignoreRecord: true),
                        ]),

                        Textarea::make('short_desc')
                            ->label('Short Description')
                            ->rows(2),

                        Grid::make(2)->schema([
                            TextInput::make('price')->numeric()->prefix('$')->nullable(),
                            TextInput::make('icon')->helperText('Heroicon name or emoji'),
                            TextInput::make('order')->numeric()->default(0),
                            Toggle::make('is_active')->label('Active')->default(true)->inline(false),
                        ]),
                    ]),

                    // Right: description + image
                    Grid::make(1)->schema([
                        Section::make('Description')->schema([
                            RichEditor::make('description')
                                ->toolbarButtons([
                                    'bold', 'italic', 'underline', 'strike',
                                    'h2', 'h3', 'bulletList', 'orderedList',
                                    'blockquote', 'link', 'redo', 'undo',
                                ])
                                ->fileAttachmentsDisk('public')
                                ->fileAttachmentsVisibility('public')
                                ->saveUploadedFileAttachmentUsing(fn ($file) => Media::storeUploadedFile($file)->path)
                                ->extraInputAttributes(['style' => 'min-height: 320px']),
                        ]),

                        Section::make('Image')->schema([
                            MediaSelect::make('image')->label('Image'),
                        ]),
                    ]),

                ]),
            ]);
    }
}

