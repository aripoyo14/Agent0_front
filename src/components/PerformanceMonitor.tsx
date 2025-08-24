"use client";

import { usePerformance } from '@/hooks/usePerformance';
import { useEffect, useState } from 'react';

export default function PerformanceMonitor() {
  const { startTime, hydrationTime } = usePerformance();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (process.env.NODE_ENV !== 'development' || !mounted) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 bg-black/80 text-white p-3 rounded text-xs z-50">
      <div>🚀 パフォーマンス監視</div>
      <div>開始時間: {startTime}</div>
      <div>ハイドレーション: {hydrationTime ? `${hydrationTime - startTime}ms` : '進行中...'}</div>
    </div>
  );
}
