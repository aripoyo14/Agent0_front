"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilterSelect } from "@/components/ui/filter-select";
import { PolicyThemeSelector } from "@/components/ui/policy-theme-selector";
import { NetworkMap } from "@/components/ui/network-map";
import { 
  policyThemes, 
  industryOptions, 
  positionOptions, 
  regionOptions, 
  otherOptions 
} from "@/data/search-data";
import { SearchFilters } from "@/types";

const imgBackground = "http://localhost:3845/assets/5f80ec7391fa506958e021a0a123f517aa20c66f.svg";

export function SearchPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: "",
    policyThemes: [],
    industries: [],
    positions: [],
    regions: [],
    others: []
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
            className="font-['Noto_Sans_JP'] font-semibold text-white text-xl tracking-[2px] cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleGoToDashboard}
          >
            METI Picks
          </h1>
        </div>

        {/* サブタイトル */}
        <div className="w-1/4">
          <div className="bg-white/20 border border-white rounded-lg px-6 py-3">
            <h2 className="font-['Noto_Sans_JP'] font-bold text-white text-sm tracking-[2px]">
              人流の見える化・つながる
            </h2>
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
              <div className="mb-3">
                <PolicyThemeSelector
                  themes={policyThemes}
                  selectedThemes={filters.policyThemes}
                  onThemeToggle={handlePolicyThemeToggle}
                />
              </div>
              
              {/* その他のフィルターオプション */}
              <div className="space-y-3">
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
                
                <FilterSelect
                  title="地域"
                  options={regionOptions}
                  selectedValues={filters.regions}
                  onSelectionChange={(values) => handleFilterChange("regions", values)}
                  placeholder="地域を選択してください"
                />
                
                <FilterSelect
                  title="その他"
                  options={otherOptions}
                  selectedValues={filters.others}
                  onSelectionChange={(values) => handleFilterChange("others", values)}
                  placeholder="その他の条件を選択してください"
                />
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
