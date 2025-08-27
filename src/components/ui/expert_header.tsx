import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { getUserName, getUserNameFromAPI } from "@/lib/auth";

export const ExpertHeader: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

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
      } finally {
        setIsLoading(false);
        // 滑らかなフェードインのため少し遅延
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    fetchUserName();
  }, []);

  const handleGoToDashboard = () => {
    router.push('/expert/articles');
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-20 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 lg:mb-6 space-y-4 lg:space-y-0">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-8">
            <h1 className="font-['Montserrat',_sans-serif] font-semibold text-white text-[16px] lg:text-[18.654px] tracking-[2.2384px] cursor-pointer hover:opacity-80 transition-opacity" onClick={handleGoToDashboard}>
              METI Picks
            </h1>

          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/invitation')}
              className="text-white text-[12px] lg:text-[13.06px] font-semibold tracking-[1.5672px] bg-white/10 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/20 transition-colors"
            >
              招待コードを発行する
            </button>
            {isLoading ? (
              // スケルトンローディング
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <div className="w-4 h-4 bg-white/20 rounded-full animate-pulse"></div>
                <div className="h-3 bg-white/20 rounded animate-pulse" style={{ width: '60px' }}></div>
              </div>
            ) : (
              // ユーザー名表示（滑らかなフェードイン）
              <div 
                className={`flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 cursor-pointer hover:bg-white/20 transition-all duration-300 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="w-4 h-4 bg-white/30 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-white text-[12px] lg:text-[13.06px] font-semibold tracking-[1.5672px]">
                  {userName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};