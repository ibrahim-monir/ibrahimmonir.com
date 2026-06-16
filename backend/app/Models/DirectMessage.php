<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DirectMessage extends Model
{
    protected $fillable = ['user_id', 'client_id', 'body', 'attachment_path', 'attachment_name', 'attachment_mime', 'is_read'];

    protected $casts = ['is_read' => 'boolean'];

    public function user()   { return $this->belongsTo(User::class); }
    public function client() { return $this->belongsTo(Client::class); }
}
