<?php

namespace App\Console\Commands;

use App\Models\BlogPost;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class BlogExport extends Command
{
    protected $signature = 'blog:export';

    protected $description = 'Bundle published blog posts + their images into database/blog/ for BlogPostSeeder to add on live';

    /**
     * blog_posts is deliberately NOT in content:export's allow-list (see
     * ContentExport::ALLOWED) -- live may hold posts written there. This
     * bundle is consumed insert-only by slug, so it can only ADD posts on
     * live, never overwrite one. Uploaded images don't ship with a deploy,
     * so the ones these posts use are copied alongside.
     */
    public function handle(): int
    {
        $dir = database_path('blog');
        $imageDir = $dir.'/images';
        File::ensureDirectoryExists($imageDir);
        File::cleanDirectory($imageDir);

        $disk = Storage::disk('public');
        $posts = BlogPost::published()->with('category')->orderBy('id')->get();

        $out = $posts->map(function (BlogPost $post) use ($disk, $imageDir) {
            if ($post->image && $disk->exists($post->image)) {
                File::copy($disk->path($post->image), $imageDir.'/'.basename($post->image));
            } elseif ($post->image) {
                $this->warn("  missing image for {$post->slug}: {$post->image}");
            }

            return [
                'category'     => $post->category ? ['name' => $post->category->name, 'slug' => $post->category->slug] : null,
                'title'        => $post->title,
                'slug'         => $post->slug,
                'excerpt'      => $post->excerpt,
                'content'      => $post->content,
                'image'        => $post->image,
                'status'       => $post->status,
                'published_at' => $post->published_at?->toDateTimeString(),
            ];
        })->all();

        file_put_contents(
            $dir.'/posts.json',
            json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)."\n"
        );

        $this->info('Exported '.count($out).' posts → '.$dir);

        return self::SUCCESS;
    }
}
