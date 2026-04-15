<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\User;
use App\Models\Article;
use App\Models\Comment;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UserModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_be_created_with_valid_data()
    {
        $user = User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password123'),
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
            'name' => 'John Doe',
        ]);
    }

    /** @test */
    public function user_has_articles_relationship()
    {
        $user = User::factory()->create();
        $article = Article::factory()->create(['author_id' => $user->id]);

        $this->assertTrue($user->articles->contains($article));
    }

    /** @test */
    public function user_has_comments_relationship()
    {
        $user = User::factory()->create();
        $article = Article::factory()->create();
        $comment = Comment::factory()->create([
            'user_id' => $user->id,
            'article_id' => $article->id,
        ]);

        $this->assertTrue($user->comments->contains($comment));
    }

    /** @test */
    public function user_has_saved_articles_relationship()
    {
        $user = User::factory()->create();
        $article = Article::factory()->create();
        $user->savedArticles()->attach($article->id);

        $this->assertTrue($user->refresh()->savedArticles->contains($article));
    }

    /** @test */
    public function is_admin_method_returns_correct_value()
    {
        $admin = User::factory()->admin()->create();
        $user = User::factory()->create();

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($user->isAdmin());
    }
}
