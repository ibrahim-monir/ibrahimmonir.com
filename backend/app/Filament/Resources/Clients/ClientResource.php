<?php

namespace App\Filament\Resources\Clients;

use App\Filament\Resources\Clients\Pages\CreateClient;
use App\Filament\Resources\Clients\Pages\EditClient;
use App\Filament\Resources\Clients\Pages\ListClients;
use App\Filament\Resources\Clients\Pages\ViewClient;
use App\Filament\Resources\Clients\RelationManagers\DirectMessagesRelationManager;
use App\Filament\Resources\Clients\RelationManagers\ProjectsRelationManager;
use App\Filament\Resources\Clients\Schemas\ClientForm;
use App\Filament\Resources\Clients\Tables\ClientsTable;
use App\Models\Client;
use BackedEnum;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ClientResource extends Resource
{
    protected static ?string $model = Client::class;

    protected static string|BackedEnum|null  $navigationIcon  = Heroicon::OutlinedUsers;
    protected static ?string                  $navigationLabel = 'Clients';
    protected static string|\UnitEnum|null    $navigationGroup = 'Client Management';
    protected static ?int                     $navigationSort  = 1;

    public static function form(Schema $schema): Schema
    {
        return ClientForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema->components([

            // ── Profile header + Stats — all in one full-width section ──
            Section::make()->schema([

                // Row 1: Avatar | Identity | Company+Phone | Address+Notes
                Grid::make(4)->schema([

                    // Avatar (spans 1 col)
                    ImageEntry::make('avatar')
                        ->disk('public')
                        ->circular()
                        ->imageHeight(120)
                        ->imageWidth(120)
                        ->defaultImageUrl('/images/default-avatar.png')
                        ->hiddenLabel()
                        ->extraAttributes(['class' => 'flex justify-center items-center'])
                        ->columnSpan(1),

                    // Name + email + status
                    Grid::make(1)->schema([
                        TextEntry::make('user.name')
                            ->label('Full Name')
                            ->weight('bold')
                            ->size('lg'),
                        TextEntry::make('user.email')
                            ->label('Email')
                            ->icon('heroicon-o-envelope')
                            ->copyable(),
                        TextEntry::make('status')
                            ->label('Status')
                            ->badge()
                            ->color(fn ($state) => match ($state) {
                                'active'    => 'success',
                                'inactive'  => 'gray',
                                'suspended' => 'danger',
                                default     => 'gray',
                            }),
                    ])->columnSpan(1),

                    // Company + phone + client since
                    Grid::make(1)->schema([
                        TextEntry::make('company')
                            ->label('Company')
                            ->icon('heroicon-o-building-office-2')
                            ->placeholder('—'),
                        TextEntry::make('phone')
                            ->label('Phone')
                            ->icon('heroicon-o-phone')
                            ->copyable()
                            ->placeholder('—'),
                        TextEntry::make('created_at')
                            ->label('Client Since')
                            ->date('d M Y')
                            ->icon('heroicon-o-calendar'),
                    ])->columnSpan(1),

                    // Address + notes
                    Grid::make(1)->schema([
                        TextEntry::make('address')
                            ->label('Address')
                            ->icon('heroicon-o-map-pin')
                            ->placeholder('—'),
                        TextEntry::make('notes')
                            ->label('Internal Notes')
                            ->placeholder('No notes'),
                    ])->columnSpan(1),

                ]),

            ])->columnSpanFull(),

            // ── Stats row ────────────────────────────────────────────
            Section::make()->schema([
                Grid::make(4)->schema([
                    TextEntry::make('stat_total')
                        ->label('Total Projects')
                        ->getStateUsing(fn ($record) => $record->projects()->count())
                        ->badge()->color('info')->size('lg'),

                    TextEntry::make('stat_pending')
                        ->label('Pending')
                        ->getStateUsing(fn ($record) => $record->projects()->where('status', 'pending')->count())
                        ->badge()->color('gray')->size('lg'),

                    TextEntry::make('stat_active')
                        ->label('In Progress')
                        ->getStateUsing(fn ($record) => $record->projects()->where('status', 'in_progress')->count())
                        ->badge()->color('warning')->size('lg'),

                    TextEntry::make('stat_done')
                        ->label('Completed')
                        ->getStateUsing(fn ($record) => $record->projects()->where('status', 'completed')->count())
                        ->badge()->color('success')->size('lg'),
                ]),
            ])->columnSpanFull(),

        ]);
    }

    public static function table(Table $table): Table
    {
        return ClientsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            ProjectsRelationManager::class,
            DirectMessagesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListClients::route('/'),
            'create' => CreateClient::route('/create'),
            'edit'   => EditClient::route('/{record}/edit'),
            'view'   => ViewClient::route('/{record}'),
        ];
    }
}
