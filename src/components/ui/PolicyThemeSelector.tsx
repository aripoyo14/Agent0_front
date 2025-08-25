import React, { useState, useEffect, useCallback } from 'react';
import { policyThemes } from "@/data/expert-articles-data";

export interface ExpertPolicyTheme {
  id: string;
  name: string;
  description?: string;
  isSelected: boolean;
}

interface PolicyThemeSelectorProps {
  onThemeChange: (themeId: string) => void;
  onSearchChange?: (query: string) => void;
}

export const PolicyThemeSelector: React.FC<PolicyThemeSelectorProps> = ({ 
  onThemeChange,
  onSearchChange
}) => {
  const [themes, setThemes] = useState<ExpertPolicyTheme[]>(policyThemes);
  const [selectedTheme, setSelectedTheme] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 初期化処理
  useEffect(() => {
    // 初期化時はデフォルトの「すべて」を選択
    const initialSelectedTheme = themes.find(t => t.isSelected)?.id || "all";
    setSelectedTheme(initialSelectedTheme);
    onThemeChange(initialSelectedTheme);
  }, [themes, onThemeChange]);

  // テーマ選択処理
  const handleThemeSelect = useCallback((themeId: string) => {
    setSelectedTheme(themeId);
    setThemes(prev => prev.map(theme => ({
      ...theme,
      isSelected: theme.id === themeId
    })));
    onThemeChange(themeId);
  }, [onThemeChange]);

  // 検索処理
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    onSearchChange?.(query);
  }, [onSearchChange]);

  // 検索クリア処理
  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
    onSearchChange?.("");
  }, [onSearchChange]);

  return (
    <div className="relative">
      {/* ヘッダー部分：タイトルと検索バーをレスポンシブ対応 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
        <h3 className="font-['Noto_Sans_JP'] font-bold text-white text-sm sm:text-base md:text-lg tracking-[1px] sm:tracking-[2px] text-center sm:text-left">
          政策テーマを選択する
        </h3>
        
        {/* 検索バー - レスポンシブ対応 */}
        <div className="relative w-full sm:w-48 md:w-56 lg:w-64">
          <div className="relative w-full h-10 sm:h-11 md:h-12">
            <div className="absolute inset-0 bg-white rounded-lg sm:rounded-xl shadow-md border border-gray-200 transition-all duration-300">
            </div>
            <div className="relative flex items-center h-full px-3 sm:px-4">
              <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="キーワードで検索..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-gray-700 placeholder:text-gray-400 font-medium tracking-wide"
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              />
              {searchQuery && (
                <button
                  onClick={handleSearchClear}
                  className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  aria-label="検索をクリア"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* テーマ選択グリッド - レスポンシブ対応 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 w-full">
        {themes.map((theme) => {
          const isSelected = theme.id === selectedTheme;
          return (
            <div key={theme.id} className="relative group">
              <button
                onClick={() => handleThemeSelect(theme.id)}
                className={`relative px-2 sm:px-3 md:px-4 py-2 sm:py-3 rounded-full sm:rounded-2xl md:rounded-3xl text-xs sm:text-sm md:text-base font-bold transition-all hover:shadow-md h-10 sm:h-12 md:h-14 flex items-center justify-center w-full min-w-[80px] sm:min-w-[100px] md:min-w-[120px] lg:min-w-[140px] xl:min-w-[160px] ${
                  isSelected 
                    ? 'bg-white text-[#2d8cd9] shadow-md' 
                    : 'bg-transparent text-white hover:bg-white/10'
                }`}
              >
                <div className={`absolute border-solid inset-0 pointer-events-none rounded-full sm:rounded-2xl md:rounded-3xl border-[1px] ${
                  isSelected ? 'border-white' : 'border-white/60'
                }`} />
                <span className="text-xs sm:text-sm md:text-base leading-tight px-1 text-center whitespace-nowrap">
                  {theme.name}
                </span>
              </button>
              
              {/* ホバー時のツールチップ - レスポンシブ対応 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-900/80 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-[180px] sm:w-[240px] md:w-[320px] lg:w-[400px] xl:w-[500px] whitespace-normal shadow-lg">
                <div className="font-bold mb-1 sm:mb-2 text-sm sm:text-base">{theme.name}</div>
                <div className="text-gray-200 leading-relaxed text-xs">
                  {theme.description || `${theme.name}に関する政策テーマです。`}
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900/80"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
