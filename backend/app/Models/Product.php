<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['title', 'slug', 'category', 'short_desc', 'description', 'image', 'preview_url', 'demo_url', 'price', 'is_active', 'is_featured', 'downloads'];

    protected $casts = ['is_active' => 'boolean', 'is_featured' => 'boolean', 'price' => 'decimal:2'];
}
