<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Article;

class ArticlePolicy
{
    /**
     * Determine if user can create articles
     */
    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determine if user can update articles
     */
    public function update(User $user, Article $article): bool
    {
        return $user->isAdmin() || $user->id === $article->author_id;
    }

    /**
     * Determine if user can delete articles
     */
    public function delete(User $user, Article $article): bool
    {
        return $user->isAdmin();
    }
}
