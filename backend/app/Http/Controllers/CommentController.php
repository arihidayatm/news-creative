<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    /**
     * Store a new comment on an article
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'article_id' => 'required|exists:articles,id',
            'content' => 'required|string|max:1000',
        ]);

        $validated['user_id'] = auth()->id();

        $comment = Comment::create($validated);
        $comment->load('user:id,name,avatar_url');

        return response()->json($comment, 201);
    }

    /**
     * Delete a comment (admin or owner)
     */
    public function destroy(Comment $comment): JsonResponse
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}
