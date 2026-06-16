<?php

namespace App\Filament\Resources\Contacts\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;

class ContactForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(2)->components([
                TextInput::make('name')->required(),
                TextInput::make('email')->email()->required(),
                TextInput::make('phone')->nullable(),
                Select::make('status')->options(['new' => 'New', 'read' => 'Read', 'replied' => 'Replied'])->default('new'),
            ]),
            TextInput::make('subject')->required()->columnSpanFull(),
            Textarea::make('message')->rows(5)->required()->columnSpanFull(),
        ]);
    }
}
