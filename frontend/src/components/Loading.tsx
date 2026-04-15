// Loading component

export function Loading() {
  return (
    <div className="flex justify-center items-center min-h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
      {message}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 dark:text-gray-400 text-lg">{message}</p>
    </div>
  );
}
