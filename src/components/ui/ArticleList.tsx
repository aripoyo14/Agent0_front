import React from 'react';
import { ExpertArticle } from './ArticleOverlay';

interface ArticleListProps {
  articles: ExpertArticle[];
  onArticleClick: (article: ExpertArticle) => void;
}

export const ArticleList: React.FC<ArticleListProps> = ({ 
  articles, 
  onArticleClick 
}) => {
  return (
    <div className="w-full h-full">
      {/* 記事一覧 - レスポンシブ対応 + スクロール */}
      <div className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar mobile-hide-scrollbar touch-scroll smooth-scroll">
        <div className="space-y-0 pb-4 sm:pb-6 md:pb-8">
          {articles.map((article, _index) => (
            <div
              key={article.id}
              onClick={() => onArticleClick(article)}
              className="relative px-3 sm:px-4 md:px-6 py-3 sm:py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200 last:border-b-0"
            >
              {/* メインコンテンツ - レスポンシブレイアウト */}
              <div className="flex flex-col lg:flex-row lg:items-start gap-3 lg:gap-8">
                {/* 上部/左側：タイトル、ソース、日付、コメント数 */}
                <div className="flex-1 min-w-0">
                  {/* タイトル */}
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2 pr-2">
                    {article.title}
                  </h3>
                  
                  {/* ソースと日付とコメント数 - レスポンシブ対応 */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                    {/* 上段：ソースと日付 */}
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-wrap sm:flex-nowrap">
                      <span className="font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px] flex-shrink-0">
                        {article.department}
                      </span>
                      <span className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
                        {article.publishedAt}
                      </span>
                    </div>
                    
                    {/* 下段/右側：コメント数 */}
                    <div className="flex items-center gap-1 text-gray-500">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-xs font-medium">
                        {article.commentCount}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* 下部/右側：サマリー - レスポンシブ対応 */}
                <div className="lg:w-160 lg:flex-shrink-0 text-sm text-gray-600 leading-relaxed line-clamp-2 lg:line-clamp-3">
                  {article.summary}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
