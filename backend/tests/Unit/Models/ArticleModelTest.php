<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ArticleModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function article_belongs_to_category()
    {
        $category = Category::factory()->create();
        $article = Article::factory()->create(['category_id' => $category->id]);

        $this->assertEquals($category->id, $article->category->id);
    }

    /** @test */
    public function article_belongs_to_author()
    {
        $user = User::factory()->create();
        $article = Article::factory()->create(['author_id' => $user->id]);

        $this->assertEquals($user->id, $article->author->id);
    }

    /** @test */
    public function article_has_many_comments()
    {
        $article = Article::factory()->create();
        $comments = Comment::factory(3)->create(['article_id' => $article->id]);

        $this->assertCount(3, $article->comments);
        $this->assertTrue($article->comments->contains($comments[0]));
    }

    /** @test */
    public function article_belongs_to_many_users_saved_articles()
    {
        $article = Article::factory()->create();
        $users = User::factory(2)->create();

        $article->savedByUsers()->attach($users->pluck('id'));

        $this->assertCount(2, $article->savedByUsers);
    }

    /** @test */
    public function featured_scope_returns_only_featured_articles()
    {
        Article::factory(2)->create(['featured' => false]);
        Article::factory(3)->featured()->create();

        $featured = Article::featured()->get();

        $this->assertCount(3, $featured);
        $this->assertTrue($featured->every(fn ($article) => $article->featured));
    }

    /** @test */
    public function published_scope_returns_only_published_articles()
    {
        Article::factory(2)->unpublished()->create();
        Article::factory(3)->create();

        $published = Article::published()->get();

        $this->assertCount(3, $published);
        $this->assertTrue($published->every(fn ($article) => $article->published_at !== null));
    }
}
