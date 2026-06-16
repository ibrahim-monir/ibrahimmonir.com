<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectFile extends Model
{
    protected $fillable = ['project_id', 'name', 'path', 'size', 'mime_type', 'uploaded_by'];

    public function project() { return $this->belongsTo(Project::class); }
}
