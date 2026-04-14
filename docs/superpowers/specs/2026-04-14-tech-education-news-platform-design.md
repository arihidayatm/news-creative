# Tech & Education News Platform - Design Specification

**Date:** April 14, 2026  
**Project:** Modern News Website (Teknologi Modern dan Edukasi)  
**Version:** 1.0  
**Status:** Approved

---

## Executive Summary

### Problem Statement

Users need a centralized, educational platform to discover and discuss modern technology topics across AI, web development, data science, cybersecurity, and educational resources. Current fragmented sources make it difficult to find curated, organized tech content.

### Proposed Solution

Build a **Content-Focused Single Page Application (SPA)** with a React frontend and Laravel REST API backend. The platform enables:

- Content consumption (articles, search, filtering, browsing)
- User engagement (comments, saved articles, newsletters)
- Admin-only content management

### Success Criteria

1. **User Engagement:** Minimum 100 articles launched with 85%+ article discoverability through search/filters
2. **Platform Stability:** 99.5% uptime, <500ms API response time for core endpoints
3. **User Experience:** <2 second homepage load time, 100 Lighthouse accessibility score
4. **Content Quality:** All articles feature author, category, publication date, and related content recommendations
5. **Community:** Support comments on articles with moderation capability and user saved articles system

---

## 1. Architecture & Data Model

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER DEVICES                               │
│                  (Browser / Mobile Web)                          │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTPS (JSON/REST)
                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (SPA)                                │
│        React + TypeScript (Vercel/Netlify Deployment)           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Pages: Homepage, Article Detail, Category, Search       │   │
│  │ Components: ArticleCard, Header, Comments, Auth Modal   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────────┘
                      │ REST API (JWT Auth)
                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (API)                                 │
│      Laravel REST API (DigitalOcean/Cloud Deployment)           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Routes: /api/articles, /api/comments, /api/users, etc    │   │
│  │ Middleware: Auth (JWT), CORS, Rate Limiting              │   │
│  │ Services: AuthService, ArticleService, CommentService    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────────┘
                      │ SQL Queries
                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE                                      │
│                      MySQL (Cloud Managed)                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Tables: Articles, Users, Comments, Categories, etc.      │   │
│  │ Indexes: ON category_id, published_at, created_at        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Role-Based Access Control (RBAC)

**ANONYMOUS (Not Logged In)**

- View published articles
- Browse categories
- Search articles
- Subscribe to newsletter (email only)
- Cannot: Comment, save articles, access user features

**USER (Registered)**

- All anonymous permissions +
- Create/edit own profile
- Post comments on articles
- Save articles to reading list
- Subscribe to newsletter
- Cannot: Publish or edit articles

**ADMIN (You)**

- All user permissions +
- Create, edit, publish, delete articles
- Manage categories & authors
- Moderate/delete comments on any article
- Manage users
- View analytics dashboard
- Access admin panel

### Core Data Model

```sql
-- ARTICLES
CREATE TABLE articles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content LONGTEXT NOT NULL,
  excerpt VARCHAR(500),
  featured_image_url VARCHAR(500),
  category_id BIGINT NOT NULL (FK: categories),
  author_id BIGINT NOT NULL (FK: users with ADMIN role),
  featured BOOLEAN DEFAULT false,
  view_count INT DEFAULT 0,
  published_at TIMESTAMP NULL,
  updated_at TIMESTAMP,
  created_at TIMESTAMP
);
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);

-- USERS
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  bio TEXT,
  role ENUM('ADMIN', 'USER') DEFAULT 'USER',
  newsletter_subscribed BOOLEAN DEFAULT true,
  updated_at TIMESTAMP,
  created_at TIMESTAMP
);

-- CATEGORIES
CREATE TABLE categories (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  updated_at TIMESTAMP,
  created_at TIMESTAMP
);

-- COMMENTS (Auto-published, no moderation)
CREATE TABLE comments (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  article_id BIGINT NOT NULL (FK: articles),
  user_id BIGINT NOT NULL (FK: users),
  content TEXT NOT NULL,
  updated_at TIMESTAMP,
  created_at TIMESTAMP
);
CREATE INDEX idx_comments_article_id ON comments(article_id);

-- SAVED ARTICLES (Many-to-many: Users ↔ Articles)
CREATE TABLE saved_articles (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL (FK: users),
  article_id BIGINT NOT NULL (FK: articles),
  created_at TIMESTAMP,
  UNIQUE(user_id, article_id)
);

-- NEWSLETTER SUBSCRIPTIONS (Email-only, no user account required)
CREATE TABLE newsletter_subscriptions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP
);
```

---

## 2. Frontend Design & Pages

### Page Structure

**1. Homepage (`/`)**

- Featured article hero (large image, headline, excerpt, read button)
- "Latest Articles" section (grid/card layout, 12-20 articles, paginated)
- Category sidebar (clickable filter links)
- Search bar in header
- Newsletter signup CTA
- Footer with links and copyright

**2. Article Detail Page (`/articles/:slug`)**

- Article header: Title, author, category, publish date
- Featured image (full width)
- Rich HTML content (rendered safely)
- Related articles sidebar (3-4 from same category)
- Comments section (sorted by newest first)
- Comment form (logged-in users only)
- Save to reading list button (heart icon, logged-in only)
- Social share buttons (optional)

**3. Category/Browse Page (`/category/:slug`)**

- Category header with description
- Article list/grid with filters
- Sort options: Newest, Popular (most viewed), Trending (recent + views)
- Pagination (20 articles per page)
- Back to homepage link

**4. Search Results Page (`/search?q=...`)**

- Search query display ("Results for: 'AI learning'")
- Article cards matching query
- Pagination
- Optional: Faceted filters by category, date range

**5. User Account Pages (Authenticated Only)**

- `/profile` - Edit name, avatar, bio, change password
- `/saved-articles` - Reading list (saved articles grid)
- `/settings` - Newsletter preferences, account deletion

### Reusable Components

| Component        | Purpose                     | Props                          |
| ---------------- | --------------------------- | ------------------------------ |
| `ArticleCard`    | Display article preview     | article, onClick               |
| `ArticleGrid`    | Responsive grid layout      | articles, columns, gap         |
| `Header`         | Navigation & search         | onSearch, currentUser          |
| `CommentSection` | Display & post comments     | articleId, comments, onComment |
| `AuthModal`      | Login/signup form           | isOpen, onClose, onSuccess     |
| `CategoryFilter` | Filter articles by category | categories, selected, onChange |
| `Footer`         | Footer with links           | -                              |

### Design System

- **Aesthetic:** Modern & professional (clean, spacious layout)
- **Colors:** Professional palette (navy, white, gray accents)
- **Typography:** Clear hierarchy (headings, body text, metadata)
- **Responsiveness:** Mobile-first approach (works on all screen sizes)
- **Accessibility:** WCAG 2.1 AA compliance, keyboard navigation, alt text

---

## 3. Backend API Specification

### Authentication Endpoints

```
POST /api/auth/register
  Body: { email, password, name }
  Response: { user: { id, email, name, role }, token }
  Status: 201 Created

POST /api/auth/login
  Body: { email, password }
  Response: { user: { id, email, name, role }, token }
  Status: 200 OK

POST /api/auth/logout
  Auth: Required (JWT)
  Response: { message: "Logged out" }
  Status: 200 OK

GET /api/users/me
  Auth: Required (JWT)
  Response: { id, email, name, avatar_url, bio, role, newsletter_subscribed }
  Status: 200 OK

PUT /api/users/me
  Auth: Required (JWT)
  Body: { name, avatar_url, bio, current_password, new_password }
  Response: { user: {...} }
  Status: 200 OK
```

### Article Endpoints

```
GET /api/articles?page=1&per_page=20&category=AI&sort=newest
  Response: { data: [article...], total, pages, current_page }
  Status: 200 OK

GET /api/articles/:id
  Response: { id, title, slug, content, category, author, comments_count, view_count, ... }
  Status: 200 OK
  Side Effect: Increment view_count

POST /api/articles
  Auth: Required (ADMIN only)
  Body: { title, content, category_id, featured_image_url, featured, published_at }
  Response: { article: {...} }
  Status: 201 Created

PUT /api/articles/:id
  Auth: Required (ADMIN only)
  Body: { title, content, category_id, featured_image_url, featured, published_at }
  Response: { article: {...} }
  Status: 200 OK

DELETE /api/articles/:id
  Auth: Required (ADMIN only)
  Response: { message: "Deleted" }
  Status: 200 OK
```

### Category Endpoints

```
GET /api/categories
  Response: { data: [{ id, name, slug, description }...] }
  Status: 200 OK

GET /api/categories/:id/articles?page=1&per_page=20
  Response: { data: [article...], total, pages }
  Status: 200 OK
```

### Comment Endpoints

```
GET /api/articles/:id/comments?page=1&per_page=50
  Response: { data: [comment...], total, pages }
  Status: 200 OK

POST /api/articles/:id/comments
  Auth: Required (USER or ADMIN)
  Body: { content }
  Response: { comment: { id, user_id, content, created_at } }
  Status: 201 Created

DELETE /api/comments/:id
  Auth: Required (own comment or ADMIN)
  Response: { message: "Deleted" }
  Status: 200 OK
```

### Saved Articles Endpoints

```
POST /api/articles/:id/save
  Auth: Required (USER or ADMIN)
  Response: { message: "Saved" }
  Status: 201 Created

DELETE /api/articles/:id/unsave
  Auth: Required
  Response: { message: "Removed" }
  Status: 200 OK

GET /api/users/me/saved-articles?page=1&per_page=20
  Auth: Required
  Response: { data: [article...], total, pages }
  Status: 200 OK
```

### Search Endpoint

```
GET /api/search?q=machine%20learning&category=AI&per_page=20
  Response: { data: [article...], total, query, category_filter }
  Status: 200 OK
  Note: Full-text search on title, excerpt, content
```

### Newsletter Endpoints

```
POST /api/newsletter/subscribe
  Body: { email }
  Response: { message: "Subscribed" }
  Status: 201 Created

POST /api/newsletter/unsubscribe
  Body: { email }
  Response: { message: "Unsubscribed" }
  Status: 200 OK
```

### Admin Analytics Endpoint

```
GET /api/admin/analytics
  Auth: Required (ADMIN only)
  Response: {
    total_articles, total_users, total_comments,
    articles_this_month, new_users_this_month,
    total_views, views_this_week
  }
  Status: 200 OK
```

### Standard Response Format

**Success:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed"
}
```

**Error:**

```json
{
  "success": false,
  "error": "Validation error",
  "code": "VALIDATION_ERROR",
  "status": 400,
  "details": { "email": ["Invalid email format"] }
}
```

### HTTP Status Codes

- `200 OK` - Successful GET/PUT/DELETE
- `201 Created` - Successful POST (resource created)
- `400 Bad Request` - Validation errors
- `401 Unauthorized` - Missing/invalid authentication
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate email, etc.
- `422 Unprocessable Entity` - Semantic validation errors
- `500 Internal Server Error` - Server errors

---

## 4. Authentication & Security

### JWT Authentication Flow

1. User registers/logs in with email & password
2. Backend validates credentials
3. Backend generates JWT token (payload: user_id, role, exp: now + 7 days)
4. Token sent to frontend in httpOnly cookie (secure, sameSite=Strict)
5. Frontend includes token in Authorization header for protected requests
6. Backend validates token on every protected route
7. Expired token: Frontend redirects to login
8. Logout clears cookie

### Security Implementation

| Layer             | Measure                                                |
| ----------------- | ------------------------------------------------------ |
| **Password**      | Bcrypt hashing (cost=12), minimum 8 characters         |
| **Transport**     | HTTPS only, no HTTP fallback                           |
| **Tokens**        | JWT with 7-day expiration, httpOnly cookies            |
| **CORS**          | Frontend domain only, credentials included             |
| **Input**         | Validation on all endpoints (email, length, type)      |
| **HTML**          | XSS protection (escape user content, sanitize HTML)    |
| **SQL**           | Parameterized queries (Laravel ORM prevents injection) |
| **Rate Limiting** | 5 failed logins / 5 min → 15 min lockout               |
| **Rate Limiting** | 100 requests / min on search/API by IP                 |
| **Admin Routes**  | Validated on every request (role check)                |

### Validation Rules

| Field           | Rules                                        |
| --------------- | -------------------------------------------- |
| Email           | Valid format, unique in DB, max 255 chars    |
| Password        | Min 8 chars, at least 1 uppercase + 1 number |
| Article Title   | Required, max 255 chars, unique slug         |
| Article Content | Required, min 50 chars, HTML sanitized       |
| Comment Content | Required, min 2 chars, max 5000 chars        |
| Category Name   | Required, unique, max 100 chars              |

---

## 5. Error Handling & Data Validation

### Frontend Error Handling

- Form validation before submission (email format, required fields)
- Real-time feedback (error message below field)
- Toast notifications for API errors (timeout 5 seconds)
- Graceful degradation (optional features fail silently)
- Network error retry logic (3 attempts with exponential backoff)

### Backend Error Handling

- Input validation middleware (catches malformed JSON, missing fields)
- Try-catch in route handlers with error logging
- Consistent error response format (see API section)
- Database errors logged to file (never exposed to frontend)
- 5xx errors: Generic "Server error" message to user, detailed log for admin

### Specific Error Codes

| Code               | HTTP | Meaning                  | Action                 |
| ------------------ | ---- | ------------------------ | ---------------------- |
| `VALIDATION_ERROR` | 400  | Invalid input            | Show field errors      |
| `UNAUTHORIZED`     | 401  | Not logged in            | Redirect to login      |
| `FORBIDDEN`        | 403  | Insufficient permissions | Show permission error  |
| `NOT_FOUND`        | 404  | Resource missing         | Show 404 page          |
| `DUPLICATE_EMAIL`  | 409  | Email already registered | Suggest login          |
| `RATE_LIMITED`     | 429  | Too many requests        | Show "Try again later" |
| `SERVER_ERROR`     | 500  | Internal error           | Show generic message   |

---

## 6. Testing Strategy

### Backend Tests (PHPUnit)

**Unit Tests:**

- Article model (slug generation, view counting)
- User model (password hashing, role checking)
- Comment model (creation, validation)
- Validation rules (email format, password strength)

**Integration Tests:**

- Article CRUD endpoints (create, read, update, delete)
- Authentication flow (register, login, logout)
- Comment posting and deletion
- Saved articles workflow
- Search functionality
- Role-based access (user can't delete other comments, admin can)

**Test Database:** SQLite in-memory for speed

### Frontend Tests (Vitest + React Testing Library)

**Unit Tests:**

- ArticleCard component (renders title, author, date)
- CategoryFilter component (selection/deselection)
- AuthModal component (form validation, submission)

**Integration Tests:**

- Homepage loads articles and categories
- Article detail page fetches and displays article
- Search form submits and displays results
- Comment section loads and posts comments
- Login flow (register → login → view saved articles)
- Save article flow (click save → appears in reading list)

**E2E Tests (Cypress):**

- User signup → login → view article → save → view saved articles
- Search for article → click result → comment on article
- Click category → filter articles → pagination works

### Test Coverage Goals

- Backend: ≥80% line coverage
- Frontend: ≥70% coverage (focus on critical paths)
- All API endpoints have integration tests
- All user flows have E2E tests

---

## 7. Deployment & Infrastructure

### Frontend Deployment

**Platform:** Vercel or Netlify

- Automatic deployment on git push to main branch
- Build command: `npm run build`
- Output: Static files (HTML, CSS, JS, images)
- Environment variables: `REACT_APP_API_URL`, `REACT_APP_ENV`
- CDN: Global edge network (fast delivery worldwide)
- SSL: Automatic HTTPS, included free
- Build time: ~2 minutes

### Backend Deployment

**Platform:** DigitalOcean, Heroku, AWS, or similar

- Manual or GitHub Actions deployment
- Requires: PHP 8.3+, MySQL, Redis (optional)
- Build steps: `composer install`, `php artisan migrate`, `php artisan cache:clear`
- Environment variables: Database credentials, JWT secret, email service config
- Health check: `/health` endpoint returns 200 OK
- Auto-scaling: Optional (load balancer + multiple servers)
- Backups: Automated daily database backups

### Development Environment

**Frontend:**

```bash
npm install
npm run dev           # Start local server (port 3000)
npm run build         # Production build
npm run test          # Run tests
```

**Backend:**

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed  # Setup DB with dummy data
php artisan serve                 # Start server (port 8000)
php artisan test                  # Run all tests
```

**Database (Local):**

- Option 1: Local MySQL installation
- Option 2: Docker: `docker-compose up -d mysql` (includes env vars)

### Environment Variables

**Frontend (.env.local):**

```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

**Backend (.env):**

```
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=news_creative
DB_USERNAME=root
DB_PASSWORD=passwordku
JWT_SECRET=<random-secret>
MAIL_MAILER=log
MAIL_FROM_ADDRESS=noreply@creativetechdigital.com
```

---

## 8. Performance & Scalability

### Frontend Optimization

- **Code Splitting:** Lazy load pages (HomePage, ArticleDetail, etc.)
- **Image Optimization:** Compress featured images, use next-gen formats (WebP)
- **Caching:** Browser cache (30 days for static assets)
- **Minification:** CSS, JS bundled and minified by build tool
- **Target Metrics:** <2s homepage load, <3s article detail, Core Web Vitals green

### Backend Optimization

- **Database Indexing:**
  - `articles.category_id, articles.published_at` (for browsing)
  - `comments.article_id` (for loading comments)
  - `saved_articles.user_id` (for reading list)
- **Pagination:** Always paginate lists (never fetch all 1000+ articles at once)
- **Pagination Defaults:** 20 articles/page, 50 comments/page
- **Caching:** Redis cache for categories (1 hour), featured articles (30 min)
- **API Response Time Target:** <500ms for core endpoints (p95)

### Scalability for Growth

**Current Scale:** 100K articles, 10K users, 100K comments
**If traffic grows 10x:**

- Add Redis caching layer (reduces DB queries)
- Add CDN for image delivery (takes load off origin server)
- Horizontal scaling: Load balancer + multiple Laravel servers
- Read replicas: Separate database for read-heavy queries
- Queue system: Move email/newsletter sends to background jobs

### Database Query Optimization

- Use eager loading (include related data in single query, not N+1)
- Avoid selecting all columns (specify needed fields)
- Use pagination (not LIMIT without OFFSET)
- Monitor slow queries (log queries >500ms)

---

## 9. Project Timeline & Phases

### Phase 1: Core Foundation (Week 1-2)

**Goal:** Build essential infrastructure

**Backend:**

- [ ] Database schema (articles, users, comments, categories)
- [ ] User authentication (register, login, JWT)
- [ ] Article CRUD endpoints (admin only)
- [ ] Category endpoints
- [ ] Database seeding (10-15 test articles)

**Frontend:**

- [ ] Project setup (React + TypeScript + routing)
- [ ] Page structure (HomePage, ArticleDetail, Layout)
- [ ] ArticleCard component
- [ ] Basic styling and responsive layout
- [ ] API integration (fetch articles, display)
- [ ] Authentication flow (login/register modal)

**Testing:**

- [ ] Database migrations tested
- [ ] Auth endpoints tested (register, login)
- [ ] Article endpoints tested (GET, POST, PUT)
- [ ] Homepage and article detail pages load correctly

### Phase 2: User Features (Week 3)

**Goal:** Enable user interactions

**Backend:**

- [ ] Comments endpoints (create, delete, list)
- [ ] Saved articles endpoints (save, unsave, list)
- [ ] Search functionality (full-text search)
- [ ] Newsletter subscription endpoints

**Frontend:**

- [ ] Category browse page
- [ ] Search results page and search form integration
- [ ] Comments section (display + post)
- [ ] Save article button and reading list page
- [ ] Newsletter signup form

**Testing:**

- [ ] Comment CRUD endpoints tested
- [ ] Saved articles workflow tested (save → view in list → unsave)
- [ ] Search endpoint tested with various queries
- [ ] Comments section component tested

### Phase 3: Polish & Deployment (Week 4+)

**Goal:** Production-ready launch

**Backend:**

- [ ] Admin analytics endpoint
- [ ] Rate limiting on auth/search
- [ ] Input validation on all endpoints
- [ ] Email notifications (for comments, newsletter)
- [ ] Error handling and logging
- [ ] API documentation (OpenAPI/Swagger optional)

**Frontend:**

- [ ] User profile page (edit, settings)
- [ ] Admin dashboard
- [ ] Dark mode toggle (optional)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance optimization (images, code splitting)
- [ ] SEO (meta tags, sitemap, robots.txt)

**Testing & DevOps:**

- [ ] Full integration tests (critical user flows)
- [ ] E2E tests (Cypress or Playwright)
- [ ] Load testing (ensure scalability)
- [ ] Security audit (XSS, CSRF, SQL injection)
- [ ] Setup CI/CD (GitHub Actions)
- [ ] Setup staging environment
- [ ] Production deployment

### Success Criteria by Phase

**Phase 1 Complete When:**

- ✅ Core API endpoints working (articles, auth)
- ✅ Homepage displays articles, article detail page loads
- ✅ Login/register flow works
- ✅ 90%+ backend test coverage

**Phase 2 Complete When:**

- ✅ Comments, saved articles, search fully functional
- ✅ Category browsing and search pages work
- ✅ 80%+ frontend component coverage

**Phase 3 Complete When:**

- ✅ Admin panel complete
- ✅ All endpoints have input validation
- ✅ <2s homepage load, <500ms API response
- ✅ 100 Lighthouse accessibility score
- ✅ Live in production with SSL

---

## 10. Non-Goals (Out of Scope)

These features are NOT planned for initial launch:

- ❌ User notifications (in-app or email)
- ❌ Article recommendations algorithm (AI/ML)
- ❌ Real-time notifications (WebSockets)
- ❌ Social media integration (login with Google/GitHub)
- ❌ Advanced analytics dashboard (heatmaps, funnel tracking)
- ❌ Multi-language support (i18n)
- ❌ User messaging/DMs
- ❌ Article voting/rating system
- ❌ Mobile app (web-only initially)
- ❌ API rate limiting per user (IP-based only)

These can be added in v2.0 based on user feedback.

---

## 11. Risk Assessment

| Risk                        | Impact | Probability | Mitigation                                                    |
| --------------------------- | ------ | ----------- | ------------------------------------------------------------- |
| Database migration issues   | High   | Medium      | Use Laravel migrations, test locally first                    |
| JWT token expiration bugs   | Medium | Medium      | Thorough token testing, clear error messages                  |
| Search performance degrades | Medium | Medium      | Database indexing, pagination, caching                        |
| User authentication bypass  | High   | Low         | Security audit, input validation, rate limiting               |
| Deployment failure          | High   | Low         | Staging environment, automated testing, rollback plan         |
| Comment spam                | Medium | Medium      | Rate limiting on comment endpoint, admin moderation option v2 |

---

## 12. Success Metrics & KPIs

- **Content:** ≥100 articles published at launch, ≥5 articles/week cadence
- **Users:** ≥500 registered users in first month
- **Engagement:** ≥5% comment rate, ≥20% save rate (articles saved / articles viewed)
- **Performance:** <2s homepage load, <500ms API response (p95)
- **Reliability:** 99.5% uptime, <0.1% error rate
- **Quality:** 100 Lighthouse accessibility, ≥80% test coverage

---

## Appendix: Technology Stack

| Layer              | Technology                     | Purpose                              |
| ------------------ | ------------------------------ | ------------------------------------ |
| **Frontend**       | React 18 + TypeScript          | UI components, state management      |
| **Frontend Build** | Vite                           | Fast build tool, HMR                 |
| **Styling**        | Tailwind CSS                   | Utility-first CSS, responsive design |
| **HTTP Client**    | Axios                          | API requests, interceptors           |
| **Routing**        | React Router v6                | Page navigation, URL routing         |
| **State**          | TanStack Query (React Query)   | Server state caching, sync           |
| **Forms**          | React Hook Form                | Form validation, submission          |
| **Testing (FE)**   | Vitest + React Testing Library | Unit & integration tests             |
| **Backend**        | Laravel 13                     | REST API, ORM, migrations            |
| **Database**       | MySQL                          | Relational data, full-text search    |
| **Auth**           | JWT (Laravel Sanctum)          | Stateless authentication             |
| **Caching**        | Redis (optional)               | Reduce database queries              |
| **Email**          | Laravel Mail (SMTP/Mailgun)    | Newsletter, notifications            |
| **Testing (BE)**   | PHPUnit                        | Unit & integration tests             |
| **Documentation**  | OpenAPI/Swagger (optional)     | API documentation                    |
| **DevOps**         | GitHub Actions                 | CI/CD pipeline                       |
| **CDN**            | Cloudflare (optional)          | Image optimization, DDoS protection  |

---

**END OF SPECIFICATION**

Version 1.0 | April 14, 2026 | Status: Approved for Development
