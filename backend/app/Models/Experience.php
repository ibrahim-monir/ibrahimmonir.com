<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = ['role', 'company', 'year_start', 'year_end', 'description', 'order', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('order')->orderByDesc('year_start');
    }

    public function getYearLabelAttribute(): string
    {
        $end = $this->year_end ?: 'Present';
        return "{$this->year_start}–{$end}";
    }
}
