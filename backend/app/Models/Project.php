<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['client_id', 'service_id', 'title', 'description', 'status', 'progress', 'start_date', 'end_date', 'budget', 'notes'];

    protected $casts = ['start_date' => 'date', 'end_date' => 'date', 'budget' => 'decimal:2'];

    public function client() { return $this->belongsTo(Client::class); }
    public function service() { return $this->belongsTo(Service::class); }
    public function files() { return $this->hasMany(ProjectFile::class); }
    public function messages() { return $this->hasMany(Message::class); }
    public function invoices() { return $this->hasMany(Invoice::class); }
}
