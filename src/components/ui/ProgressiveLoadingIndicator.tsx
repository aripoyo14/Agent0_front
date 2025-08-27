import React from 'react';

interface ProgressiveLoadingIndicatorProps {
  progress: number; // 0-100
  isLoading: boolean;
  totalItems: number;
  loadedItems: number;
  className?: string;
}

export const ProgressiveLoadingIndicator: React.FC<ProgressiveLoadingIndicatorProps> = ({
  progress,
  isLoading,
  totalItems,
  loadedItems,
  className = ""
}) => {
  if (!isLoading && progress >= 100) {
    return null; // 完了時は非表示
  }

  return (
    <div className={`bg-white border-b border-gray-200 px-4 py-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {/* ローディングアニメーション */}
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
            
            {/* 進行状況テキスト */}
            <span className="text-gray-600">
              {progress < 10 ? (
                "記事を読み込み中..."
              ) : progress < 100 ? (
                `コメント数を取得中... (${loadedItems}/${totalItems})`
              ) : (
                "読み込み完了"
              )}
            </span>
          </div>
        </div>
        
        {/* 進行率 */}
        <span className="text-gray-500 text-xs">
          {Math.round(progress)}%
        </span>
      </div>
      
      {/* プログレスバー */}
      <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
        <div 
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// 簡易版プログレスインジケーター
export const SimpleProgressIndicator: React.FC<{
  isLoading: boolean;
  message?: string;
}> = ({ isLoading, message = "読み込み中..." }) => {
  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center py-2 text-sm text-gray-600">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
      {message}
    </div>
  );
};
