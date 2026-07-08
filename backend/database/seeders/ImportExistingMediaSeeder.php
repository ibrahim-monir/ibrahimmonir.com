<?php

namespace Database\Seeders;

use App\Models\Media;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ImportExistingMediaSeeder extends Seeder
{
    private const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];

    /**
     * One-time backfill of images already on the public disk (uploaded before
     * the Media Library existed) into the `media` table. Safe to re-run —
     * skips paths that are already tracked.
     */
    public function run(): void
    {
        $disk = Storage::disk('public');
        $tracked = Media::pluck('path')->flip();

        foreach ($disk->allFiles() as $path) {
            if (isset($tracked[$path])) {
                continue;
            }

            $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            if (! in_array($extension, self::EXTENSIONS, true)) {
                continue;
            }

            Media::create([
                'name'      => pathinfo($path, PATHINFO_FILENAME),
                'file_name' => basename($path),
                'path'      => $path,
                'disk'      => 'public',
                'mime_type' => $disk->mimeType($path) ?: null,
                'size'      => $disk->size($path),
            ]);
        }
    }
}
