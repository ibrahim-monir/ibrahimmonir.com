<?php

namespace App\Filament\Resources\SocialLinks\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class SocialLinkForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Select::make('platform')
                    ->required()
                    ->options([
                        'github'    => 'GitHub',
                        'linkedin'  => 'LinkedIn',
                        'facebook'  => 'Facebook',
                        'twitter'   => 'X / Twitter',
                        'instagram' => 'Instagram',
                        'youtube'   => 'YouTube',
                        'tiktok'    => 'TikTok',
                        'dribbble'  => 'Dribbble',
                        'behance'   => 'Behance',
                    ]),

                TextInput::make('url')
                    ->label('Profile URL or Handle')
                    ->required()
                    ->placeholder('https://... or @yourhandle')
                    ->helperText('Paste the full profile URL, or just your @handle and it will be expanded automatically.'),

                TextInput::make('order')->numeric()->default(0),

                Toggle::make('is_active')
                    ->label('Show on website')
                    ->default(true),
            ]);
    }
}
