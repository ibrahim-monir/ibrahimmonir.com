<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'company', 'phone', 'address', 'avatar', 'status', 'notes'];

    public function user() { return $this->belongsTo(User::class); }
    public function projects() { return $this->hasMany(Project::class); }
    public function invoices() { return $this->hasMany(Invoice::class); }
    public function directMessages() { return $this->hasMany(\App\Models\DirectMessage::class); }
}
