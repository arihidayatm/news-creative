<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ArticleController extends Controller
{
    /**
     * Get all published articles with pagination
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 10);
        $category = $request->get('category');
        $featured = $request->get('featured', false);

        $query = Article::published();

        if ($category) {
            $query->byCategory($category);
        }

        if ($featured) {
            $query->featured();
        }

        $articles = $query->with(['category', 'author:id,name,avatar_url,bio'])
            ->orderByDesc('published_at')
            ->paginate($perPage);

        return response()->json($articles);
    }

    /**
     * Search articles by title, content, or category
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q', '');
        $perPage = $request->get('per_page', 10);

        if (strlen($query) < 2) {
            return response()->json(['message' => 'Search query too short'], 400);
        }

        $articles = Article::published()
            ->where('title', 'LIKE', "%{$query}%")
            ->orWhere('content', 'LIKE', "%{$query}%")
            ->with(['category', 'author:id,name,avatar_url,bio'])
            ->orderByDesc('published_at')
            ->paginate($perPage);

        return response()->json($articles);
    }

    /**
     * Get single article by slug
     */
    public function show(string $slug): JsonResponse
    {
        $article = Article::published()
            ->where('slug', $slug)
            ->with(['category', 'author:id,name,avatar_url,bio', 'comments.user:id,name,avatar_url'])
            ->firstOrFail();

        $article->incrementViewCount();

        return response()->json($article);
    }

    /**
     * Create new article (admin only)
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('create', Article::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:articles',
            'content' => 'required|string',
            'excerpt' => 'nullable|string|max:500',
            'featured_image_url' => 'nullable|url',
            'category_id' => 'required|exists:categories,id',
            'featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $validated['author_id'] = auth()->id();

        $article = Article::create($validated);

        return response()->json($article, 201);
    }

    /**
     * Update article (admin only or author)
     */
    public function update(Request $request, Article $article): JsonResponse
    {
        $this->authorize('update', $article);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:articles,slug,' . $article->id,
            'content' => 'sometimes|string',
            'excerpt' => 'nullable|string|max:500',
            'featured_image_url' => 'nullable|url',
            'category_id' => 'sometimes|exists:categories,id',
            'featured' => 'boolean',
            'published_at' => 'nullable|date',
        ]);

        $article->update($validated);

        return response()->json($article);
    }

    /**
     * Delete article (admin only)
     */
    public function destroy(Article $article): JsonResponse
    {
        $this->authorize('delete', $article);

        $article->delete();

        return response()->json(['message' => 'Article deleted successfully']);
    }

    /**
     * Get featured articles
     */
    public function featured(): JsonResponse
    {
        $articles = Article::published()
            ->featured()
            ->with(['category', 'author:id,name,avatar_url,bio'])
            ->orderByDesc('published_at')
            ->limit(5)
            ->get();

        return response()->json($articles);
    }

    /**
     * Get articles by category
     */
    public function byCategory(Category $category, Request $request): JsonResponse
    {
        $perPage = $request->get('per_page', 10);

        $articles = Article::published()
            ->byCategory($category->id)
            ->with(['category', 'author:id,name,avatar_url,bio'])
            ->orderByDesc('published_at')
            ->paginate($perPage);

        return response()->json($articles);
    }
}
