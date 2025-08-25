import { useState, useEffect, useCallback } from 'react';
import { ExpertInsightsOut } from "@/types";
import { apiFetch } from "@/lib/apiClient";

interface UseProfilePageReturn {
  insights: ExpertInsightsOut | null;
  loading: boolean;
  error: string | null;
  showHeader: boolean;
  showMeetings: boolean;
  showPolicies: boolean;
  showNetwork: boolean;
  handleRetry: () => void;
}

export const useProfilePage = (expertId: string, networkLoading: boolean): UseProfilePageReturn => {
  // プロフィールデータ取得
  const [insights, setInsights] = useState<ExpertInsightsOut | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // スタガードアニメーション制御
  const [showHeader, setShowHeader] = useState(false);
  const [showMeetings, setShowMeetings] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);

  // プロフィールデータ取得
  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<ExpertInsightsOut>(`/api/experts/${expertId}/insights`, { 
        method: 'GET',
        auth: true 
      });
      setInsights(data);
    } catch (e: unknown) {
      console.error('Profile data fetch error:', e);
      setError(e instanceof Error ? e.message : 'データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [expertId]);

  useEffect(() => {
    if (expertId) {
      fetchProfileData();
    }
  }, [expertId, fetchProfileData]);

  // スタガードアニメーション制御
  useEffect(() => {
    if (!loading && !networkLoading) {
      const headerTimer = setTimeout(() => setShowHeader(true), 0);
      const meetingsTimer = setTimeout(() => setShowMeetings(true), 100);
      const policiesTimer = setTimeout(() => setShowPolicies(true), 200);
      const networkTimer = setTimeout(() => setShowNetwork(true), 300);

      return () => {
        clearTimeout(headerTimer);
        clearTimeout(meetingsTimer);
        clearTimeout(policiesTimer);
        clearTimeout(networkTimer);
      };
    } else {
      setShowHeader(false);
      setShowMeetings(false);
      setShowPolicies(false);
      setShowNetwork(false);
    }
  }, [loading, networkLoading]);

  const handleRetry = useCallback(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return {
    insights,
    loading,
    error,
    showHeader,
    showMeetings,
    showPolicies,
    showNetwork,
    handleRetry
  };
};
