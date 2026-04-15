// Pagination component

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  lastPage,
  onPageChange,
}: PaginationProps) {
  if (lastPage <= 1) return null;

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);
  const visiblePages = pages.filter(
    (page) =>
      page === 1 ||
      page === lastPage ||
      (page >= currentPage - 1 && page <= currentPage + 1),
  );

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        ← Previous
      </button>

      <div className="flex gap-1">
        {visiblePages.map((page, idx) => {
          const prevPage = visiblePages[idx - 1];
          const gap = prevPage && page - prevPage > 1;

          return (
            <div key={page} className="flex items-center gap-1">
              {gap && <span className="text-gray-500">...</span>}
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 rounded-lg transition ${
                  page === currentPage
                    ? "bg-primary text-white"
                    : "border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {page}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        Next →
      </button>
    </div>
  );
}
