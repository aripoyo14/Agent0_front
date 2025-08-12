"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilterSelect } from "@/components/ui/filter-select";
import { PolicyThemeSelector } from "@/components/ui/policy-theme-selector";
import { NetworkMap } from "@/components/ui/network-map";
import { 
  policyThemes, 
  industryOptions, 
  positionOptions 
} from "@/data/search-data";
import { SearchFilters } from "@/types";

const imgBackground = "http://localhost:3845/assets/5f80ec7391fa506958e021a0a123f517aa20c66f.svg";

export function SearchPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: "",
    policyThemes: [],
    industries: [],
    positions: []
  });

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

  const handleSearch = () => {
    // 検索実行ロジック（現在は状態更新のみ）
    console.log("検索実行:", filters);
  };

  const handleGoToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="h-screen w-full relative flex flex-col overflow-hidden">
      {/* グラデーション背景 */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#b4d9d6] to-[#58aadb]" />
      
      {/* 背景装飾 */}
      <div className="absolute flex h-[400px] items-center justify-center left-[-400px] mix-blend-screen top-[-50px] w-[400px]">
        <div className="flex-none rotate-[298deg]">
          <div className="h-[300px] relative w-[300px]">
            <img
              alt=""
              className="block max-w-none size-full"
              src={imgBackground}
            />
          </div>
        </div>
      </div>

      {/* ヘッダー部分 - 画面の1/4 */}
      <div className="relative z-10 h-1/4 flex flex-col justify-center px-6 lg:px-12">
        {/* 小さなヘッダー */}
        <div className="mb-4">
          <h1 
            className="font-['Montserrat',_sans-serif] font-semibold text-white text-[18px] tracking-[2.16px] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleGoToDashboard}
          >
            METI Picks
          </h1>
        </div>

        {/* レクタングル1と政策テーマ（同じ高さで横並び、背景カード無し） */}
        <div className="flex items-start gap-10">
          {/* キャッチコピー枠（1）- 白タブ＋外枠レクタングル */}
          <div className="w-[250.7px] h-[70.36px] relative shrink-0">
            {/* 白いPolicyタブ（上側） */}
            <div className="absolute top-0 left-0 w-[50px] h-[25px] bg-white rounded-tl-[8.414px] rounded-tr-[8.414px] flex items-center justify-center z-10">
              <span className="font-['Montserrat',_sans-serif] font-semibold text-[7px] tracking-[0.42px]" style={{ color: "#007aff" }}>Search</span>
            </div>
            {/* 外枠レクタングル（下側）- 左上角のみラウンドなし */}
            <div className="absolute top-[25px] left-0 right-0 bottom-0 rounded-tr-[8.414px] rounded-br-[8.414px] rounded-bl-[8.414px] border border-white" />
            {/* テキスト（外枠レクタングル内） */}
            <div className="absolute left-[40px] top-[35px]">
              <span className="font-['Noto_Sans_JP'] font-bold text-white text-[10.62px] tracking-[1.893px]">人流の可視化でつながる</span>
            </div>
          </div>


        </div>
      </div>

      {/* メインコンテンツエリア - 画面の3/4 */}
      <div className="relative z-10 h-3/4 px-6 lg:px-12 pb-6">
        <div className="flex gap-4 h-full">
          {/* 絞り込みエリア - 1:3の比率で1の部分 */}
          <div className="w-1/4 relative">
            {/* タイトルをカード外に配置 */}
            <h3 className="absolute -top-5 left-0 font-['Noto_Sans_JP'] font-bold text-white text-xs tracking-[2px]">
              絞り込む
            </h3>
            
            <div className="bg-white rounded-lg p-3 h-full overflow-y-auto">
              {/* 政策テーマセレクター */}
              <div className="mb-5">
                <PolicyThemeSelector
                  themes={policyThemes}
                  selectedThemes={filters.policyThemes}
                  onThemeToggle={handlePolicyThemeToggle}
                />
              </div>
              
              {/* その他のフィルターオプション */}
              <div className="space-y-4">
                <FilterSelect
                  title="業界・分野"
                  options={industryOptions}
                  selectedValues={filters.industries}
                  onSelectionChange={(values) => handleFilterChange("industries", values)}
                  placeholder="業界を選択してください"
                />
                
                <FilterSelect
                  title="役職・立場"
                  options={positionOptions}
                  selectedValues={filters.positions}
                  onSelectionChange={(values) => handleFilterChange("positions", values)}
                  placeholder="役職を選択してください"
                />
                
                {/* フリーワード検索 */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    フリーワード検索
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <span 
                        className="material-symbols-outlined text-gray-400"
                        style={{ fontSize: '15px' }}
                      >
                        search
                      </span>
                    </div>
                    <input
                      type="text"
                      value={filters.searchQuery}
                      onChange={(e) => handleFilterChange("searchQuery", e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="キーワードを入力してください"
                      className="w-full pl-8 pr-12 py-2 bg-gray-100 rounded border border-gray-200 text-xs placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#58aadb] focus:border-transparent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handleSearch}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-gray-200 rounded-r transition-colors"
                    >
                      <span 
                        className="material-symbols-outlined text-gray-500 hover:text-[#58aadb] transition-colors"
                        style={{ fontSize: '12px' }}
                      >
                        keyboard_return
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 人脈マップエリア - 1:3の比率で3の部分 */}
          <div className="w-3/4 relative">
            {/* タイトルをカード外に配置 */}
            <h3 className="absolute -top-5 left-0 font-['Noto_Sans_JP'] font-bold text-white text-xs tracking-[2px]">
              人脈マップ
            </h3>
            
            <div className="bg-white rounded-lg p-2 h-full">
              {/* 人脈マップの表示エリア */}
              <div className="w-full h-full">
                <NetworkMap filters={filters} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
