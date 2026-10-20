<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class BlogPostSeeder extends Seeder
{
    /**
     * Adds the posts bundled by `php artisan blog:export`. Insert-only by
     * slug: a post that already exists is left exactly as it is, so admin
     * edits on live are never clobbered. Images are copied onto the public
     * disk only when that path is still free.
     */
    public function run(): void
    {
        $file = database_path('blog/posts.json');
        if (! is_file($file)) {
            return;
        }

        $disk = Storage::disk('public');

        foreach (json_decode(file_get_contents($file), true) ?? [] as $row) {
            if (BlogPost::where('slug', $row['slug'])->exists()) {
                continue;
            }

            $image = $row['image'] ?? null;
            $bundled = $image ? database_path('blog/images/'.basename($image)) : null;
            if ($image && ! $disk->exists($image) && is_file($bundled)) {
                $disk->put($image, File::get($bundled));
            }

            $category = $row['category']
                ? BlogCategory::firstOrCreate(['slug' => $row['category']['slug']], ['name' => $row['category']['name']])
                : null;

            BlogPost::create([
                'blog_category_id' => $category?->id,
                'title'            => $row['title'],
                'slug'             => $row['slug'],
                'excerpt'          => $row['excerpt'],
                'content'          => $row['content'],
                'image'            => $image,
                'status'           => $row['status'],
                'published_at'     => $row['published_at'],
            ]);
        }
    }
}
