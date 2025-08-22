"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation"; // Commented out to fix unused variable error
import { PolicyThemeSelector } from "@/components/ui/policy-theme-selector";
import { NetworkMap } from "@/components/ui/network-map";
import { policyThemes } from "@/data/search-data";
import { SearchFilters, NetworkMapResponseDTO } from "@/types";
import { Header } from "@/components/ui/header";

export function SearchPage() {
  // const router = useRouter(); // Commented out to fix unused variable error
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: "",
    policyThemes: [],
    industries: [],
    positions: []
  });
  const [networkData, setNetworkData] = useState<NetworkMapResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 環境変数はベースURL（例: http://localhost:8000）を想定。未設定時はローカルを既定
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const API_BASE_URL = `${API_BASE.replace(/\/$/, "")}/api/search_network_map/match`;

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
    setNetworkData(null); // 人脈マップもリセット
  };

  const handleSearch = async () => {
    setIsLoading(true);
    // バックエンドへ政策テーマ（文字ID）と自由記述をPOST
    const selectedTitles = policyThemes
      .filter(t => filters.policyThemes.includes(t.id))
      .map(t => t.title);

    const payload = {
      // バックエンド要件: 表示名（日本語）を送る
      policy_tag: selectedTitles,
      free_text: filters.searchQuery,
    } as const;

    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // バックエンドが未対応の場合でもUIが壊れないよう防御
      if (!res.ok) {
        const text = await res.text();
        console.warn('network_map/match error:', res.status, text);
        return;
      }
      const data = await res.json();
      console.log('network_map response:', data);
      setNetworkData(data as NetworkMapResponseDTO);
    } catch (err) {
      console.warn('network_map/match request failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full relative flex flex-col overflow-hidden">
      {/* グラデーション背景 - /dashboardと同じ */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9]" />
      
      {/* テクスチャ効果 - /dashboardと同じ */}
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

      {/* 統一されたヘッダー */}
      <Header />

      {/* メインコンテンツエリア */}
      <div className="relative z-10 flex-1 px-6 lg:px-12 pb-6 pt-32 min-h-0">


        {/* メインコンテンツエリア */}
        <div className="flex gap-4 h-full min-h-0">
          {/* 絞り込みエリア - 1:3の比率で1の部分 */}
          <div className="w-1/4 relative flex-shrink-0">
            {/* タイトルをカード外に配置 */}
            <h3 className="absolute -top-6 left-0 font-['Noto_Sans_JP'] font-medium text-white text-xs tracking-[0.5px] drop-shadow-md">
              絞り込む
            </h3>
            
            <div className="bg-white rounded-lg p-3 h-full max-h-full overflow-y-auto flex flex-col">
              {/* 政策テーマセレクター */}
              <div className="mb-5 flex-shrink-0">
                <PolicyThemeSelector
                  themes={policyThemes}
                  selectedThemes={filters.policyThemes}
                  onThemeToggle={handlePolicyThemeToggle}
                  onClearAll={handleClearAll}
                />
              </div>
              {/* フリーワード検索（下部に検索ボタンを配置） */}
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

          {/* 人脈マップエリア - 1:3の比率で3の部分 */}
          <div className="w-3/4 relative flex-1 min-h-0">
            {/* タイトルをカード外に配置 */}
            <h3 className="absolute -top-6 left-0 font-['Noto_Sans_JP'] font-medium text-white text-xs tracking-[0.5px] drop-shadow-md">
              人脈マップ
            </h3>
            
            <div className="bg-black/20 rounded-lg p-2 h-full min-h-0">
              {/* 人脈マップの表示エリア */}
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
