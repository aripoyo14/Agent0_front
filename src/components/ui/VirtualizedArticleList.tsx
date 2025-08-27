import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { ExpertArticle } from '@/types';

interface VirtualizedArticleListProps {
  articles: ExpertArticle[];
  onArticleClick: (article: ExpertArticle) => void;
  height?: number;
  itemHeight?: number;
  className?: string;
}

interface ArticleRowProps {
  index: number;
  style: React.CSSProperties;
  data: {
    articles: ExpertArticle[];
    onArticleClick: (article: ExpertArticle) => void;
  };
}

// 各記事行のコンポーネント
const ArticleRow: React.FC<ArticleRowProps> = ({ index, style, data }) => {
  const { articles, onArticleClick } = data;
  const article = articles[index];

  if (!article) {
    return (
      <div style={style} className="flex items-center justify-center p-4">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div style={style}>
      <div
        onClick={() => onArticleClick(article)}
        className="relative px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-b border-gray-200"
      >
        {/* メインコンテンツ */}
        <div className="flex items-start gap-8">
          {/* 左側：タイトル、ソース、日付 */}
          <div className="flex-1 min-w-0">
            {/* タイトル */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
              {article.title}
            </h3>
            
            {/* ソースと日付とコメント数 */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">{article.department}</span>
              <span>{article.publishedAt}</span>
              {/* コメント数表示 */}
              <div className="flex items-center gap-1 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-xs font-medium">
                  {article.commentCount === 0 ? (
                    <span className="text-gray-400">取得中...</span>
                  ) : (
                    article.commentCount
                  )}
                </span>
              </div>
            </div>
          </div>
          
          {/* 右側：サマリー */}
          <div className="w-160 text-sm text-gray-600 text-left leading-relaxed line-clamp-3">
            {article.summary}
          </div>
        </div>
      </div>
    </div>
  );
};

export const VirtualizedArticleList: React.FC<VirtualizedArticleListProps> = ({
  articles,
  onArticleClick,
  height = 450,
  itemHeight = 120,
  className = ""
}) => {
  // データを最適化してメモ化
  const itemData = useMemo(() => ({
    articles,
    onArticleClick
  }), [articles, onArticleClick]);

  if (articles.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center text-gray-500">
          <p className="text-lg font-medium">記事が見つかりません</p>
          <p className="text-sm mt-1">検索条件を変更してください</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <List
        width="100%"
        height={height}
        itemCount={articles.length}
        itemSize={itemHeight}
        itemData={itemData}
        overscanCount={5} // パフォーマンス向上のため事前レンダリング
      >
        {ArticleRow}
      </List>
    </div>
  );
};

// 通常版（非仮想化）ArticleListとの切り替え用HOC
export const AdaptiveArticleList: React.FC<VirtualizedArticleListProps & {
  useVirtualization?: boolean;
  fallbackComponent?: React.ComponentType<{
    articles: ExpertArticle[];
    onArticleClick: (article: ExpertArticle) => void;
  }>;
}> = ({
  articles,
  onArticleClick,
  useVirtualization = false,
  fallbackComponent: FallbackComponent,
  ...props
}) => {
  // 記事数が多い場合は自動的に仮想化を有効にする
  const shouldUseVirtualization = useVirtualization || articles.length > 50;

  if (shouldUseVirtualization) {
    return (
      <VirtualizedArticleList
        articles={articles}
        onArticleClick={onArticleClick}
        {...props}
      />
    );
  }

  // 仮想化を使わない場合は従来のコンポーネントを使用
  if (FallbackComponent) {
    return <FallbackComponent articles={articles} onArticleClick={onArticleClick} />;
  }

  // デフォルトの非仮想化実装
  return (
    <div className="w-full">
      <div className="space-y-0">
        {articles.map((article, index) => (
          <ArticleRow
            key={article.id}
            index={index}
            style={{}}
            data={{ articles, onArticleClick }}
          />
        ))}
      </div>
    </div>
  );
};
