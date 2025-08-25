import React from 'react';

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
  icon?: string;
  variant?: 'default' | 'profile';
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message = "記事がまだありません",
  subMessage = "選択されたテーマに関連する記事がまだ投稿されていません。他のテーマを選択するか、しばらくお待ちください。",
  icon,
  variant = 'default',
  className = ""
}) => {
  if (variant === 'profile') {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="material-symbols-outlined text-gray-500 text-xl">{icon}</span>
          </div>
          <p className="text-gray-700 text-sm font-bold mb-1">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center py-12 ${className}`}>
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
