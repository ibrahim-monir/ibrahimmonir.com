<?php

namespace App\Filament\Resources\SocialLinks;

use App\Filament\Resources\SocialLinks\Pages\CreateSocialLink;
use App\Filament\Resources\SocialLinks\Pages\EditSocialLink;
use App\Filament\Resources\SocialLinks\Pages\ListSocialLinks;
use App\Filament\Resources\SocialLinks\Schemas\SocialLinkForm;
use App\Filament\Resources\SocialLinks\Tables\SocialLinksTable;
use App\Models\SocialLink;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class SocialLinkResource extends Resource
{
    protected static ?string $model = SocialLink::class;

    protected static string|BackedEnum|null $navigationIcon  = Heroicon::OutlinedShare;
    protected static ?string               $navigationLabel = 'Social Links';
    protected static string|\UnitEnum|null $navigationGroup = 'Settings';
    protected static ?int                  $navigationSort  = 2;

    public static function form(Schema $schema): Schema
    {
        return SocialLinkForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return SocialLinksTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListSocialLinks::route('/'),
            'create' => CreateSocialLink::route('/create'),
            'edit' => EditSocialLink::route('/{record}/edit'),
        ];
    }

    /**
     * Accept a bare @handle (or handle without @) instead of requiring a full URL,
     * expanding it to the platform's profile URL. Left untouched if already a URL.
     */
    public static function normalizeUrl(array $data): array
    {
        $value = trim($data['url'] ?? '');

        if ($value === '' || str_starts_with($value, 'http://') || str_starts_with($value, 'https://')) {
            $data['url'] = $value;

            return $data;
        }

        $handle = ltrim($value, '@/');

        $bases = [
            'github'    => 'https://github.com/',
            'linkedin'  => 'https://linkedin.com/in/',
            'facebook'  => 'https://facebook.com/',
            'twitter'   => 'https://twitter.com/',
            'instagram' => 'https://instagram.com/',
            'youtube'   => 'https://youtube.com/@',
            'tiktok'    => 'https://tiktok.com/@',
            'dribbble'  => 'https://dribbble.com/',
            'behance'   => 'https://behance.net/',
        ];

        $base = $bases[$data['platform'] ?? ''] ?? null;
        $data['url'] = $base ? $base.$handle : $value;

        return $data;
    }
}
