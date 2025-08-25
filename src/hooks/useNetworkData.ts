import { useState, useEffect, useRef } from 'react';
import { apiFetch } from '@/lib/apiClient';
import { getUserFromToken } from '@/lib/auth';

interface RouteNode {
  id: string;
  type: "user" | "expert";
  name?: string;
}

interface RouteBreakdown {
  ux_score?: number;
  um_score?: number;
  mx_score?: number;
  xz_score?: number;
}

interface RouteItem {
  path: RouteNode[];
  score: number;
  breakdown: RouteBreakdown;
}

interface RoutesResponse {
  routes: RouteItem[];
}

export function useNetworkData(expertId: string) {
  const [data, setData] = useState<RoutesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const user = getUserFromToken();
    if (!expertId || !user?.userId) {
      setData({ routes: [] });
      return;
    }
    
    // 既存のリクエストを中断
    if (abortRef.current) {
      abortRef.current.abort();
    }
    
    // 新しいAbortControllerを作成
    const controller = new AbortController();
    abortRef.current = controller;
    
    setLoading(true);
    setError(null);
    
    (async () => {
      try {
        // リクエストが中断されたかチェック
        if (controller.signal.aborted) {
          return;
        }
        
        const payload = {
          user_id: user.userId,
          expert_id: expertId,
          window_days: 180,
          half_life_days: 90,
          overlap_config_id: 1,
          overlap_coef: 0.4,
          max_results: 5,
        };
        
        const responseData = await apiFetch<RoutesResponse>("/api/network_meti/routes", { 
          method: "POST", 
          body: payload, 
          headers: { "x-cancel": String(Date.now()) }, 
          signal: controller.signal, 
          auth: true 
        });
        
        // リクエストが中断されたかチェック
        if (controller.signal.aborted) {
          return;
        }
        
        setData(responseData);
      } catch (e: unknown) {
        // AbortErrorの場合は状態を更新しない
        if (e instanceof Error && e.name === 'AbortError') {
          return;
        }
        setError(e instanceof Error ? e.message : "取得に失敗しました");
        setData({ routes: [] });
      } finally {
        // リクエストが中断された場合はloading状態を更新しない
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    })();
    
    return () => {
      // クリーンアップ時にAbortControllerを中断
      if (controller && !controller.signal.aborted) {
        controller.abort();
      }
    };
  }, [expertId]);

  return { data, loading, error };
}
