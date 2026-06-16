<?php

namespace App\Filament\Resources\BlogPosts\Tables;

use App\Models\BlogCategory;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ReplicateAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class BlogPostsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->disk('public')
                    ->circular()
                    ->size(40),

                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->limit(50),

                TextColumn::make('category.name')
                    ->label('Category')
                    ->badge()
                    ->sortable(),

                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state) => match ($state) {
                        'published' => 'success',
                        'draft'     => 'gray',
                    }),

                TextColumn::make('published_at')
                    ->label('Published')
                    ->dateTime('d M Y')
                    ->sortable(),

                TextColumn::make('views')
                    ->sortable(),

                TextColumn::make('created_at')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        'draft'     => 'Draft',
                        'published' => 'Published',
                    ]),

                SelectFilter::make('blog_category_id')
                    ->label('Category')
                    ->relationship('category', 'name'),
            ])
            ->recordActions([

                // ── Quick Edit ──
                Action::make('quickEdit')
                    ->label('Quick Edit')
                    ->icon(Heroicon::OutlinedPencilSquare)
                    ->color('warning')
                    ->modalHeading('Quick Edit Publication')
                    ->modalWidth('2xl')
                    ->fillForm(fn ($record): array => [
                        'title'        => $record->title,
                        'slug'         => $record->slug,
                        'status'       => $record->status,
                        'published_at' => $record->published_at,
                        'excerpt'      => $record->excerpt,
                        'blog_category_id' => $record->blog_category_id,
                    ])
                    ->form([
                        TextInput::make('title')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),

                        TextInput::make('slug')
                            ->required(),

                        Select::make('blog_category_id')
                            ->label('Category')
                            ->options(BlogCategory::pluck('name', 'id'))
                            ->searchable(),

                        Select::make('status')
                            ->options(['draft' => 'Draft', 'published' => 'Published'])
                            ->required(),

                        DateTimePicker::make('published_at')
                            ->label('Publish Date')
                            ->native(false),

                        Textarea::make('excerpt')
                            ->label('Excerpt')
                            ->rows(3),
                    ])
                    ->action(function ($record, array $data): void {
                        $record->update($data);
                        Notification::make()
                            ->title('Publication updated')
                            ->success()
                            ->send();
                    }),

                // ── Duplicate ──
                ReplicateAction::make()
                    ->label('Duplicate')
                    ->icon(Heroicon::OutlinedDocumentDuplicate)
                    ->color('gray')
                    ->excludeAttributes(['views', 'published_at'])
                    ->mutateRecordDataUsing(function (array $data): array {
                        $data['title']  = 'Copy of ' . $data['title'];
                        $data['slug']   = $data['slug'] . '-copy-' . Str::random(4);
                        $data['status'] = 'draft';
                        return $data;
                    })
                    ->after(function ($replica): void {
                        Notification::make()
                            ->title('Publication duplicated as draft')
                            ->success()
                            ->send();
                    })
                    ->requiresConfirmation()
                    ->modalHeading('Duplicate Publication')
                    ->modalDescription('A draft copy will be created. You can edit it before publishing.')
                    ->modalSubmitActionLabel('Duplicate'),

                // ── Edit (full page) ──
                EditAction::make()
                    ->label('Edit'),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
