<?php

namespace App\Filament\Resources\BlogPosts\Schemas;

use App\Models\BlogCategory;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class BlogPostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([

                // â”€â”€ Row 1: Publication Details + Media & Publishing (side by side) â”€â”€
                Grid::make(2)
                    ->schema([
                        Section::make('Publication Details')
                            ->schema([
                                TextInput::make('title')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn ($state, callable $set) =>
                                        $set('slug', Str::slug($state))
                                    ),

                                TextInput::make('slug')
                                    ->required()
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(255),

                                Select::make('blog_category_id')
                                    ->label('Category')
                                    ->options(BlogCategory::pluck('name', 'id'))
                                    ->searchable()
                                    ->preload(),
                            ]),

                        Section::make('Media & Publishing')
                            ->schema([
                                FileUpload::make('image')
                                    ->image()
                                    ->disk('public')->directory('publications'),

                                Select::make('status')
                                    ->options([
                                        'draft'     => 'Draft',
                                        'published' => 'Published',
                                    ])
                                    ->default('draft')
                                    ->required(),

                                DateTimePicker::make('published_at')
                                    ->label('Publish Date')
                                    ->native(false),
                            ]),
                    ]),

                // â”€â”€ Row 2: Content full width â”€â”€
                Section::make('Content')
                    ->schema([
                        RichEditor::make('content')
                            ->toolbarButtons([
                                'bold', 'italic', 'underline', 'strike',
                                'h2', 'h3', 'bulletList', 'orderedList',
                                'blockquote', 'codeBlock', 'link', 'redo', 'undo',
                            ]),

                        Textarea::make('excerpt')
                            ->label('Excerpt (Short Summary)')
                            ->rows(3)
                            ->maxLength(500),
                    ]),

            ]);
    }
}

