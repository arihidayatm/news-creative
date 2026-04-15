import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "@/components/Header";

describe("Header Component", () => {
  const renderHeader = () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );
  };

  it("renders navigation links", () => {
    renderHeader();

    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
  });

  it("renders logo/home link", () => {
    renderHeader();

    const homeLink = screen.getByRole("link");
    expect(homeLink).toBeInTheDocument();
  });

  it("renders search form", () => {
    renderHeader();

    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  it("has sticky positioning classes", () => {
    const { container } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    const header = container.querySelector("header");
    expect(header).toHaveClass("sticky", "top-0");
  });
});
