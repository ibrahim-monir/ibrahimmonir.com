<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->unsignedSmallInteger('milestone_no')->nullable()->after('project_id');
            $table->unsignedSmallInteger('total_milestones')->nullable()->after('milestone_no');
            $table->decimal('total_budget', 12, 2)->nullable()->after('total_milestones');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['milestone_no', 'total_milestones', 'total_budget']);
        });
    }
};
