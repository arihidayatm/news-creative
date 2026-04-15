import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }

    const fetchCategory = async () => {
      setLoading(true);
      setError(null);

      try {
        const categoryRes = await apiService.getCategoryBySlug(slug);
        setCategoryName(categoryRes.data.name);

        const articlesRes = await apiService.getArticlesByCategory(
          categoryRes.data.id,
          currentPage,
          6,
        );
        setArticles(articlesRes.data.data);
        setLastPage(articlesRes.data.last_page);
      } catch (err: any) {
        setError(err.response?.data?.message || "Category not found");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug, currentPage, navigate]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loading />
        ) : articles.length === 0 ? (
          <EmptyState message="No articles in this category" />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {articles.map((article: Article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {lastPage > 1 && (
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
