import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ArticleCard from "@/components/ArticleCard";
import { Article } from "@/types";

describe("ArticleCard Component", () => {
  const mockArticle: Article = {
    id: 1,
    title: "Test Article",
    slug: "test-article",
    excerpt: "This is a test article excerpt",
    content: "Full article content",
    featured_image_url: null,
    category: {
      id: 1,
      name: "Technology",
      slug: "technology",
      description: "Tech articles",
      articles_count: 5,
    },
    author: {
      id: 1,
      name: "John Doe",
      avatar_url: null,
      bio: "Author bio",
    },
    featured: false,
    published_at: "2026-04-15T10:00:00Z",
    view_count: 10,
    comments_count: 2,
  };

  it("renders article title", () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Test Article")).toBeInTheDocument();
  });

  it("renders article excerpt", () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>,
    );

    expect(screen.getByText(/test article excerpt/i)).toBeInTheDocument();
  });

  it("renders category name", () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Technology")).toBeInTheDocument();
  });

  it("renders author name", () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("creates link to article detail page", () => {
    render(
      <BrowserRouter>
        <ArticleCard article={mockArticle} />
      </BrowserRouter>,
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/articles/test-article");
  });

  it("shows featured badge for featured articles", () => {
    const featuredArticle = { ...mockArticle, featured: true };

    const { container } = render(
      <BrowserRouter>
        <ArticleCard article={featuredArticle} />
      </BrowserRouter>,
    );

    // Check for featured indicator (could be text or class)
    expect(container.textContent).toMatch(/featured/i);
  });
});
