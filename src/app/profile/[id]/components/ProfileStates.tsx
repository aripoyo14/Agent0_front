// プロフィールページ専用状態表示コンポーネント
export const EmptyState = ({ icon, message }: { icon: string; message: string }) => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
        <span className="material-symbols-outlined text-gray-500 text-xl">{icon}</span>
      </div>
      <p className="text-gray-700 text-sm font-bold mb-1">{message}</p>
    </div>
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="h-full flex items-center justify-center">
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

export const LoadingState = ({ message, icon }: { message: string; icon: string }) => (
  <div className="h-full flex items-center justify-center">
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
