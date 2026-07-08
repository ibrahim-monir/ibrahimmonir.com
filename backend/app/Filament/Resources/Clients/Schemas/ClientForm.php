<?php

namespace App\Filament\Resources\Clients\Schemas;

use App\Filament\Support\MediaSelect;
use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ClientForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Grid::make(2)->schema([
                    Section::make('User Account')->schema([
                        Select::make('user_id')
                            ->label('User')
                            ->options(User::where('role', '!=', 'admin')->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->createOptionForm([
                                TextInput::make('name')->required(),
                                TextInput::make('email')->email()->required(),
                                TextInput::make('password')->password()->required(),
                            ])
                            ->createOptionUsing(function (array $data): int {
                                return User::create([
                                    'name'     => $data['name'],
                                    'email'    => $data['email'],
                                    'password' => bcrypt($data['password']),
                                    'role'     => 'client',
                                ])->id;
                            })
                            ->required(),

                        MediaSelect::make('avatar')->label('Avatar'),

                        Select::make('status')
                            ->options([
                                'active'    => 'Active',
                                'inactive'  => 'Inactive',
                                'suspended' => 'Suspended',
                            ])
                            ->default('active')
                            ->required(),
                    ]),

                    Section::make('Company Info')->schema([
                        TextInput::make('company')->label('Company Name')->maxLength(255),
                        TextInput::make('phone')->tel()->maxLength(20),
                        Textarea::make('address')->rows(3),
                        Textarea::make('notes')->rows(3)->label('Internal Notes'),
                    ]),
                ]),
            ]);
    }
}

