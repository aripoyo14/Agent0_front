import React, { memo } from 'react';

interface EmptyStateProps {
  activeTab: string;
}

export const EmptyState = memo<EmptyStateProps>(({ activeTab }) => {
  const getTitle = () => {
    switch (activeTab) {
      case "all":
        return "まだコメントがありません";
      case "unfb":
        return "未対応のコメントはありません";
      case "fb":
        return "対応済みのコメントはありません";
      default:
        return "コメントがありません";
    }
  };

  const getDescription = () => {
    switch (activeTab) {
      case "all":
        return "この政策に対するコメントがまだ投稿されていません。";
      case "unfb":
        return "すべてのコメントが対応済みです。";
      case "fb":
        return "まだ対応していないコメントはありません。";
      default:
        return "コメントがありません。";
    }
  };

  return (
    <div className="text-center py-12 animate-fade-in-up">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {getTitle()}
          </h3>
          <p className="text-gray-500 text-sm">
            {getDescription()}
          </p>
        </div>
      </div>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
