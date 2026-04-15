import axios, { AxiosInstance } from "axios";
import { Article, Category, Comment, User, PaginatedResponse } from "@/types";

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:8000/api";

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Add token to requests if available
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ===== ARTICLES =====
  getArticles(page = 1, perPage = 20, category?: string) {
    return this.client.get<PaginatedResponse<Article>>("/articles", {
      params: { page, per_page: perPage, category },
    });
  }

  getArticleBySlug(slug: string) {
    return this.client.get<Article>(`/articles/${slug}`);
  }

  searchArticles(query: string, perPage = 20) {
    return this.client.get<PaginatedResponse<Article>>("/articles/search", {
      params: { q: query, per_page: perPage },
    });
  }

  getFeaturedArticles() {
    return this.client.get<Article[]>("/articles/featured");
  }

  createArticle(data: any) {
    return this.client.post<Article>("/articles", data);
  }

  updateArticle(id: number, data: any) {
    return this.client.put<Article>(`/articles/${id}`, data);
  }

  deleteArticle(id: number) {
    return this.client.delete(`/articles/${id}`);
  }

  // ===== CATEGORIES =====
  getCategories() {
    return this.client.get<Category[]>("/categories");
  }

  getCategoryBySlug(slug: string) {
    return this.client.get<Category>(`/categories/${slug}`);
  }

  getArticlesByCategory(categoryId: number, page = 1, perPage = 20) {
    return this.client.get<PaginatedResponse<Article>>(
      `/categories/${categoryId}/articles`,
      { params: { page, per_page: perPage } },
    );
  }

  // ===== COMMENTS =====
  getArticleComments(articleId: number, page = 1, perPage = 50) {
    return this.client.get<PaginatedResponse<Comment>>(
      `/articles/${articleId}/comments`,
      { params: { page, per_page: perPage } },
    );
  }

  createComment(articleId: number, content: string) {
    return this.client.post<Comment>(`/articles/${articleId}/comments`, {
      content,
    });
  }

  deleteComment(commentId: number) {
    return this.client.delete(`/comments/${commentId}`);
  }

  // ===== SAVED ARTICLES =====
  getSavedArticles(page = 1, perPage = 20) {
    return this.client.get<PaginatedResponse<Article>>(
      "/users/me/saved-articles",
      { params: { page, per_page: perPage } },
    );
  }

  saveArticle(articleId: number) {
    return this.client.post("/users/me/save-article", {
      article_id: articleId,
    });
  }

  removeSavedArticle(articleId: number) {
    return this.client.delete(`/users/me/saved-articles/${articleId}`);
  }

  // ===== AUTHENTICATION =====
  register(name: string, email: string, password: string) {
    return this.client.post<any>("/auth/register", {
      name,
      email,
      password,
      password_confirmation: password,
    });
  }

  login(email: string, password: string) {
    return this.client.post<any>("/auth/login", { email, password });
  }

  logout() {
    return this.client.post("/auth/logout");
  }

  getCurrentUser() {
    return this.client.get<{ user: User }>("/auth/me");
  }

  updateProfile(data: any) {
    return this.client.put<{ user: User }>("/users/me", data);
  }

  // ===== NEWSLETTER =====
  subscribeNewsletter(email: string) {
    return this.client.post("/newsletter/subscribe", { email });
  }

  unsubscribeNewsletter(email: string) {
    return this.client.post("/newsletter/unsubscribe", { email });
  }
}

export default new ApiService();
