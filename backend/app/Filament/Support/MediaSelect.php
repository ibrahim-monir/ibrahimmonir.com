<?php

namespace App\Filament\Support;

use App\Models\Media;
use Filament\Actions\Action;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

/**
 * A Media Library-backed picker, WordPress "add media" style: clicking the
 * field's action opens a modal with the library grid as the first tab and
 * an upload dropzone as the second — no native searchable dropdown. Stores
 * plain storage paths, so it's a drop-in replacement for a FileUpload field.
 *
 * One item is added per use (Select's create-option flow only supports
 * appending a single new value at a time) — for a gallery, use the action
 * again to add more.
 */
class MediaSelect
{
    public static function make(string $name, bool $multiple = false): Select
    {
        $select = Select::make($name)
            ->allowHtml()
            ->getOptionLabelUsing(fn (string $value) => static::optionLabel($value))
            ->getOptionLabelsUsing(fn (array $values) => collect($values)->mapWithKeys(fn ($value) => [$value => static::optionLabel($value)]))
            ->createOptionForm([
                Tabs::make()->tabs([
                    Tab::make('Media Library')->schema([
                        CheckboxList::make('selection')
                            ->hiddenLabel()
                            ->options(fn () => static::gridOptions())
                            ->allowHtml()
                            ->searchable()
                            ->columns(4)
                            ->gridDirection('row')
                            ->maxItems(1),
                    ]),
                    Tab::make('Upload New')->schema([
                        FileUpload::make('upload')
                            ->hiddenLabel()
                            ->image()
                            ->disk('public')
                            ->directory(fn () => Media::defaultUploadDirectory())
                            ->getUploadedFileNameForStorageUsing(fn (TemporaryUploadedFile $file) => Media::uploadedFileNameFor($file, Media::defaultUploadDirectory())),
                    ]),
                ]),
            ])
            ->createOptionModalHeading('Add Image')
            ->createOptionAction(fn (Action $action) => $action
                ->label($multiple ? 'Add Image' : 'Choose Image')
                ->icon('heroicon-o-photo')
                ->button()
                ->modalWidth('4xl')
                ->modalSubmitActionLabel('Use this image'))
            ->createOptionUsing(function (array $data): string {
                if (filled($data['selection'] ?? null)) {
                    return $data['selection'][0];
                }

                return Media::createFromUploadedPath($data['upload'])->path;
            });

        return $multiple ? $select->multiple() : $select;
    }

    public static function optionLabel(string $path, ?Media $media = null): string
    {
        $media ??= Media::query()->where('path', $path)->first();

        if (! $media) {
            return e(basename($path));
        }

        return sprintf(
            '<div style="display:flex;align-items:center;gap:8px"><img src="%s" style="width:32px;height:32px;object-fit:cover;border-radius:4px;flex-shrink:0" alt="" /><span>%s</span></div>',
            e($media->url),
            e($media->name),
        );
    }

    /**
     * @return array<string, string>
     */
    private static function gridOptions(?string $search = null): array
    {
        return Media::query()
            ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->orderByDesc('created_at')
            ->limit(100)
            ->get()
            ->mapWithKeys(fn (Media $media) => [$media->path => static::gridOptionLabel($media)])
            ->all();
    }

    private static function gridOptionLabel(Media $media): string
    {
        return sprintf(
            '<div style="text-align:center"><img src="%s" style="width:100%%;aspect-ratio:1;object-fit:cover;border-radius:8px;border:1px solid rgba(255,255,255,.1)" alt="" /><div style="font-size:11px;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">%s</div></div>',
            e($media->url),
            e($media->name),
        );
    }
}
