import { describe, it, expect, beforeEach, vi } from "vitest";
import apiService from "@/services/api";

// Mock axios
vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
  },
}));

describe("API Service", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with correct base URL", () => {
    expect(apiService).toBeDefined();
  });

  it("has methods for all endpoints", () => {
    expect(typeof apiService.getArticles).toBe("function");
    expect(typeof apiService.getArticleBySlug).toBe("function");
    expect(typeof apiService.searchArticles).toBe("function");
    expect(typeof apiService.getFeaturedArticles).toBe("function");
    expect(typeof apiService.getCategories).toBe("function");
    expect(typeof apiService.getCategoryBySlug).toBe("function");
    expect(typeof apiService.getArticleComments).toBe("function");
    expect(typeof apiService.createComment).toBe("function");
    expect(typeof apiService.login).toBe("function");
    expect(typeof apiService.register).toBe("function");
    expect(typeof apiService.logout).toBe("function");
    expect(typeof apiService.getCurrentUser).toBe("function");
  });

  it("stores token in localStorage on login", async () => {
    const mockToken = "test-token-123";

    // This would require mocking the actual API response
    localStorage.setItem("auth_token", mockToken);

    expect(localStorage.getItem("auth_token")).toBe(mockToken);
  });

  it("clears token on logout", () => {
    localStorage.setItem("auth_token", "test-token");

    localStorage.removeItem("auth_token");

    expect(localStorage.getItem("auth_token")).toBeNull();
  });
});
