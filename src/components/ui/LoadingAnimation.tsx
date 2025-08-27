"use client";

import { useEffect, useState } from "react";

interface LoadingAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
  duration?: number;
  type?: 'ripple' | 'dots' | 'spinner' | 'wave';
}

export default function LoadingAnimation({ 
  isVisible, 
  onComplete, 
  duration = 1500,
  type = 'ripple'
}: LoadingAnimationProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // 即座にコンテンツを表示
      setShowContent(true);
      
      const timer = setTimeout(() => {
        onComplete?.();
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      // ローディングが終了したら即座にコンテンツを非表示
      setShowContent(false);
    }
  }, [isVisible, duration, onComplete]);

  if (!showContent) return null;

  const renderRippleAnimation = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9]">
      <div className="relative">
        {/* 複数の同心円リップル効果 */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              left: `${-40 - i * 20}px`,
              top: `${-40 - i * 20}px`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.5s'
            }}
          />
        ))}
        
        {/* 中央のアイコン */}
        <div className="relative z-10 w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <div className="w-8 h-8 bg-white rounded-full opacity-80 animate-pulse" />
        </div>
      </div>
      
      {/* ローディングテキスト */}
      <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
        <div className="text-white text-lg font-bold tracking-wide animate-pulse">
          ページを読み込み中...
        </div>
        <div className="flex justify-center mt-4 space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderDotsAnimation = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9]">
      <div className="flex space-x-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 bg-white rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationDuration: '1s'
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-1/3 text-white text-lg font-bold tracking-wide">
        読み込み中...
      </div>
    </div>
  );

  const renderSpinnerAnimation = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-white/70 rounded-full animate-spin animation-reverse" />
      </div>
      <div className="absolute bottom-1/3 text-white text-lg font-bold tracking-wide animate-pulse">
        ページを準備中...
      </div>
    </div>
  );

  const renderWaveAnimation = () => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9]">
      <div className="flex space-x-2 items-end">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2 bg-white rounded-t-lg animate-pulse"
            style={{
              height: `${20 + Math.sin(i) * 10}px`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-1/3 text-white text-lg font-bold tracking-wide">
        データを取得中...
      </div>
    </div>
  );

  const animations = {
    ripple: renderRippleAnimation,
    dots: renderDotsAnimation,
    spinner: renderSpinnerAnimation,
    wave: renderWaveAnimation
  };

  return (
    <div 
      className={`transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        pointerEvents: 'none', // バックグラウンド処理を妨げないように常にnone
        visibility: showContent ? 'visible' : 'hidden'
      }}
    >
      {animations[type]()}
    </div>
  );
}
