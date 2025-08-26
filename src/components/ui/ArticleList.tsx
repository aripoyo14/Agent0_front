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
    <div className="w-full">
      {/* 記事一覧 */}
      <div className="space-y-0">
        {articles.map((article, _index) => (
          <div
            key={article.id}
            onClick={() => onArticleClick(article)}
            className="relative px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200 last:border-b-0"
          >
            {/* メインコンテンツ */}
            <div className="flex items-start gap-8">
              {/* 左側：タイトル、ソース、日付 */}
              <div className="flex-1 min-w-0">
                {/* タイトル */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
                  {article.title}
                </h3>
                
                {/* ソースと日付 */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-medium">{article.department}</span>
                  <span>{article.publishedAt}</span>
                </div>
              </div>
              
              {/* 右側：サマリー */}
              <div className="w-160 text-sm text-gray-600 text-left leading-relaxed line-clamp-3">
                {article.summary}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
