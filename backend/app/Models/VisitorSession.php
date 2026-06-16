<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VisitorSession extends Model
{
    protected $fillable = ['token', 'name', 'ip', 'last_seen_at'];

    public function messages()
    {
        return $this->hasMany(VisitorMessage::class, 'session_id');
    }
}
