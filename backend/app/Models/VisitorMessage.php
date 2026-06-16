<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitorMessage extends Model
{
    protected $fillable = [
        'session_id', 'body', 'sender', 'is_read',
        'attachment_path', 'attachment_name', 'attachment_mime',
    ];

    protected $casts = ['is_read' => 'boolean'];

    public function session()
    {
        return $this->belongsTo(VisitorSession::class, 'session_id');
    }
}
