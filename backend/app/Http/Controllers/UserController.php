<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Get current user's saved articles
     */
    public function getSavedArticles(Request $request): JsonResponse
    {
        $user = $request->user();

        $articles = $user->savedArticles()
            ->with(['category', 'author:id,name,avatar_url,bio'])
            ->orderByDesc('published_at')
            ->paginate(10);

        return response()->json($articles);
    }

    /**
     * Save an article
     */
    public function saveArticle(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'article_id' => 'required|exists:articles,id',
        ]);

        $user = $request->user();
        $article_id = $validated['article_id'];

        // Check if already saved
        if ($user->savedArticles()->where('article_id', $article_id)->exists()) {
            return response()->json(['message' => 'Article already saved'], 400);
        }

        $user->savedArticles()->attach($article_id);

        return response()->json(['message' => 'Article saved successfully']);
    }

    /**
     * Remove a saved article
     */
    public function removeSavedArticle(Request $request, int $articleId): JsonResponse
    {
        $user = $request->user();

        $user->savedArticles()->detach($articleId);

        return response()->json(['message' => 'Article removed from saved']);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'avatar_url' => 'sometimes|url|nullable',
            'bio' => 'sometimes|string|max:1000',
            'newsletter_subscribed' => 'sometimes|boolean',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user,
        ]);
    }
}
