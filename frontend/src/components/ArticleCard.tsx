// ArticleCard component
import { Link } from "react-router-dom";
import { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({
  article,
  featured = false,
}: ArticleCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article
      className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {article.featured_image_url && (
        <div className="h-48 overflow-hidden bg-gray-200">
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
            {article.category.name}
          </span>
          {article.featured && (
            <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded-full">
              Featured
            </span>
          )}
        </div>

        <Link to={`/articles/${article.slug}`} className="block group">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition mb-2">
            {article.title}
          </h3>
        </Link>

        {article.excerpt && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>By {article.author.name}</span>
            <span>{formatDate(article.published_at)}</span>
          </div>
          <span>{article.view_count} views</span>
        </div>
      </div>
    </article>
  );
}
