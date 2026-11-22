<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * MFS (bKash/Nagad) cash-out charge added on top of the advance, so the
 * full advance arrives after the receiver cashes out. amount stays the
 * advance; the customer sends amount + charge.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('charge_percent', 5, 2)->default(0)->after('amount');
            $table->decimal('charge', 12, 2)->default(0)->after('charge_percent');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['charge_percent', 'charge']);
        });
    }
};
