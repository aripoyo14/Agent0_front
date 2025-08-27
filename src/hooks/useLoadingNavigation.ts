"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UseLoadingNavigationOptions {
  loadingDuration?: number;
  animationType?: 'ripple' | 'dots' | 'spinner' | 'wave';
}

export function useLoadingNavigation(options: UseLoadingNavigationOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAnimationType, setLoadingAnimationType] = useState<'ripple' | 'dots' | 'spinner' | 'wave'>(
    options.animationType || 'spinner'
  );
  const router = useRouter();

  // よく使われるページを事前読み込み（初回のみ）
  useEffect(() => {
    const prefetchPages = async () => {
      try {
        await Promise.all([
          router.prefetch('/search'),
          router.prefetch('/policy'),
          router.prefetch('/comments'),
          router.prefetch('/invitation'),
          router.prefetch('/meeting-upload')
        ]);
      } catch (error) {
        // prefetchエラーは無視（ネットワーク接続などの問題）
        console.log('Page prefetch completed with some errors:', error);
      }
    };

    // 少し遅延を入れて初期ページ読み込み後に実行
    const timer = setTimeout(prefetchPages, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  const navigateWithLoading = useCallback((
    path: string, 
    customAnimationType?: 'ripple' | 'dots' | 'spinner' | 'wave'
  ) => {
    if (isLoading) return; // 既にローディング中の場合は何もしない

    // アニメーションタイプを設定
    if (customAnimationType) {
      setLoadingAnimationType(customAnimationType);
    }

    // ローディング状態を即座に開始
    setIsLoading(true);

    // 即座に事前読み込み開始（ローディング表示と並行）
    console.log(`Starting prefetch for ${path}...`);
    router.prefetch(path);

    const loadingDuration = options.loadingDuration || 1500;
    
    // ローディング完了時にナビゲーション実行（ダッシュボードが表示されないように）
    setTimeout(() => {
      console.log(`Executing navigation to ${path}...`);
      router.push(path);
      
      // ナビゲーション後、ページが完全に読み込まれるまで少し待ってからローディング終了
      setTimeout(() => {
        console.log(`Loading complete for ${path}`);
        setIsLoading(false);
      }, 500); // ページ遷移後500ms待機
    }, loadingDuration);
  }, [isLoading, router, options.loadingDuration]);

  // 特定のページ用のナビゲーション関数
  const navigateToSearch = useCallback(() => {
    // 人脈を探すページのみ特別処理（実際の読み込み完了まで待機）
    if (isLoading) return;
    
    setLoadingAnimationType('spinner');
    setIsLoading(true);

    // 即座に事前読み込み開始（ローディング表示と並行）
    console.log('Starting prefetch for /search...');
    router.prefetch('/search');
    
    // 人脈を探すページのローディング時間を短縮
    const loadingDuration = 3500; // 2.5秒に短縮
    
    // より早いタイミングでナビゲーション実行
    const navigationDelay = 50; // 2秒後にナビゲーション開始
    
    setTimeout(() => {
      console.log('Executing navigation to /search...');
      router.push('/search');
    }, navigationDelay);
    
    // ローディング終了のタイミング調整
    setTimeout(() => {
      console.log('Loading complete for /search');
      setIsLoading(false);
    }, loadingDuration + 600); // ナビゲーション後さらに600ms待機
    
  }, [isLoading, router, setLoadingAnimationType, setIsLoading]);

  const navigateToPolicy = useCallback(() => {
    navigateWithLoading('/policy', 'spinner');
  }, [navigateWithLoading]);

  const navigateToComments = useCallback(() => {
    navigateWithLoading('/comments', 'spinner');
  }, [navigateWithLoading]);

  const navigateToInvitation = useCallback(() => {
    navigateWithLoading('/invitation', 'spinner');
  }, [navigateWithLoading]);

  const navigateToMeetingUpload = useCallback(() => {
    navigateWithLoading('/meeting-upload', 'spinner');
  }, [navigateWithLoading]);

  const navigateToDashboard = useCallback(() => {
    // ダッシュボードページは短いローディング時間
    if (isLoading) return;
    
    setLoadingAnimationType('spinner');
    setIsLoading(true);

    // ダッシュボードページを事前読み込み
    console.log('Starting prefetch for /dashboard...');
    router.prefetch('/dashboard');
    
    // 短いローディング時間（0.8秒）
    const loadingDuration = 800;
    const navigationDelay = 500; // 0.5秒後にナビゲーション開始
    
    setTimeout(() => {
      console.log('Executing navigation to /dashboard...');
      router.push('/dashboard');
    }, navigationDelay);
    
    // ローディング終了
    setTimeout(() => {
      console.log('Loading complete for /dashboard');
      setIsLoading(false);
    }, loadingDuration + 200); // ナビゲーション後200ms待機
    
  }, [isLoading, router, setLoadingAnimationType, setIsLoading]);

  return {
    isLoading,
    loadingAnimationType,
    navigateWithLoading,
    navigateToSearch,
    navigateToPolicy,
    navigateToComments,
    navigateToInvitation,
    navigateToMeetingUpload,
    navigateToDashboard,
  };
}
