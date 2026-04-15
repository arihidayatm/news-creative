import React, { useState } from "react";
import { Comment } from "@/types";
import apiService from "@/services/api";

interface CommentSectionProps {
  articleId: number;
  comments: Comment[];
  onCommentAdded?: () => void;
}

export default function CommentSection({
  articleId,
  comments,
  onCommentAdded,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = !!localStorage.getItem("auth_token");

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isLoggedIn) return;

    setIsLoading(true);
    try {
      await apiService.createComment(articleId, newComment);
      setNewComment("");
      onCommentAdded?.();
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Comments ({comments.length})</h3>

      {/* Comment Form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tulis komentar Anda..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white resize-none"
          />
          <button
            type="submit"
            disabled={isLoading || !newComment.trim()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          Silakan login untuk mengomentari artikel ini.
        </p>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            Belum ada komentar.
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {comment.user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
