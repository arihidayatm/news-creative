import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiService.searchArticles(query);
        setResults(res.data.data || res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Search failed");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query });
      setCurrentPage(1);
    }
  };

  const pageResults = results.slice((currentPage - 1) * 6, currentPage * 6);
  const pagesCount = Math.ceil(results.length / 6);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-12">
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
        </form>

        {error && <ErrorMessage message={error} />}

        {loading ? (
          <Loading />
        ) : results.length === 0 ? (
          <EmptyState
            message={query ? "No articles found" : "Enter a search query"}
          />
        ) : (
          <>
            <div className="mb-6 text-gray-600 dark:text-gray-400">
              Found {results.length} result{results.length !== 1 ? "s" : ""} for
              "{query}"
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {pageResults.map((article: Article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {pagesCount > 1 && (
              <Pagination
                currentPage={currentPage}
                lastPage={pagesCount}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
