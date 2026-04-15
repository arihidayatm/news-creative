// User types
export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  role: "ADMIN" | "USER" | "ANONYMOUS";
  newsletter_subscribed: boolean;
  created_at: string;
  updated_at: string;
}

// Article types
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  category: Category;
  author: User;
  featured: boolean;
  published_at: string;
  view_count: number;
  comments_count?: number;
  created_at: string;
  updated_at: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  articles_count?: number;
  created_at: string;
  updated_at: string;
}

// Comment types
export interface Comment {
  id: number;
  article_id: number;
  user: User;
  content: string;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
}

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
