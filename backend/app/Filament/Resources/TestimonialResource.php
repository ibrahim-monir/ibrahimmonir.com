<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TestimonialResource\Pages;
use App\Models\Testimonial;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TestimonialResource extends Resource
{
    protected static ?string $model = Testimonial::class;

    protected static string|\BackedEnum|null $navigationIcon  = 'heroicon-o-star';
    protected static ?string                 $navigationLabel = 'Testimonials';
    protected static string|\UnitEnum|null   $navigationGroup = 'Settings';
    protected static ?int                    $navigationSort  = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->schema([
                TextInput::make('name')
                    ->required()
                    ->placeholder('James Carter')
                    ->columnSpanFull(),

                TextInput::make('job_title')
                    ->label('Job Title')
                    ->placeholder('CEO'),

                TextInput::make('company')
                    ->placeholder('CartFlow Inc.'),

                Select::make('country')
                    ->label('Country')
                    ->searchable()
                    ->options([
                        '🇧🇩' => '🇧🇩 Bangladesh',
                        '🇺🇸' => '🇺🇸 United States',
                        '🇬🇧' => '🇬🇧 United Kingdom',
                        '🇨🇦' => '🇨🇦 Canada',
                        '🇦🇺' => '🇦🇺 Australia',
                        '🇩🇪' => '🇩🇪 Germany',
                        '🇫🇷' => '🇫🇷 France',
                        '🇳🇱' => '🇳🇱 Netherlands',
                        '🇸🇪' => '🇸🇪 Sweden',
                        '🇳🇴' => '🇳🇴 Norway',
                        '🇩🇰' => '🇩🇰 Denmark',
                        '🇨🇭' => '🇨🇭 Switzerland',
                        '🇦🇹' => '🇦🇹 Austria',
                        '🇮🇹' => '🇮🇹 Italy',
                        '🇪🇸' => '🇪🇸 Spain',
                        '🇵🇹' => '🇵🇹 Portugal',
                        '🇵🇱' => '🇵🇱 Poland',
                        '🇷🇺' => '🇷🇺 Russia',
                        '🇺🇦' => '🇺🇦 Ukraine',
                        '🇹🇷' => '🇹🇷 Turkey',
                        '🇸🇦' => '🇸🇦 Saudi Arabia',
                        '🇦🇪' => '🇦🇪 UAE',
                        '🇶🇦' => '🇶🇦 Qatar',
                        '🇰🇼' => '🇰🇼 Kuwait',
                        '🇧🇭' => '🇧🇭 Bahrain',
                        '🇴🇲' => '🇴🇲 Oman',
                        '🇯🇴' => '🇯🇴 Jordan',
                        '🇪🇬' => '🇪🇬 Egypt',
                        '🇲🇾' => '🇲🇾 Malaysia',
                        '🇸🇬' => '🇸🇬 Singapore',
                        '🇮🇩' => '🇮🇩 Indonesia',
                        '🇵🇭' => '🇵🇭 Philippines',
                        '🇻🇳' => '🇻🇳 Vietnam',
                        '🇹🇭' => '🇹🇭 Thailand',
                        '🇮🇳' => '🇮🇳 India',
                        '🇵🇰' => '🇵🇰 Pakistan',
                        '🇱🇰' => '🇱🇰 Sri Lanka',
                        '🇳🇵' => '🇳🇵 Nepal',
                        '🇯🇵' => '🇯🇵 Japan',
                        '🇰🇷' => '🇰🇷 South Korea',
                        '🇨🇳' => '🇨🇳 China',
                        '🇭🇰' => '🇭🇰 Hong Kong',
                        '🇳🇬' => '🇳🇬 Nigeria',
                        '🇬🇭' => '🇬🇭 Ghana',
                        '🇰🇪' => '🇰🇪 Kenya',
                        '🇿🇦' => '🇿🇦 South Africa',
                        '🇧🇷' => '🇧🇷 Brazil',
                        '🇲🇽' => '🇲🇽 Mexico',
                        '🇦🇷' => '🇦🇷 Argentina',
                        '🇨🇴' => '🇨🇴 Colombia',
                    ]),

                Select::make('rating')
                    ->options([1 => '1 ★', 2 => '2 ★★', 3 => '3 ★★★', 4 => '4 ★★★★', 5 => '5 ★★★★★'])
                    ->default(5)
                    ->required(),

                Textarea::make('review_text')
                    ->label('Review')
                    ->required()
                    ->rows(4)
                    ->placeholder('Write the client review here...')
                    ->columnSpanFull(),

                ColorPicker::make('avatar_color')
                    ->label('Avatar Color')
                    ->default('#f97316')
                    ->helperText('Color for the initials circle'),

                TextInput::make('order')
                    ->numeric()
                    ->default(0)
                    ->helperText('Lower number = shown first'),

                Toggle::make('is_active')
                    ->label('Active')
                    ->default(true)
                    ->inline(false),

                Toggle::make('is_linkedin')
                    ->label('From LinkedIn')
                    ->helperText('Shows a "via LinkedIn" badge on the review card')
                    ->live()
                    ->inline(false),

                TextInput::make('linkedin_url')
                    ->label('LinkedIn Recommendation URL')
                    ->url()
                    ->placeholder('https://www.linkedin.com/in/...')
                    ->helperText('Optional — makes the badge link out to the profile/recommendation')
                    ->visible(fn ($get) => (bool) $get('is_linkedin'))
                    ->columnSpanFull(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order')->sortable()->width(60),
                TextColumn::make('name')->searchable()->weight('bold'),
                TextColumn::make('job_title')->label('Title')->placeholder('—'),
                TextColumn::make('company')->searchable()->color('warning')->placeholder('—'),
                TextColumn::make('rating')->label('★')->sortable(),
                IconColumn::make('is_linkedin')->label('LinkedIn')->boolean(),
                IconColumn::make('is_active')->label('Active')->boolean(),
            ])
            ->defaultSort('order')
            ->reorderable('order')
            ->recordUrl(fn ($record) => static::getUrl('edit', ['record' => $record]))
            ->toolbarActions([BulkActionGroup::make([DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index'  => Pages\ListTestimonials::route('/'),
            'create' => Pages\CreateTestimonial::route('/create'),
            'edit'   => Pages\EditTestimonial::route('/{record}/edit'),
        ];
    }
}
