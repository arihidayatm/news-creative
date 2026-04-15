import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout, CommentSection, Loading, ErrorMessage } from "@/components";
import apiService from "@/services/api";
import { Article, Comment } from "@/types";

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = !!localStorage.getItem("auth_token");

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const response = await apiService.getArticleBySlug(slug);
        setArticle(response.data);
        setError(null);

        // Fetch comments
        try {
          const commentsRes = await apiService.getArticleComments(
            response.data.id,
          );
          setComments(commentsRes.data.data);
        } catch {
          setComments([]);
        }
      } catch (err) {
        setError("Article not found");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleSaveArticle = async () => {
    if (!article || !isLoggedIn) return;

    try {
      await apiService.saveArticle(article.id);
      alert("Article saved!");
    } catch (error) {
      console.error("Failed to save article:", error);
      alert("Failed to save article");
    }
  };

  const handleCommentAdded = async () => {
    if (!article) return;
    try {
      const res = await apiService.getArticleComments(article.id);
      setComments(res.data.data);
    } catch (error) {
      console.error("Failed to refresh comments:", error);
    }
  };

  if (loading)
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  if (error || !article)
    return (
      <Layout>
        <ErrorMessage message={error || "Article not found"} />
      </Layout>
    );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <article className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-gray-600 dark:text-gray-400">
          <a
            href="/"
            onClick={() => navigate("/")}
            className="hover:text-primary transition"
          >
            Home
          </a>
          {" / "}
          <a
            href={`/categories/${article.category.slug}`}
            onClick={() => navigate(`/categories/${article.category.slug}`)}
            className="hover:text-primary transition"
          >
            {article.category.name}
          </a>
          {" / "}
          <span>{article.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
              {article.category.name}
            </span>
            {article.featured && (
              <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded-full">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-gray-600 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {article.author.name}
                </p>
                <p className="text-sm">{formatDate(article.published_at)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span>{article.view_count} views</span>
              {isLoggedIn && (
                <button
                  onClick={handleSaveArticle}
                  className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featured_image_url && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none mb-12">
          <div
            className="text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Comments */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <CommentSection
            articleId={article.id}
            comments={comments}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      </article>
    </Layout>
  );
}
