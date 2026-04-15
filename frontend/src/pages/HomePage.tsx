import { useEffect, useState } from "react";
import {
  Layout,
  ArticleCard,
  CategoryList,
  Loading,
  ErrorMessage,
  EmptyState,
} from "@/components";
import apiService from "@/services/api";
import { Article, Category } from "@/types";

export default function HomePage() {
  const [featured, setFeatured] = useState<Article[]>([]);
  const [recent, setRecent] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [featuredRes, recentRes, categoriesRes] = await Promise.all([
          apiService.getFeaturedArticles(),
          apiService.getArticles(1, 6),
          apiService.getCategories(),
        ]);
        setFeatured(featuredRes.data);
        setRecent(recentRes.data.data);
        setCategories(categoriesRes.data);
        setError(null);
      } catch (err) {
        setError("Failed to load articles");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <Layout>
        <Loading />
      </Layout>
    );

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Teknologi Modern dan Edukasi
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Jelajahi berita teknologi terkini, tutorial pembelajaran, dan
            insights mendalam tentang dunia digital modern.
          </p>
        </section>

        {error && <ErrorMessage message={error} />}

        {/* Featured Articles */}
        {featured.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((article) => (
                <ArticleCard key={article.id} article={article} featured />
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Categories</h2>
            <CategoryList categories={categories} />
          </section>
        )}

        {/* Recent Articles */}
        {recent.length > 0 ? (
          <section className="space-y-6">
            <h2 className="text-3xl font-bold">Recent Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        ) : (
          <EmptyState message="No articles found" />
        )}
      </div>
    </Layout>
  );
}
