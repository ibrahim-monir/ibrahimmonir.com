<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Livewire\Features\SupportFileUploads\TemporaryUploadedFile;

class Media extends Model
{
    protected $table = 'media';

    protected $fillable = ['name', 'file_name', 'path', 'disk', 'mime_type', 'size', 'alt_text', 'caption', 'description'];

    protected static function booted(): void
    {
        static::deleting(function (Media $media) {
            Storage::disk($media->disk)->delete($media->path);
        });

        static::saving(function (Media $media) {
            if (! $media->exists || ! $media->isDirty('name')) {
                return;
            }

            $media->renameFileToMatchName();
        });
    }

    /**
     * Copies (never moves) the file to a slug-of-the-title path so the URL
     * stays readable. The old file is left in place on purpose — anything
     * that already stored the old path directly (e.g. a Work's thumbnail
     * field, which isn't linked to this table) keeps working.
     */
    public function renameFileToMatchName(): void
    {
        $disk = Storage::disk($this->disk);
        $directory = pathinfo($this->path, PATHINFO_DIRNAME);
        $extension = pathinfo($this->path, PATHINFO_EXTENSION);

        $candidate = static::findAvailablePath($this->disk, $directory, Str::slug($this->name), $extension, exceptPath: $this->path);

        if ($candidate === $this->path) {
            return;
        }

        $disk->copy($this->path, $candidate);
        $this->path = $candidate;
        $this->file_name = basename($candidate);
    }

    /**
     * WordPress-style "slug.ext", "slug-1.ext", "slug-2.ext", ... — the first
     * path in that sequence that isn't already taken on disk.
     */
    public static function findAvailablePath(string $disk, string $directory, string $slug, string $extension, ?string $exceptPath = null): string
    {
        $storage = Storage::disk($disk);
        $slug = $slug ?: 'file';

        $candidate = "{$directory}/{$slug}.{$extension}";
        $suffix = 1;
        while ($candidate !== $exceptPath && $storage->exists($candidate)) {
            $candidate = "{$directory}/{$slug}-{$suffix}.{$extension}";
            $suffix++;
        }

        return $candidate;
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    /** WordPress-style "media/2026/07" so uploads don't pile up in one flat folder. */
    public static function defaultUploadDirectory(): string
    {
        return 'media/'.now()->format('Y/m');
    }

    public static function createFromUploadedPath(string $path, string $disk = 'public'): self
    {
        return static::create([
            'name'      => pathinfo($path, PATHINFO_FILENAME),
            'file_name' => basename($path),
            'path'      => $path,
            'disk'      => $disk,
            'mime_type' => Storage::disk($disk)->mimeType($path),
            'size'      => Storage::disk($disk)->size($path),
        ]);
    }

    /** Picks a slugified, WordPress-style storage name for a freshly uploaded file. */
    public static function uploadedFileNameFor(TemporaryUploadedFile $file, string $directory): string
    {
        $slug = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $extension = $file->getClientOriginalExtension() ?: $file->extension();

        return basename(static::findAvailablePath('public', $directory, $slug, $extension));
    }

    /** Stores the file directly (for uploaders that don't go through a FileUpload field, e.g. RichEditor) and catalogs it. */
    public static function storeUploadedFile(TemporaryUploadedFile $file, ?string $directory = null): self
    {
        $directory ??= static::defaultUploadDirectory();
        $filename = static::uploadedFileNameFor($file, $directory);
        $path = $file->storeAs($directory, $filename, 'public');

        return static::createFromUploadedPath($path);
    }
}
