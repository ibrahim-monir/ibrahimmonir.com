<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ExperienceResource\Pages;
use App\Models\Experience;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ExperienceResource extends Resource
{
    protected static ?string $model = Experience::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-briefcase';
    protected static ?string $navigationLabel = 'Experiences';
    protected static string|\UnitEnum|null $navigationGroup = 'Settings';
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Section::make()->schema([
                TextInput::make('role')
                    ->label('Job Title / Role')
                    ->required()
                    ->placeholder('Senior Full-Stack Developer')
                    ->columnSpanFull(),

                TextInput::make('company')
                    ->required()
                    ->placeholder('Freelance / Remote')
                    ->columnSpanFull(),

                TextInput::make('year_start')
                    ->label('Start Year')
                    ->required()
                    ->placeholder('2024'),

                TextInput::make('year_end')
                    ->label('End Year')
                    ->placeholder('2026')
                    ->helperText('Leave empty to show "Present"'),

                Textarea::make('description')
                    ->rows(3)
                    ->placeholder('Describe your responsibilities and achievements...')
                    ->columnSpanFull(),

                TextInput::make('order')
                    ->numeric()
                    ->default(0)
                    ->helperText('Lower number = shown first'),

                Toggle::make('is_active')
                    ->label('Active')
                    ->default(true)
                    ->inline(false),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order')->sortable()->width(60),
                TextColumn::make('role')->searchable()->weight('bold'),
                TextColumn::make('company')->searchable()->color('warning'),
                TextColumn::make('year_start')->label('From'),
                TextColumn::make('year_end')->label('To')->placeholder('Present'),
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
            'index'  => Pages\ListExperiences::route('/'),
            'create' => Pages\CreateExperience::route('/create'),
            'edit'   => Pages\EditExperience::route('/{record}/edit'),
        ];
    }
}
