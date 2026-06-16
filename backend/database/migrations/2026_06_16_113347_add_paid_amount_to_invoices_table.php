<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->decimal('paid_amount', 12, 2)->default(0)->after('amount');
            $table->string('sent_at')->nullable()->after('paid_at');
        });

        // Extend the status enum to include 'partial'
        DB::statement("ALTER TABLE invoices MODIFY COLUMN status ENUM('pending','partial','paid','overdue','cancelled') DEFAULT 'pending'");
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['paid_amount', 'sent_at']);
        });

        DB::statement("ALTER TABLE invoices MODIFY COLUMN status ENUM('pending','paid','overdue','cancelled') DEFAULT 'pending'");
    }
};
