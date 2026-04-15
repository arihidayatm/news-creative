// CategoryList component
import { Link } from "react-router-dom";
import { Category } from "@/types";

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/categories/${category.slug}`}
          className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-primary hover:shadow-md transition bg-gray-50 dark:bg-gray-900"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {category.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {category.articles_count || 0} articles
          </p>
        </Link>
      ))}
    </div>
  );
}
