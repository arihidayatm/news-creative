<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /**
     * Get all categories
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount('articles')
            ->orderBy('name')
            ->get();

        return response()->json($categories);
    }

    /**
     * Get single category with articles
     */
    public function show(Category $category): JsonResponse
    {
        $category->load(['articles' => function ($query) {
            $query->where('published_at', '<=', now())
                  ->orderByDesc('published_at')
                  ->limit(10);
        }]);

        $category->loadCount('articles');

        return response()->json($category);
    }
}
