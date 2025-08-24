import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
        className
      )}
      style={{
        width: width || "100%",
        height: height || "1rem",
        backgroundSize: "200% 100%",
        animation: "shimmer 2s infinite",
      }}
    />
  );
}

// コメント用のスケルトンコンポーネント
export function CommentSkeleton() {
  return (
    <div className="bg-white p-4 mb-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <Skeleton className="h-5 mb-2" width="60%" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-3" width="40%" />
            <Skeleton className="h-3 w-1" />
            <Skeleton className="h-3" width="30%" />
          </div>
        </div>
        <Skeleton className="h-8 w-24" />
      </div>
      
      <div className="space-y-2 mb-4">
        <Skeleton className="h-4" width="100%" />
        <Skeleton className="h-4" width="95%" />
        <Skeleton className="h-4" width="85%" />
      </div>
      
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-16" />
        <div className="flex space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}

// 複数のコメントスケルトンを表示するコンポーネント
export function CommentSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
    </div>
  );
}

// 政策投稿履歴用のスケルトンコンポーネント
export function PolicySubmissionSkeleton() {
  return (
    <div className="p-4 cursor-pointer transition-all hover:bg-gray-50">
      <div className="flex justify-between items-start mb-2">
        <Skeleton className="h-4 mb-2" width="80%" />
      </div>
      
      <div className="text-sm text-gray-500 mb-2">
        <Skeleton className="h-3" width="40%" />
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="h-3" width="30%" />
        <Skeleton className="h-3" width="20%" />
      </div>
    </div>
  );
}

// 複数の政策投稿スケルトンを表示するコンポーネント
export function PolicySubmissionSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <PolicySubmissionSkeleton key={index} />
      ))}
    </div>
  );
}
