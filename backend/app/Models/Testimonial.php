<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = [
        'name', 'job_title', 'company', 'country',
        'rating', 'review_text', 'avatar_color', 'order', 'is_active',
        'is_linkedin', 'linkedin_url',
    ];

    protected $casts = [
        'is_active'   => 'boolean',
        'is_linkedin' => 'boolean',
        'rating'      => 'integer',
        'order'       => 'integer',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order');
    }

    public function getInitialsAttribute(): string
    {
        $parts = explode(' ', trim($this->name));
        $first = strtoupper(substr($parts[0] ?? '', 0, 1));
        $last  = strtoupper(substr($parts[1] ?? '', 0, 1));
        return $first . $last;
    }
}
