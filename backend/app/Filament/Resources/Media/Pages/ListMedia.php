<?php

namespace App\Filament\Resources\Media\Pages;

use App\Filament\Resources\Media\MediaResource;
use App\Models\Media;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class ListMedia extends ListRecords
{
    protected static string $resource = MediaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('upload')
                ->label('Upload Media')
                ->icon('heroicon-o-arrow-up-tray')
                ->schema([
                    FileUpload::make('files')
                        ->label('Images')
                        ->image()
                        ->multiple()
                        ->disk('public')
                        ->directory(fn () => Media::defaultUploadDirectory())
                        ->getUploadedFileNameForStorageUsing(fn (TemporaryUploadedFile $file) => Media::uploadedFileNameFor($file, Media::defaultUploadDirectory()))
                        ->required()
                        ->columnSpanFull(),
                ])
                ->action(function (array $data): void {
                    foreach ((array) $data['files'] as $path) {
                        Media::createFromUploadedPath($path);
                    }

                    Notification::make()->success()->title('Media uploaded.')->send();
                }),
        ];
    }
}
