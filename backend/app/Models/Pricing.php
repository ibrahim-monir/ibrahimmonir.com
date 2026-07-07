<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable = ['title', 'description', 'price', 'bdt_price', 'billing_cycle', 'features', 'is_popular', 'is_active', 'order'];

    protected $casts = ['features' => 'array', 'is_popular' => 'boolean', 'is_active' => 'boolean', 'price' => 'decimal:2', 'bdt_price' => 'decimal:2'];
}
