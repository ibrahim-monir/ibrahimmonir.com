<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{
    protected $fillable = ['blog_category_id', 'title', 'slug', 'excerpt', 'content', 'image', 'status', 'published_at'];

    protected $casts = ['published_at' => 'datetime'];

    protected static function boot(): void
    {
        parent::boot();

        static::saving(function (self $post) {
            if ($post->status === 'published' && is_null($post->published_at)) {
                $post->published_at = now();
            }
        });
    }

    public function category() { return $this->belongsTo(BlogCategory::class, 'blog_category_id'); }

    public function scopePublished($query) { return $query->where('status', 'published'); }
}
