<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'project_id', 'client_id', 'invoice_number',
        'amount', 'currency', 'paid_amount', 'status',
        'due_date', 'paid_at', 'sent_at', 'notes',
    ];

    protected $casts = [
        'due_date'    => 'date',
        'paid_at'     => 'datetime',
        'amount'      => 'decimal:2',
        'paid_amount' => 'decimal:2',
    ];

    public function project() { return $this->belongsTo(Project::class); }
    public function client()  { return $this->belongsTo(Client::class); }

    public function balance(): float
    {
        return max(0, (float) $this->amount - (float) $this->paid_amount);
    }

    public function recalculateStatus(): void
    {
        $paid = (float) $this->paid_amount;
        $total = (float) $this->amount;

        if ($paid >= $total && $total > 0) {
            $this->status   = 'paid';
            $this->paid_at  = $this->paid_at ?? now();
        } elseif ($paid > 0) {
            $this->status = 'partial';
        } else {
            $this->status = 'pending';
        }
        $this->save();
    }
}
