<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('visitor_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('visitor_sessions')->cascadeOnDelete();
            $table->text('body')->nullable();
            $table->enum('sender', ['visitor', 'admin'])->default('visitor');
            $table->boolean('is_read')->default(false);
            $table->string('attachment_path')->nullable();
            $table->string('attachment_name')->nullable();
            $table->string('attachment_mime')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitor_messages');
    }
};
