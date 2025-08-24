"use client";

import { useEffect, useRef, useState } from 'react';

export function usePerformance() {
  const startTime = useRef<number>(0);
  const hydrationTime = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // クライアントサイドでのみ開始時間を設定
    if (!mounted) {
      startTime.current = Date.now();
      setMounted(true);
    }
    
    // ハイドレーション完了時間を記録
    hydrationTime.current = Date.now();
    
    // パフォーマンス指標をログ出力
    if (startTime.current > 0) {
      const totalTime = hydrationTime.current - startTime.current;
      console.log(`🚀 パフォーマンス測定結果:`);
      console.log(`- 初期表示時間: ${totalTime}ms`);
      console.log(`- ハイドレーション完了: ${hydrationTime.current}`);
      
      // より詳細なパフォーマンス指標
      if (typeof window !== 'undefined' && 'performance' in window) {
        const perfEntries = performance.getEntriesByType('navigation');
        if (perfEntries.length > 0) {
          const navEntry = perfEntries[0] as PerformanceNavigationTiming;
          console.log(`- DOMContentLoaded: ${navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart}ms`);
          console.log(`- Load: ${navEntry.loadEventEnd - navEntry.loadEventStart}ms`);
        }
      }
    }
  }, [mounted]);

  return {
    startTime: startTime.current,
    hydrationTime: hydrationTime.current,
  };
}
