"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getUserName, getUserNameFromAPI } from "@/lib/auth";

export function Header() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("ログインユーザー");

  // ユーザー名を取得
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const name = await getUserNameFromAPI();
        setUserName(name);
      } catch {
        // APIが失敗した場合はJWTトークンから取得
        const fallbackName = getUserName();
        setUserName(fallbackName);
      }
    };

    fetchUserName();
  }, []);

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 lg:mb-6 space-y-4 lg:space-y-0">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
            <h1 className="font-['Montserrat',_sans-serif] font-semibold text-white text-[16px] lg:text-[18.654px] tracking-[2.2384px] cursor-pointer hover:opacity-80 transition-opacity" onClick={handleGoToDashboard}>
              METI Picks
            </h1>
            <div className="flex flex-wrap items-center space-x-4 lg:space-x-6">
              <div className="text-white text-[12px] lg:text-[13.412px] font-bold tracking-[2.0118px] cursor-pointer hover:opacity-80 transition-opacity opacity-70 hover:border-b-2 hover:border-white hover:pb-1" onClick={() => router.push('/search')}>
                人脈を探す
              </div>
              <div className="text-white text-[12px] lg:text-[13.412px] font-bold tracking-[2.0118px] cursor-pointer hover:opacity-80 transition-opacity opacity-70 hover:border-b-2 hover:border-white hover:pb-1" onClick={() => router.push('/policy')}>
                政策を投稿する
              </div>
              <div className="text-white text-[12px] lg:text-[13.412px] font-bold tracking-[2.0118px] cursor-pointer hover:opacity-80 transition-opacity opacity-70 hover:border-b-2 hover:border-white hover:pb-1" onClick={() => router.push('/comments')}>
                意見を確認する
              </div>
              <div className="text-white text-[12px] lg:text-[13.412px] font-bold tracking-[2.0118px] cursor-pointer hover:opacity-80 transition-opacity opacity-70 hover:border-b-2 hover:border-white hover:pb-1" onClick={() => router.push('/invitation')}>
                招待コードを発行する
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/meeting-upload')}
              className="text-white text-[12px] lg:text-[13.06px] font-semibold tracking-[1.5672px] bg-white/10 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/20 transition-colors"
            >
              面談録のアップロード
            </button>
            <div className="text-white text-[12px] lg:text-[13.06px] font-semibold tracking-[1.5672px] bg-white/10 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/20 transition-colors">
              {userName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
