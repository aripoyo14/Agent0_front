"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface DashboardNavigationProps {
  userName: string;
}

export default function DashboardNavigation({ userName }: DashboardNavigationProps) {
  const router = useRouter();

  // useCallbackで関数を安定化
  const handleSearchClick = useCallback(() => {
    console.log('Search clicked');
    router.push('/search');
  }, [router]);

  const handleDashboardClick = useCallback(() => {
    console.log('Dashboard clicked');
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-8 bg-blue-500">
      <h1 className="text-white text-2xl mb-4">Dashboard Navigation</h1>
      
      <button 
        className="bg-red-500 text-white px-4 py-2 rounded mb-2 mr-2"
        onClick={handleDashboardClick}
      >
        ダッシュボード
      </button>
      
      <button 
        className="bg-green-500 text-white px-4 py-2 rounded mb-2"
        onClick={handleSearchClick}
      >
        検索ページへ
      </button>
      
      <div className="text-white mt-4">ユーザー名: {userName}</div>
    </div>
  );
}
