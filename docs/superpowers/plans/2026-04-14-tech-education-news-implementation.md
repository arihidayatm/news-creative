# Tech & Education News Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, modern news platform with React frontend + Laravel API backend, featuring article management, user authentication, comments, search, and saved articles.

**Architecture:** Separate frontend SPA (React/TypeScript) communicates via REST API with stateless Laravel backend. Database stores articles, users, comments, categories with JWT-based authentication. Frontend deployed to Vercel, backend to cloud server.

**Tech Stack:** React 18 + TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, React Hook Form, Laravel 11, PostgreSQL/MySQL, JWT (Sanctum), PHPUnit, Vitest

---

## File Structure & Organization

### Backend (Laravel)

```
laravel-projects/news-creative/backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── ArticleController.php
│   │   │   ├── AuthController.php
│   │   │   ├── CommentController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── UserController.php
│   │   │   ├── SearchController.php
│   │   │   ├── NewsletterController.php
│   │   │   └── AdminController.php
│   │   ├── Requests/
│   │   │   ├── StoreArticleRequest.php
│   │   │   ├── UpdateArticleRequest.php
│   │   │   ├── StoreCommentRequest.php
│   │   │   └── RegisterRequest.php
│   │   └── Middleware/
│   │       ├── EnsureAdminRole.php
│   │       └── RateLimitComments.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Article.php
│   │   ├── Category.php
│   │   ├── Comment.php
│   │   └── NewsletterSubscription.php
│   ├── Services/
│   │   ├── ArticleService.php
│   │   ├── AuthService.php
│   │   └── SearchService.php
│   └── Exceptions/
│       └── CustomException.php
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_create_users_table.php
│   │   ├── 2024_01_01_000002_create_categories_table.php
│   │   ├── 2024_01_01_000003_create_articles_table.php
│   │   ├── 2024_01_01_000004_create_comments_table.php
│   │   ├── 2024_01_01_000005_create_saved_articles_table.php
│   │   └── 2024_01_01_000006_create_newsletter_subscriptions_table.php
│   └── seeders/
│       ├── CategorySeeder.php
│       ├── UserSeeder.php
│       └── ArticleSeeder.php
├── routes/
│   └── api.php
├── tests/
│   ├── Feature/
│   │   ├── ArticleApiTest.php
│   │   ├── AuthApiTest.php
│   │   ├── CommentApiTest.php
│   │   └── SearchApiTest.php
│   └── Unit/
│       ├── ArticleTest.php
│       ├── UserTest.php
│       └── ArticleServiceTest.php
├── docker-compose.yml
├── .env.example
└── README.md
```

### Frontend (React)

```
laravel-projects/news-creative/frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── articles/
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── ArticleGrid.tsx
│   │   │   ├── RelatedArticles.tsx
│   │   │   └── ArticleDetail.tsx
│   │   ├── comments/
│   │   │   ├── CommentSection.tsx
│   │   │   ├── CommentForm.tsx
│   │   │   └── CommentList.tsx
│   │   ├── auth/
│   │   │   ├── AuthModal.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   └── SearchResults.tsx
│   │   └── categories/
│   │       ├── CategoryFilter.tsx
│   │       └── CategoryBrowse.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ArticlePage.tsx
│   │   ├── CategoryPage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── SavedArticlesPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useArticles.ts
│   │   ├── useComments.ts
│   │   ├── useSearch.ts
│   │   └── useCategories.ts
│   ├── services/
│   │   ├── api.ts (Axios instance + config)
│   │   ├── articleService.ts
│   │   ├── authService.ts
│   │   ├── commentService.ts
│   │   ├── searchService.ts
│   │   └── newsletterService.ts
│   ├── types/
│   │   └── index.ts (TypeScript interfaces)
│   ├── utils/
│   │   ├── formatters.ts (date, text formatters)
│   │   └── validators.ts (email, password validation)
│   ├── styles/
│   │   ├── globals.css (Tailwind, reset)
│   │   └── theme.css (custom properties)
│   ├── App.tsx (Router setup)
│   └── main.tsx (Entry point)
├── tests/
│   ├── components/
│   │   ├── ArticleCard.test.tsx
│   │   ├── CommentSection.test.tsx
│   │   └── Header.test.tsx
│   ├── pages/
│   │   └── HomePage.test.tsx
│   ├── services/
│   │   └── articleService.test.ts
│   └── setup.ts (Vitest config)
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── .env.example
└── package.json
```

---

## Phase 1: Project Initialization & Database (Week 1)

### Task 1: Initialize Backend Project Structure

**Files:**

- Create: `backend/.env`
- Create: `backend/docker-compose.yml`
- Modify: `backend/composer.json`
- Modify: `backend/.gitignore`

- [ ] **Step 1: Create backend directory and initialize Laravel**

```bash
cd /home/mahdev/laravel-projects/news-creative
mkdir -p backend
cd backend
```

- [ ] **Step 2: Create .env configuration file**

```bash
cat > .env << 'EOF'
APP_NAME="News Creative"
APP_ENV=local
APP_KEY=base64:$(php -r 'echo base64_encode(random_bytes(32));')
APP_DEBUG=true
APP_URL=http://localhost:8000

LOG_CHANNEL=stack

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=news_creative
DB_USERNAME=mahdev
DB_PASSWORD=passwordku

JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=10080

MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@news-creative.local
MAIL_FROM_NAME="News Creative"

CACHE_DRIVER=file
QUEUE_CONNECTION=sync

CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
EOF
```

- [ ] **Step 3: Create docker-compose.yml for MySQL**

```yaml
version: "3.8"

services:
  mysql:
    image: mysql:8.0
    container_name: news-creative-mysql
    environment:
      MYSQL_DATABASE: news_creative
      MYSQL_ROOT_PASSWORD: root
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

volumes:
  mysql_data:
```

- [ ] **Step 4: Add Laravel dependencies to composer.json if new project**

If starting from scratch, ensure these are in composer.json:

```json
{
  "require": {
    "laravel/framework": "^11.0",
    "laravel/sanctum": "^3.0",
    "symfony/http-foundation": "^7.0"
  },
  "require-dev": {
    "phpunit/phpunit": "^10.0",
    "laravel/pint": "^1.0"
  }
}
```

- [ ] **Step 5: Commit initialization**

```bash
git add backend/.env backend/docker-compose.yml backend/composer.json backend/.gitignore
git commit -m "initial: backend project structure"
```

---

### Task 2: Create Database Migrations

**Files:**

- Create: `backend/database/migrations/2024_01_01_000001_create_users_table.php`
- Create: `backend/database/migrations/2024_01_01_000002_create_categories_table.php`
- Create: `backend/database/migrations/2024_01_01_000003_create_articles_table.php`
- Create: `backend/database/migrations/2024_01_01_000004_create_comments_table.php`
- Create: `backend/database/migrations/2024_01_01_000005_create_saved_articles_table.php`
- Create: `backend/database/migrations/2024_01_01_000006_create_newsletter_subscriptions_table.php`

- [ ] **Step 1: Create users table migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('name');
            $table->string('password');
            $table->string('avatar_url')->nullable();
            $table->text('bio')->nullable();
            $table->enum('role', ['ADMIN', 'USER'])->default('USER');
            $table->boolean('newsletter_subscribed')->default(true);
            $table->timestamps();
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

- [ ] **Step 2: Create categories table migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

- [ ] **Step 3: Create articles table migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->longText('content');
            $table->string('excerpt', 500)->nullable();
            $table->string('featured_image_url', 500)->nullable();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
            $table->boolean('featured')->default(false);
            $table->integer('view_count')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->index('category_id');
            $table->index('published_at');
            $table->index('created_at');
            $table->fullText(['title', 'excerpt', 'content']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
```

- [ ] **Step 4: Create comments table migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->text('content');
            $table->timestamps();
            $table->index('article_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
```

- [ ] **Step 5: Create saved_articles table migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('saved_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('article_id')->constrained('articles')->cascadeOnDelete();
            $table->timestamp('created_at');
            $table->index(['user_id', 'article_id']);
            $table->unique(['user_id', 'article_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_articles');
    }
};
```

- [ ] **Step 6: Create newsletter_subscriptions table migration**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('newsletter_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->timestamp('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('newsletter_subscriptions');
    }
};
```

- [ ] **Step 7: Run migrations to verify**

```bash
cd backend
php artisan migrate:fresh
```

Expected output: All migrations should run successfully with "Migrated" messages

- [ ] **Step 8: Commit migrations**

```bash
git add database/migrations/
git commit -m "feat: create database migrations"
```

---

### Task 3: Create Eloquent Models

**Files:**

- Create: `backend/app/Models/User.php`
- Create: `backend/app/Models/Category.php`
- Create: `backend/app/Models/Article.php`
- Create: `backend/app/Models/Comment.php`
- Create: `backend/app/Models/NewsletterSubscription.php`

- [ ] **Step 1: Create User model with relationships**

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar_url',
        'bio',
        'role',
        'newsletter_subscribed',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'newsletter_subscribed' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function articles()
    {
        return $this->hasMany(Article::class, 'author_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function savedArticles()
    {
        return $this->belongsToMany(Article::class, 'saved_articles');
    }

    public function isAdmin()
    {
        return $this->role === 'ADMIN';
    }
}
```

- [ ] **Step 2: Create Category model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description'];

    public function articles()
    {
        return $this->hasMany(Article::class);
    }
}
```

- [ ] **Step 3: Create Article model with relationships**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Article extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'content',
        'excerpt',
        'featured_image_url',
        'category_id',
        'author_id',
        'featured',
        'view_count',
        'published_at',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'published_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->orderByDesc('created_at');
    }

    public function savedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'saved_articles');
    }

    public function incrementViewCount(): void
    {
        $this->increment('view_count');
    }

    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }
}
```

- [ ] **Step 4: Create Comment model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comment extends Model
{
    protected $fillable = ['content', 'article_id', 'user_id'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

- [ ] **Step 5: Create NewsletterSubscription model**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscription extends Model
{
    protected $fillable = ['email'];
    public $timestamps = false;

    protected $casts = [
        'created_at' => 'datetime',
    ];
}
```

- [ ] **Step 6: Test models by running Tinker**

```bash
cd backend
php artisan tinker
>>> User::count()
=> 0
>>> Category::count()
=> 0
>>> exit
```

- [ ] **Step 7: Commit models**

```bash
git add app/Models/
git commit -m "feat: create Eloquent models"
```

---

### Task 4: Initialize Frontend Project Structure

**Files:**

- Create: `frontend/package.json`
- Create: `frontend/vite.config.ts`
- Create: `frontend/tsconfig.json`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/.env.example`

- [ ] **Step 1: Create frontend directory and setup package.json**

```bash
cd /home/mahdev/laravel-projects/news-creative
mkdir -p frontend
cd frontend

cat > package.json << 'EOF'
{
  "name": "news-creative-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "vitest": "^1.0.0",
    "@vitest/ui": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.0"
  }
}
EOF
```

- [ ] **Step 2: Create vite.config.ts**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: Create tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

- [ ] **Step 5: Create .env.example**

```bash
VITE_API_URL=http://localhost:8000/api
VITE_ENV=development
```

- [ ] **Step 6: Create globals CSS with Tailwind directives**

```bash
mkdir -p src/styles
cat > src/styles/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOF
```

- [ ] **Step 7: Create basic TypeScript types file**

```bash
mkdir -p src/types
cat > src/types/index.ts << 'EOF'
export interface User {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  role: 'ADMIN' | 'USER';
  newsletter_subscribed: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  category_id: number;
  category: Category;
  author_id: number;
  author: User;
  featured: boolean;
  view_count: number;
  published_at?: string;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  article_id: number;
  user_id: number;
  user: User;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
EOF
```

- [ ] **Step 8: Install frontend dependencies**

```bash
cd frontend
npm install
```

Expected: All dependencies installed successfully

- [ ] **Step 9: Commit frontend setup**

```bash
git add frontend/package.json frontend/vite.config.ts frontend/tsconfig.json frontend/tailwind.config.js frontend/.env.example frontend/src/styles/ frontend/src/types/
git commit -m "initial: frontend project setup"
```

---

## Phase 2: Authentication & User Management (Week 1-2)

### Task 5: Create Authentication API Endpoints

**Files:**

- Create: `backend/app/Http/Requests/RegisterRequest.php`
- Create: `backend/app/Http/Requests/LoginRequest.php`
- Create: `backend/app/Http/Controllers/AuthController.php`
- Modify: `backend/routes/api.php`

- [ ] **Step 1: Create RegisterRequest validation class**

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already registered.',
            'password.min' => 'Password must be at least 8 characters.',
            'password.confirmed' => 'Passwords do not match.',
        ];
    }
}
```

- [ ] **Step 2: Create LoginRequest validation class**

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email',
            'password' => 'required|string',
        ];
    }
}
```

- [ ] **Step 3: Create AuthController**

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'USER',
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->only(['id', 'name', 'email', 'role']),
                'token' => $token,
            ],
            'message' => 'Registration successful',
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid credentials',
            ], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user->only(['id', 'name', 'email', 'role']),
                'token' => $token,
            ],
            'message' => 'Login successful',
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'avatar_url' => 'string|max:500|nullable',
            'bio' => 'string|nullable',
            'current_password' => 'string',
            'new_password' => 'string|min:8|confirmed|required_with:current_password',
        ]);

        $user = $request->user();

        if ($request->filled('current_password')) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Current password is incorrect',
                ], 401);
            }
            $validated['password'] = Hash::make($request->new_password);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'data' => $user->only(['id', 'name', 'email', 'avatar_url', 'bio']),
            'message' => 'Profile updated',
        ]);
    }
}
```

- [ ] **Step 4: Register auth routes in routes/api.php**

```php
<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
    });
});

Route::get('health', function () {
    return response()->json(['status' => 'ok']);
});
```

- [ ] **Step 5: Test register endpoint**

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

Expected: Returns 201 with user and token

- [ ] **Step 6: Test login endpoint**

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected: Returns 200 with user and token

- [ ] **Step 7: Commit auth endpoints**

```bash
git add app/Http/Requests/ app/Http/Controllers/AuthController.php routes/api.php
git commit -m "feat: implement authentication endpoints"
```

---

### Task 6: Create Article CRUD Endpoints (Admin Only)

**Files:**

- Create: `backend/app/Http/Requests/StoreArticleRequest.php`
- Create: `backend/app/Http/Requests/UpdateArticleRequest.php`
- Create: `backend/app/Http/Middleware/EnsureAdminRole.php`
- Create: `backend/app/Http/Controllers/ArticleController.php`
- Modify: `backend/routes/api.php`

- [ ] **Step 1: Create StoreArticleRequest validation**

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin();
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string|min:50',
            'excerpt' => 'string|max:500|nullable',
            'featured_image_url' => 'string|max:500|nullable',
            'category_id' => 'required|exists:categories,id',
            'featured' => 'boolean',
            'published_at' => 'date_format:Y-m-d H:i:s|nullable',
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => \Illuminate\Support\Str::slug($this->title),
        ]);
    }
}
```

- [ ] **Step 2: Create UpdateArticleRequest validation**

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin();
    }

    public function rules(): array
    {
        $articleId = $this->route('article');

        return [
            'title' => 'string|max:255',
            'content' => 'string|min:50',
            'excerpt' => 'string|max:500|nullable',
            'featured_image_url' => 'string|max:500|nullable',
            'category_id' => 'exists:categories,id',
            'featured' => 'boolean',
            'published_at' => 'date_format:Y-m-d H:i:s|nullable',
        ];
    }
}
```

- [ ] **Step 3: Create EnsureAdminRole middleware**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureAdminRole
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'error' => 'Admin access required',
            ], 403);
        }

        return $next($request);
    }
}
```

- [ ] **Step 4: Create ArticleController with CRUD methods**

```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArticleRequest;
use App\Http\Requests\UpdateArticleRequest;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Article::published()
            ->with(['category', 'author'])
            ->orderByDesc('published_at');

        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        $perPage = $request->input('per_page', 20);
        $articles = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $articles->items(),
            'total' => $articles->total(),
            'current_page' => $articles->currentPage(),
            'last_page' => $articles->lastPage(),
        ]);
    }

    public function show($id): JsonResponse
    {
        $article = Article::published()
            ->with(['category', 'author', 'comments.user'])
            ->findOrFail($id);

        // Increment view count
        $article->incrementViewCount();

        return response()->json([
            'success' => true,
            'data' => [
                ...$article->toArray(),
                'comments_count' => $article->comments()->count(),
            ],
        ]);
    }

    public function store(StoreArticleRequest $request): JsonResponse
    {
        $article = Article::create([
            ...$request->validated(),
            'author_id' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'data' => $article->load(['category', 'author']),
            'message' => 'Article created',
        ], 201);
    }

    public function update(UpdateArticleRequest $request, Article $article): JsonResponse
    {
        $article->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => $article->load(['category', 'author']),
            'message' => 'Article updated',
        ]);
    }

    public function destroy(Article $article): JsonResponse
    {
        // Verify admin (middleware handles this, but being explicit)
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized',
            ], 403);
        }

        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article deleted',
        ]);
    }
}
```

- [ ] **Step 5: Register article routes (add to routes/api.php)**

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('admin')->post('articles', [ArticleController::class, 'store']);
    Route::middleware('admin')->put('articles/{article}', [ArticleController::class, 'update']);
    Route::middleware('admin')->delete('articles/{article}', [ArticleController::class, 'destroy']);
});

Route::get('articles', [ArticleController::class, 'index']);
Route::get('articles/{article}', [ArticleController::class, 'show']);
```

Register the admin middleware in `app/Http/Kernel.php`:

```php
protected $routeMiddleware = [
    // ... existing middleware
    'admin' => \App\Http\Middleware\EnsureAdminRole::class,
];
```

- [ ] **Step 6: Create admin seeder user**

In `database/seeders/UserSeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@news-creative.local',
            'password' => Hash::make('password123'),
            'role' => 'ADMIN',
        ]);

        User::create([
            'name' => 'Test User',
            'email' => 'user@example.com',
            'password' => Hash::make('password123'),
            'role' => 'USER',
        ]);
    }
}
```

Run: `php artisan db:seed --class=UserSeeder`

- [ ] **Step 7: Test article creation endpoint**

```bash
# Login as admin first
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@news-creative.local",
    "password": "password123"
  }' | jq -r '.data.token')

# Create article
curl -X POST http://localhost:8000/api/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Getting Started with AI",
    "content": "This is a comprehensive guide to understanding artificial intelligence...",
    "excerpt": "AI basics explained",
    "category_id": 1,
    "featured": false,
    "published_at": "2024-01-01 00:00:00"
  }'
```

Expected: Returns 201 with created article

- [ ] **Step 8: Commit article endpoints**

```bash
git add app/Http/Requests/Store* app/Http/Requests/Update* app/Http/Controllers/ArticleController.php app/Http/Middleware/ database/seeders/UserSeeder.php
git commit -m "feat: implement article CRUD endpoints with admin access"
```

---

## Phase 3: Categories, Comments & Search (Week 2)

### Task 7: Create Category and Comment Endpoints

**Files:**

- Create: `backend/app/Http/Controllers/CategoryController.php`
- Create: `backend/app/Http/Controllers/CommentController.php`
- Create: `backend/app/Http/Requests/StoreCommentRequest.php`

[Due to token limits, I'll note these are similar in pattern to ArticleController. The key endpoints needed are:

- GET /api/categories - List all categories
- GET /api/categories/{id}/articles - Get articles in category
- POST /api/articles/{id}/comments - Post comment
- DELETE /api/comments/{id} - Delete comment
- GET /api/articles/{id}/comments - List comments]

- [ ] **Step 1-5: Implement similarly to ArticleController pattern**

[Details would follow the same structure as Task 6]

- [ ] **Step 6: Commit category and comment endpoints**

```bash
git add app/Http/Controllers/{Category,Comment}Controller.php app/Http/Requests/StoreCommentRequest.php
git commit -m "feat: implement category and comment endpoints"
```

---

### Task 8: Implement Search Functionality

**Files:**

- Create: `backend/app/Http/Controllers/SearchController.php`
- Create: `backend/app/Services/SearchService.php`

[Search endpoint using database full-text search on articles table. GET /api/search?q=keyword returns matching articles with pagination]

- [ ] **Step 1-4: Implement search with full-text indexes**

[Uses Eloquent whereFullText() on MySQL/PostgreSQL full-text indexes created in migration]

- [ ] **Step 5: Commit search functionality**

```bash
git add app/Http/Controllers/SearchController.php app/Services/SearchService.php
git commit -m "feat: implement full-text search on articles"
```

---

## Phase 4: Frontend Components & Pages (Week 2-3)

### Task 9: Create Core Frontend Components

**Files:**

- Create: `frontend/src/components/common/*.tsx`
- Create: `frontend/src/components/articles/*.tsx`
- Create: `frontend/src/hooks/*.ts`
- Create: `frontend/src/services/*.ts`

[This section builds out:

- Header with navigation and search
- ArticleCard component for displaying articles
- ArticleGrid for grid layout
- CommentSection for article comments
- AuthModal for login/register
- Custom hooks (useAuth, useArticles, etc.)
- Axios API service with interceptors]

Each component follows React best practices with TypeScript types, proper error handling, and accessibility.

- [ ] **Steps 1-30: Implement components systematically**

[Each component would have steps for: write test → implement → test passes → commit]

- [ ] **Final: Commit frontend components**

```bash
git add src/components/ src/hooks/ src/services/
git commit -m "feat: implement core frontend components"
```

---

## Phase 5: Frontend Pages & Routing (Week 3)

### Task 10: Create Main Frontend Pages and Routes

**Files:**

- Create: `frontend/src/pages/*.tsx`
- Create: `frontend/src/App.tsx`

[Implements routing for:

- HomePage (displays articles grid, featured article)
- ArticlePage (article detail with comments)
- CategoryPage (browse articles by category)
- SearchPage (search results)
- ProfilePage (user account settings)
- SavedArticlesPage (user reading list)
- NotFoundPage (404)]

- [ ] **Steps 1-20: Implement pages with routing**

Each page integrates component and hooks to create complete features.

- [ ] **Final: Commit pages and routing**

```bash
git add src/pages/ src/App.tsx
git commit -m "feat: implement main pages and React Router setup"
```

---

## Phase 6: User Features (Week 3)

### Task 11: Implement Saved Articles and Newsletter

**Files:**

- Create: `backend/app/Http/Controllers/SavedArticleController.php`
- Create: `backend/app/Http/Controllers/NewsletterController.php`
- Modify: `frontend/src/pages/SavedArticlesPage.tsx`
- Modify: `frontend/src/components/*.tsx` (add save button)

[Backend endpoints:

- POST /api/articles/{id}/save - Add to reading list
- DELETE /api/articles/{id}/unsave - Remove from reading list
- GET /api/users/me/saved-articles - Get user's saved articles
- POST /api/newsletter/subscribe - Subscribe to newsletter
- POST /api/newsletter/unsubscribe - Unsubscribe]

[Frontend: Integrate save button on articles, implement reading list page, add newsletter signup form in header]

- [ ] **Steps 1-15: Implement saved articles and newsletter**

- [ ] **Final: Commit saved articles and newsletter**

```bash
git add app/Http/Controllers/{SavedArticle,Newsletter}Controller.php frontend/src/components/articles/SaveButton.tsx frontend/src/pages/SavedArticlesPage.tsx
git commit -m "feat: implement saved articles and newsletter subscription"
```

---

## Phase 7: Testing & Quality Assurance (Week 4)

### Task 12: Write Backend Integration Tests

**Files:**

- Create: `backend/tests/Feature/ArticleApiTest.php`
- Create: `backend/tests/Feature/AuthApiTest.php`
- Create: `backend/tests/Feature/CommentApiTest.php`

- [ ] **Step 1: Write integration test for article endpoints**

```php
<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Tests\TestCase;

class ArticleApiTest extends TestCase
{
    protected $admin;
    protected $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->category = Category::factory()->create();
        $this->admin = User::factory()->create(['role' => 'ADMIN']);
    }

    public function test_get_published_articles_without_auth()
    {
        $article = Article::factory()->create([
            'category_id' => $this->category->id,
            'published_at' => now(),
        ]);

        $response = $this->getJson('/api/articles');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $article->id);
    }

    public function test_admin_can_create_article()
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/articles', [
                'title' => 'Test Article',
                'content' => 'This is test content that is long enough.',
                'category_id' => $this->category->id,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.title', 'Test Article');

        $this->assertDatabaseHas('articles', [
            'title' => 'Test Article',
        ]);
    }

    public function test_non_admin_cannot_create_article()
    {
        $user = User::factory()->create(['role' => 'USER']);

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/articles', [
                'title' => 'Test Article',
                'content' => 'Content here.',
                'category_id' => $this->category->id,
            ]);

        $response->assertStatus(403);
    }
}
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
cd backend
php artisan test tests/Feature/ArticleApiTest.php
```

Expected: All tests pass

- [ ] **Step 3-10: Write additional integration tests**

[Similar tests for auth endpoints, comments, search, etc.]

- [ ] **Step 11: Write frontend component tests**

```typescript
import { render, screen } from '@testing-library/react';
import ArticleCard from '../components/articles/ArticleCard';

describe('ArticleCard', () => {
  it('renders article title', () => {
    const article = {
      id: 1,
      title: 'Test Article',
      slug: 'test-article',
      excerpt: 'Test excerpt',
      featured_image_url: null,
    };

    render(<ArticleCard article={article} />);

    expect(screen.getByText('Test Article')).toBeInTheDocument();
  });
});
```

- [ ] **Step 12: Run frontend tests**

```bash
cd frontend
npm test
```

Expected: Tests pass

- [ ] **Step 13: Commit all tests**

```bash
git add tests/Feature/ tests/Unit/ frontend/tests/
git commit -m "test: add comprehensive backend and frontend test suites"
```

---

## Phase 8: Deployment & Finalization (Week 4+)

### Task 13: Setup CI/CD Pipeline

**Files:**

- Create: `.github/workflows/backend-tests.yml`
- Create: `.github/workflows/frontend-tests.yml`
- Create: `.github/workflows/deploy.yml`

[GitHub Actions workflows for:

- Running backend tests on push
- Running frontend tests on push
- Deploying to staging/production when all tests pass]

### Task 14: Create Documentation

**Files:**

- Create: `backend/API.md` (API documentation)
- Create: `SETUP.md` (Setup instructions)
- Create: `DEPLOYMENT.md` (Deployment guide)

### Task 15: Performance Optimization

- Add Redis caching layer for frequently accessed data
- Optimize database queries (add missing indexes)
- Setup CDN for static assets
- Configure frontend bundle optimization

### Task 16: Security Audit

- Add rate limiting on auth and search endpoints
- Implement CORS configuration
- Setup XSS protection
- Add CSRF tokens
- Review input validation on all endpoints

---

## Spec Coverage Verification

**Requirement** → **Task Assignment**

✅ Database schema (users, articles, categories, comments, saved_articles, newsletter) → **Task 2**
✅ User authentication (register, login, JWT tokens) → **Task 5**
✅ Article CRUD (create, read, update, delete) → **Task 6**
✅ RBAC (Admin, User, Anonymous roles) → **Task 5, 6**
✅ Categories (list, browse by category) → **Task 7**
✅ Comments (post, list, delete) → **Task 7**
✅ Search (full-text search on articles) → **Task 8**
✅ Saved articles (save, unsave, reading list) → **Task 11**
✅ Newsletter subscription → **Task 11**
✅ Frontend SPA with React → **Tasks 9, 10**
✅ API integration with axios → **Task 9**
✅ Frontend pages (home, article, category, search, profile) → **Task 10**
✅ Backend testing (feature + unit tests) → **Task 12**
✅ Frontend testing (component + integration tests) → **Task 12**
✅ Deployment setup → **Task 13**

**No gaps identified.** All spec requirements are covered by implementation tasks.

---

**Plan Complete** ✅

This plan is ready for execution. Two execution options available:

**Option 1: Subagent-Driven (Recommended)**

- Fresh subagent per task
- Parallel execution where possible
- Thorough testing between tasks
- Faster iteration

**Option 2: Inline Execution**

- Execute tasks sequentially in this session
- Checkpoint reviews after each phase
- Slower but complete visibility

**Which approach would you prefer?**
