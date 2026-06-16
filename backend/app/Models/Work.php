<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    protected $fillable = ['title', 'slug', 'category', 'description', 'technologies', 'thumbnail', 'images', 'url', 'is_featured', 'is_active', 'order'];

    protected $casts = ['technologies' => 'array', 'images' => 'array', 'is_featured' => 'boolean', 'is_active' => 'boolean'];
}
