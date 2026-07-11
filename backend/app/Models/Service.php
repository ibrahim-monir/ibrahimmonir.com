<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = ['title', 'slug', 'short_desc', 'description', 'icon', 'color', 'image', 'price', 'features', 'is_popular', 'is_active', 'order'];

    protected $casts = ['features' => 'array', 'is_popular' => 'boolean', 'is_active' => 'boolean', 'price' => 'decimal:2'];

    public function projects() { return $this->hasMany(Project::class); }
}
