<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ArticleEndpointTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_list_articles()
    {
        Article::factory(5)->create();

        $response = $this->getJson('/api/articles?page=1&per_page=6');

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'total', 'current_page', 'last_page']);

        $this->assertCount(5, $response->json('data'));
    }

    /** @test */
    public function user_can_get_featured_articles()
    {
        Article::factory(3)->featured()->create();
        Article::factory(2)->create();

        $response = $this->getJson('/api/articles/featured');

        $response->assertStatus(200);
        
        $featured = $response->json();
        $this->assertTrue(count($featured) >= 3);
    }

    /** @test */
    public function user_can_get_article_by_slug()
    {
        $article = Article::factory()->create(['slug' => 'test-article']);

        $response = $this->getJson("/api/articles/test-article");

        $response->assertStatus(200)
            ->assertJson([
                'title' => $article->title,
                'slug' => 'test-article',
                'content' => $article->content,
            ]);
    }

    /** @test */
    public function user_gets_404_for_nonexistent_article()
    {
        $response = $this->getJson('/api/articles/nonexistent-article');

        $response->assertStatus(404);
    }

    /** @test */
    public function user_can_search_articles()
    {
        Article::factory()->create(['title' => 'Laravel Tutorial']);
        Article::factory()->create(['title' => 'Vue.js Guide']);

        $response = $this->getJson('/api/articles/search?q=Laravel');

        $response->assertStatus(200);
        
        $results = $response->json();
        $this->assertTrue(
            collect($results)->some(fn ($article) => str_contains($article['title'], 'Laravel'))
        );
    }

    /** @test */
    public function user_can_get_articles_by_category()
    {
        $category = Category::factory()->create();
        Article::factory(3)->create(['category_id' => $category->id]);
        Article::factory(2)->create();

        $response = $this->getJson("/api/categories/{$category->id}/articles");

        $response->assertStatus(200)
            ->assertJsonStructure(['data', 'total', 'current_page', 'last_page']);

        $this->assertCount(3, $response->json('data'));
    }

    /** @test */
    public function article_view_count_increments()
    {
        $article = Article::factory()->create(['view_count' => 5]);

        $this->getJson("/api/articles/{$article->slug}");

        $this->assertEquals(6, $article->refresh()->view_count);
    }

    /** @test */
    public function authenticated_user_can_create_article_as_admin()
    {
        $admin = User::factory()->admin()->create();
        $category = Category::factory()->create();

        $response = $this->actingAs($admin)->postJson('/api/articles', [
            'title' => 'New Article',
            'content' => 'Article content',
            'excerpt' => 'Excerpt',
            'category_id' => $category->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'title', 'slug']);
    }

    /** @test */
    public function non_admin_user_cannot_create_article()
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/articles', [
            'title' => 'New Article',
            'content' => 'Article content',
            'excerpt' => 'Excerpt',
            'category_id' => $category->id,
        ]);

        $response->assertStatus(403);
    }
}
