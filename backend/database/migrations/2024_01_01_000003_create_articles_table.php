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
        Schema::create('articles', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->longText('content');
            $table->string('excerpt', 500)->nullable();
            $table->string('featured_image_url', 500)->nullable();
            $table->bigInteger('category_id')->unsigned();
            $table->bigInteger('author_id')->unsigned();
            $table->boolean('featured')->default(false);
            $table->integer('view_count')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('category_id')
                ->references('id')
                ->on('categories')
                ->cascadeOnDelete();
            
            $table->foreign('author_id')
                ->references('id')
                ->on('users')
                ->cascadeOnDelete();

            // Indexes
            $table->index('category_id');
            $table->index(['published_at']);
            $table->index('created_at');
            
            // Note: Full-text search index (fullText) only works with MySQL/MariaDB
            // Will be added separately if needed for production
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
