"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import InvitationCodeForm from "@/components/blocks/InvitationCodeForm";
import BackgroundEllipses from "@/components/blocks/BackgroundEllipses";

export default function InvitationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ページロード完了をシミュレート
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // ローディング画面
  if (isLoading) {
    return (
      <main className="relative min-h-screen w-full bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9] overflow-hidden flex items-center justify-center">
        {/* テクスチャ効果 */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <filter id="noiseFilter">
                <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="4" stitchTiles="stitch"/>
              </filter>
              <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
            </svg>
          `)}")`
        }}></div>
        
        <div className="flex flex-col items-center justify-center text-center">
          {/* モダンなスピナー */}
          <div className="relative flex items-center justify-center">
            {/* 外側のリング */}
            <div className="w-20 h-20 border-4 border-white/20 rounded-full animate-spin flex items-center justify-center">
              <div className="w-full h-full border-t-4 border-white rounded-full"></div>
            </div>
            {/* 中央のドット */}
            <div className="absolute w-4 h-4 bg-white rounded-full animate-pulse"></div>
          </div>
          
          {/* ローディングテキスト */}
          <div className="mt-8 flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-bold text-white animate-pulse">読み込み中</h2>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // メインコンテンツ
  return (
    <main className="relative min-h-screen w-full bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9] overflow-hidden">
      {/* テクスチャ効果 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="4" stitchTiles="stitch"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
          </svg>
        `)}")`
      }}></div>
      
      <div className="animate-fade-in">
        <BackgroundEllipses scale={0.8} />
      </div>
      
      <div className="relative min-h-screen px-4 py-8 animate-slide-up">
        {/* 戻るリンク */}
        <div className="absolute top-8 left-8 z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200 group"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="transform group-hover:-translate-x-1 transition-transform duration-200"
            >
              <polyline points="15,18 9,12 15,6"/>
            </svg>
            <span className="text-sm font-medium">戻る</span>
          </button>
        </div>
        
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in-delay-1">招待コード発行完了</h1>
            <p className="text-white/80 animate-fade-in-delay-2">
              招待コードが正常に発行されました
            </p>
          </div>
          
          <div className="animate-fade-in-delay-3">
            <InvitationCodeForm />
          </div>
        </div>
      </div>
      
      {/* カスタムアニメーションスタイル */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in-delay-1 {
          opacity: 0;
          animation: fade-in 0.6s ease-out 0.2s forwards;
        }
        
        .animate-fade-in-delay-2 {
          opacity: 0;
          animation: fade-in 0.6s ease-out 0.4s forwards;
        }
        
        .animate-fade-in-delay-3 {
          opacity: 0;
          animation: fade-in 0.6s ease-out 0.6s forwards;
        }
      `}</style>
    </main>
  );
}
