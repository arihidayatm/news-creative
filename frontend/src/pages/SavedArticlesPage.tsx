import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  ArticleCard,
  Pagination,
  Loading,
  ErrorMessage,
  EmptyState,
} from "@/components";
import apiService from "@/services/api";
import { Article } from "@/types";

export default function SavedArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchSavedArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiService.getSavedArticles(currentPage, 6);
        setArticles(res.data.data);
        setTotalPages(res.data.last_page);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to fetch saved articles",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSavedArticles();
  }, [currentPage, navigate]);

  const pageArticles = articles;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">Saved Articles</h1>

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loading />
        ) : pageArticles.length === 0 ? (
          <EmptyState message="You haven't saved any articles yet" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {pageArticles.map((article: Article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                lastPage={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
