"use client";

import { useState, useEffect } from "react";
import { PolicyThemeSelector } from "@/components/ui/policy-theme-selector";
import { NetworkMap } from "@/components/ui/network-map";
import { SearchFilters, NetworkMapResponseDTO, PolicyTheme, FilterOption } from "@/types";
import { Header } from "@/components/ui/header";
import { getToken, getTokenFromCookies } from "@/lib/auth";

interface SearchPageClientProps {
  initialData: {
    policyThemes: PolicyTheme[];
    industryOptions: FilterOption[];
    positionOptions: FilterOption[];
    defaultSearchResult: NetworkMapResponseDTO | null;
  };
}

export function SearchPageClient({ initialData }: SearchPageClientProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: "",
    policyThemes: [],
    industries: [],
    positions: []
  });
  
  const [networkData, setNetworkData] = useState<NetworkMapResponseDTO | null>(
    initialData.defaultSearchResult
  );
  
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 初期データを設定
  useEffect(() => {
    if (initialData.defaultSearchResult) {
      setNetworkData(initialData.defaultSearchResult);
    }
  }, [initialData.defaultSearchResult]);

  const handleFilterChange = (key: keyof SearchFilters, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePolicyThemeToggle = (themeId: string) => {
    setFilters(prev => ({
      ...prev,
      policyThemes: prev.policyThemes.includes(themeId)
        ? prev.policyThemes.filter(id => id !== themeId)
        : [...prev.policyThemes, themeId]
    }));
  };

  const handleClearAll = () => {
    setFilters(prev => ({
      ...prev,
      policyThemes: [],
      searchQuery: ""
    }));
    // クリア時は初期データを表示
    setNetworkData(initialData.defaultSearchResult);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    
    try {
      // 選択された政策テーマ名を取得
      const selectedTitles = initialData.policyThemes
        .filter(t => filters.policyThemes.includes(t.id))
        .map(t => t.title);

      // 検索実行（既存のAPI呼び出しロジックを使用）
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
      const API_BASE_URL = `${API_BASE.replace(/\/$/, "")}/api/search_network_map/match`;

      const payload = {
        policy_tag: selectedTitles,
        free_text: filters.searchQuery,
      };

      // Authorization ヘッダー付与（クライアント側）
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      try {
        const tokenInfo = getToken?.();
        if (tokenInfo && typeof tokenInfo === 'object' && tokenInfo.accessToken) {
          headers['Authorization'] = `Bearer ${tokenInfo.accessToken}`;
        } else {
          const fromCookie = getTokenFromCookies?.();
          if (fromCookie?.accessToken) headers['Authorization'] = `Bearer ${fromCookie.accessToken}`;
        }
      } catch {
        // ignore
      }

      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.warn('network_map/match error:', res.status, text);
        return;
      }

      const data = await res.json();
      setNetworkData(data as NetworkMapResponseDTO);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative flex flex-col overflow-hidden">
      {/* グラデーション背景 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9]" />
      
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

      {/* ヘッダー */}
      <Header />

      {/* メインコンテンツエリア */}
      <div className="relative z-10 flex-1 px-6 lg:px-12 pb-6 pt-32 min-h-0">
        <div className="flex gap-4 h-full min-h-0">
          {/* 絞り込みエリア */}
          <div className="w-1/4 relative flex-shrink-0">
            <h3 className="absolute -top-6 left-0 font-['Noto_Sans_JP'] font-medium text-white text-xs tracking-[0.5px] drop-shadow-md">
              絞り込む
            </h3>
            
            <div className="bg-white rounded-lg p-3 h-full max-h-full overflow-y-auto flex flex-col">
              {/* 政策テーマセレクター */}
              <div className="mb-5 flex-shrink-0">
                <PolicyThemeSelector
                  themes={initialData.policyThemes}
                  selectedThemes={filters.policyThemes}
                  onThemeToggle={handlePolicyThemeToggle}
                  onClearAll={handleClearAll}
                />
              </div>
              
              {/* フリーワード検索 */}
              <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-3">フリーワード検索</label>
                <div className="relative">
                  <div className="absolute left-0 top-0 flex items-start pl-3 pt-3">
                    <span className="material-symbols-outlined text-gray-400" style={{ fontSize: '18px' }}>search</span>
                  </div>
                  <textarea
                    value={filters.searchQuery}
                    onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                    onKeyDown={(e) => (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) && handleSearch()}
                    placeholder="キーワードを入力してください"
                    className="w-full h-24 pl-10 pr-3 py-3 bg-gray-100 rounded border border-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#58aadb] focus:border-transparent transition-colors resize-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="mt-3 inline-flex items-center justify-center px-4 py-2 bg-[#58aadb] text-white rounded text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      検索中...
                    </>
                  ) : (
                    '検索'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 人脈マップエリア */}
          <div className="w-3/4 relative flex-1 min-h-0">
            <h3 className="absolute -top-6 left-0 font-['Noto_Sans_JP'] font-medium text-white text-xs tracking-[0.5px] drop-shadow-md">
              人脈マップ
            </h3>
            
            <div className="bg-black/20 rounded-lg p-2 h-full min-h-0">
              <div className="w-full h-full min-h-0">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#58aadb] mx-auto mb-4"></div>
                      <p className="text-white text-lg mb-2 font-bold">人脈マップを検索中...</p>
                      <p className="text-white text-sm">しばらくお待ちください</p>
                    </div>
                  </div>
                ) : (
                  <NetworkMap filters={filters} backendData={networkData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
