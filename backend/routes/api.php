<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

// ===== AUTHENTICATION ROUTES (No Auth Required) =====
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

// ===== PROTECTED ROUTES (JWT Required) =====
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // User Profile
    Route::get('/users/me/saved-articles', [UserController::class, 'getSavedArticles']);
    Route::post('/users/me/save-article', [UserController::class, 'saveArticle']);
    Route::delete('/users/me/saved-articles/{articleId}', [UserController::class, 'removeSavedArticle']);
    Route::put('/users/me', [UserController::class, 'updateProfile']);

    // Comments (Create/Delete)
    Route::post('/articles/{article}/comments', [CommentController::class, 'store']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    // Articles (Admin Only)
    Route::post('/articles', [ArticleController::class, 'store'])->middleware('admin');
    Route::put('/articles/{article}', [ArticleController::class, 'update'])->middleware('admin');
    Route::delete('/articles/{article}', [ArticleController::class, 'destroy'])->middleware('admin');
});

// ===== PUBLIC ROUTES (No Auth Required) =====

// Articles
Route::get('/articles', [ArticleController::class, 'index']);
Route::get('/articles/featured', [ArticleController::class, 'featured']);
Route::get('/articles/search', [ArticleController::class, 'search']);
Route::get('/articles/{slug}', [ArticleController::class, 'show']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/categories/{category}/articles', [ArticleController::class, 'byCategory']);

// Newsletter (Public)
Route::post('/newsletter/subscribe', function (Request $request) {
    $request->validate(['email' => 'required|email']);
    
    \App\Models\NewsletterSubscription::firstOrCreate(
        ['email' => $request->email],
        ['email' => $request->email]
    );

    return response()->json(['message' => 'Subscribed successfully'], 201);
});

Route::post('/newsletter/unsubscribe', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    \App\Models\NewsletterSubscription::where('email', $request->email)->delete();

    return response()->json(['message' => 'Unsubscribed successfully']);
});
