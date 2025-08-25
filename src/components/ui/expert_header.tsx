import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { getUserNameFromAPI, debugToken, testAuth, getUserName } from "@/lib/auth";

export const ExpertHeader: React.FC = () => {
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState<string>("ログインユーザー");

  // ユーザー名を取得
  useEffect(() => {
    const fetchUserName = async () => {
      console.log("🔄 ユーザー名取得開始...");
      
      // デバッグ情報を出力
      await debugToken();
      await testAuth();
      
      try {
        const name = await getUserNameFromAPI();
        setUserName(name);
        console.log("✅ ユーザー名取得成功:", name);
      } catch (error) {
        console.error("❌ ユーザー名取得エラー:", error);
        // フォールバック
        const fallbackName = getUserName();
        setUserName(fallbackName);
        console.log("✔ ユーザー名取得成功:", fallbackName);
      }
    };

    fetchUserName();
  }, []);

  // ドロップダウンメニューを閉じる処理
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (!target.closest('.user-menu-container')) {
      setShowUserMenu(false);
    }
  };

  // クリックイベントリスナーの追加
  useEffect(() => {
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <div className="relative px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[65px] pt-6 pb-4">
      <div className="flex items-center justify-between">
        {/* METI Picksボタン */}
        <button
          onClick={() => router.push('/expert/articles')}
          className="font-['Montserrat:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[18.029px] tracking-wide lg:tracking-[2.1635px] hover:text-blue-200 transition-colors cursor-pointer"
        >
          <p className="adjustLetterSpacing block leading-tight">METI Picks</p>
        </button>
        
        {/* ユーザー情報とメニュー */}
        <div className="flex items-center gap-3">
          <div className="font-['Montserrat:SemiBold',_'Noto_Sans_JP:Bold',_sans-serif] font-semibold text-[#ffffff] text-xs sm:text-sm md:text-base xl:text-[12.62px] text-right tracking-wide lg:tracking-[1.5144px]">
            <p className="adjustLetterSpacing block leading-tight whitespace-pre">{userName}</p>
          </div>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
        
        {/* ユーザーメニュードロップダウン */}
        {showUserMenu && (
          <div className="absolute right-4 sm:right-6 md:right-8 lg:right-16 xl:right-[65px] top-16 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[300px] sm:min-w-[350px] md:min-w-[400px] z-[9999] user-menu-container">
            {/* 矢印 */}
            <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
            
            {/* メニュー項目 */}
            <div className="py-2">
              <div className="px-4 py-2">
                <div className="flex items-center gap-3 mb-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75l-1.5 1.5H6l-1.5-1.5V9.75a6 6 0 0 1 6-6z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">新着通知</span>
                </div>
                
                {/* 通知リスト */}
                <div className="max-h-48 overflow-y-auto space-y-2">
                  <div className="p-2 bg-gray-50 rounded text-xs">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#58aadb] rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900 mb-1">新しい政策案が投稿されました</p>
                        <p className="text-xs text-gray-600">「スタートアップ向け税制優遇措置の拡充」について新しい意見が投稿されました</p>
                        <p className="text-xs text-gray-500 mt-1">2時間前</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-gray-50 rounded text-xs">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-[#58aadb] rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900 mb-1">コメントが追加されました</p>
                        <p className="text-xs text-gray-600">「地方スタートアップ育成ファンドの創設」に新しいコメントが追加されました</p>
                        <p className="text-xs text-gray-500 mt-1">5時間前</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-gray-50 rounded text-xs">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900 mb-1">新しい政策テーマが追加されました</p>
                        <p className="text-xs text-gray-600">「DX-デジタル変革」テーマに新しい記事が追加されました</p>
                        <p className="text-xs text-gray-500 mt-1">1日前</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => {
                  // TODO: プロフィール画面への遷移
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                プロフィール
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => {
                  router.push("/login");
                  setShowUserMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
              >
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                ログアウト
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
