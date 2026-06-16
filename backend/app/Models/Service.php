<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = ['title', 'slug', 'short_desc', 'description', 'icon', 'image', 'price', 'is_active', 'order'];

    protected $casts = ['is_active' => 'boolean', 'price' => 'decimal:2'];

    public function projects() { return $this->hasMany(Project::class); }
}
