import React from 'react';
import { ExpertPageState } from '@/types';

interface LoadingErrorStatesProps {
  pageState: ExpertPageState;
  errorMessage?: string;
}

export const LoadingErrorStates: React.FC<LoadingErrorStatesProps> = ({ 
  pageState, 
  errorMessage 
}) => {
  
  if (pageState === "loading" || pageState === "idle") {
    console.log("ローディング状態を表示中");
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        {/* シンプルなスピナー */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-6"></div>
        
        <p className="text-gray-600 text-lg font-medium mb-2">政策案一覧を読み込み中...</p>
        <p className="text-gray-500 text-sm">しばらくお待ちください</p>
        
        {/* シンプルなドットアニメーション */}
        <div className="flex space-x-2 mt-4">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        {/* デバッグ情報 */}
        <div className="mt-4 text-xs text-gray-400">
          状態: {pageState}
        </div>
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
        <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                エラーが発生しました
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{errorMessage || "記事の読み込み中にエラーが発生しました。"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// 汎用のLoadingStateコンポーネント
interface LoadingStateProps {
  message?: string;
  icon?: string;
  variant?: 'default' | 'profile';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "読み込み中...",
  icon = "hub",
  variant = 'default',
  className = ""
}) => {
  if (variant === 'profile') {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-gray-500 text-xl">{icon}</span>
          </div>
          <p className="text-gray-700 text-sm font-bold mb-1">{message}</p>
          <div className="flex items-center justify-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center h-full min-h-[400px] ${className}`}>
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-6"></div>
      <p className="text-gray-600 text-lg font-medium mb-2">{message}</p>
      <div className="flex space-x-2 mt-4">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

// 汎用のErrorStateコンポーネント
interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  variant?: 'default' | 'profile';
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message, 
  onRetry,
  variant = 'default',
  className = ""
}) => {
  if (variant === 'profile') {
    return (
      <div className={`h-full flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="material-symbols-outlined text-red-500 text-xl">error</span>
          </div>
          <p className="text-gray-700 text-sm font-bold mb-1">{message}</p>
          {onRetry && (
            <button 
              onClick={onRetry}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              再試行
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center h-full min-h-[400px] ${className}`}>
      <div className="bg-red-50 border border-red-200 rounded-md p-6 max-w-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              エラーが発生しました
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{message}</p>
            </div>
            {onRetry && (
              <button 
                onClick={onRetry}
                className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                再試行
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
