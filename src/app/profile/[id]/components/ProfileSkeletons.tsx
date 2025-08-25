// 洗練されたスケルトンカード（面談記録用）
export const MeetingSkeletonCard = () => (
  <div className="bg-gray-50 border border-gray-200 rounded p-2 animate-pulse">
    <div className="flex items-center justify-between mb-1">
      <div className="h-2 bg-gray-300 rounded w-16"></div>
      <div className="h-2 bg-gray-300 rounded w-24"></div>
    </div>
    <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
    <div className="flex items-center gap-2 mb-1">
      <div className="h-2 bg-gray-300 rounded w-12"></div>
      <div className="h-2 bg-gray-300 rounded w-16"></div>
    </div>
    <div className="h-2 bg-gray-300 rounded w-20 mb-1"></div>
    <div className="space-y-1">
      <div className="h-2 bg-gray-300 rounded w-full"></div>
      <div className="h-2 bg-gray-300 rounded w-4/5"></div>
    </div>
  </div>
);

// 洗練されたスケルトンカード（政策意見用）
export const PolicySkeletonCard = () => (
  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200 animate-pulse">
    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5 flex-shrink-0"></div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-1.5 mb-0.5">
        <div className="h-2 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="h-3 bg-gray-300 rounded w-full mb-1"></div>
      <div className="flex items-center gap-2 mb-1">
        <div className="h-2 bg-gray-300 rounded w-12"></div>
        <div className="h-2 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="space-y-1">
        <div className="h-2 bg-gray-300 rounded w-full"></div>
        <div className="h-2 bg-gray-300 rounded w-4/5"></div>
        <div className="h-2 bg-gray-300 rounded w-3/5"></div>
      </div>
    </div>
  </div>
);

// プロフィールヘッダーのスケルトン
export const ProfileHeaderSkeleton = () => (
  <div className="h-full flex items-center">
    <div className="max-w-full flex items-start justify-between w-full gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <div className="h-5 lg:h-6 bg-white/30 rounded animate-pulse w-24"></div>
          <div className="h-4 lg:h-5 bg-white/30 rounded-full animate-pulse w-16"></div>
        </div>
        <div className="h-3 lg:h-4 bg-white/30 rounded animate-pulse w-48 mb-1"></div>
      </div>
      <div className="flex items-start gap-4 flex-shrink-0">
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-white/30 rounded animate-pulse"></div>
            <div className="h-3 lg:h-4 bg-white/30 rounded animate-pulse w-32"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-white/30 rounded animate-pulse"></div>
            <div className="h-3 lg:h-4 bg-white/30 rounded animate-pulse w-24"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
