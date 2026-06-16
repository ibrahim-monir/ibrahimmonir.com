<?php

namespace App\Filament\Resources\BlogPosts;

use App\Filament\Resources\BlogPosts\Pages\CreateBlogPost;
use App\Filament\Resources\BlogPosts\Pages\EditBlogPost;
use App\Filament\Resources\BlogPosts\Pages\ListBlogPosts;
use App\Filament\Resources\BlogPosts\Schemas\BlogPostForm;
use App\Filament\Resources\BlogPosts\Tables\BlogPostsTable;
use App\Models\BlogPost;
use BackedEnum;
use Filament\Navigation\NavigationItem;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BlogPostResource extends Resource
{
    protected static ?string $model = BlogPost::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static string|\UnitEnum|null $navigationGroup = 'Publications';

    protected static ?string $navigationLabel = 'All Publications';

    protected static ?string $modelLabel = 'Publication';

    protected static ?string $pluralModelLabel = 'Publications';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return BlogPostForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BlogPostsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getNavigationItems(): array
    {
        return [
            NavigationItem::make('All Publications')
                ->icon(Heroicon::OutlinedDocumentText)
                ->group('Publications')
                ->sort(1)
                ->url(static::getUrl('index'))
                ->isActiveWhen(fn () => request()->routeIs(static::getRouteBaseName() . '.index')
                    || request()->routeIs(static::getRouteBaseName() . '.edit')),

            NavigationItem::make('Add Publication')
                ->icon(Heroicon::OutlinedPlusCircle)
                ->group('Publications')
                ->sort(2)
                ->url(static::getUrl('create'))
                ->isActiveWhen(fn () => request()->routeIs(static::getRouteBaseName() . '.create')),
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListBlogPosts::route('/'),
            'create' => CreateBlogPost::route('/create'),
            'edit' => EditBlogPost::route('/{record}/edit'),
        ];
    }
}
