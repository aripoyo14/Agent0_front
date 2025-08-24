"use client";

import { useEffect, useState } from 'react';
import PerformanceMonitor from './PerformanceMonitor';

export default function PerformanceMonitorWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 開発環境でのみ表示
  if (process.env.NODE_ENV !== 'development' || !mounted) {
    return null;
  }

  return <PerformanceMonitor />;
}
