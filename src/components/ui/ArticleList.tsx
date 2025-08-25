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
    <div className="w-full p-3 sm:p-4 md:p-5 lg:p-6">
      {/* 記事一覧 */}
      <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
        {articles.map((article, index) => (
          <div
            key={article.id}
            onClick={() => onArticleClick(article)}
            className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200 border border-gray-100 hover:border-gray-200"
          >
            {/* タイトル */}
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
              {article.title}
            </h3>
            
            {/* ソースとタイムスタンプ */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-sm sm:text-base text-gray-600">
              <span className="font-medium">{article.department}</span>
              <span>{article.publishedAt}</span>
            </div>
            
            {/* サマリー */}
            <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">
              {article.summary}
            </p>
            
            {/* コメント数 */}
            <div className="flex justify-end items-center">
              <div className="flex items-center space-x-2 text-gray-500">
                <svg 
                  className="w-4 h-4 sm:w-5 sm:h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                  />
                </svg>
                <span className="text-xs sm:text-sm md:text-base">{article.commentCount}コメント</span>
              </div>
            </div>
            
            {/* 区切り線（最後の記事以外） */}
            {index < articles.length - 1 && (
              <div className="border-t border-gray-200 mt-3 sm:mt-4 pt-3 sm:pt-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
