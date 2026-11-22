<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Package orders placed from the Pricing page. Payment is manual (bKash, Nagad
 * or bank transfer): the client pays the advance and submits the transaction
 * ID, then the admin verifies it and confirms the order.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('pricing_id')->nullable()->constrained('pricings')->nullOnDelete();
            $table->string('package_title');
            $table->string('billing_cycle')->nullable();

            // Customer
            $table->string('name');
            $table->string('email');
            $table->string('phone', 30);
            $table->string('company')->nullable();
            $table->text('project_details')->nullable();

            // Money — package price and the advance due now, in the currency paid.
            $table->string('currency', 3);
            $table->decimal('package_price', 12, 2);
            $table->unsignedTinyInteger('advance_percent');
            $table->decimal('amount', 12, 2);

            // Payment proof submitted by the customer
            $table->string('payment_method', 20); // bkash | nagad | bank
            $table->string('payer_account')->nullable();
            $table->string('transaction_id');

            $table->string('status', 20)->default('pending'); // pending | confirmed | rejected | cancelled
            $table->text('admin_note')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->string('ip', 45)->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('transaction_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
