import React from 'react';

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "記事がまだありません",
  subMessage = "選択されたテーマに関連する記事がまだ投稿されていません。他のテーマを選択するか、しばらくお待ちください。"
}) => {
  return (
    <div className="text-center py-12">
      {/* メインテキスト */}
      <h3 className="text-lg font-semibold text-[#58aadb] mb-2">
        {message}
      </h3>
      
      {/* サブテキスト */}
      <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
        {subMessage}
      </p>
      
      {/* 装飾的な要素 */}
      <div className="mt-6 flex justify-center">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
