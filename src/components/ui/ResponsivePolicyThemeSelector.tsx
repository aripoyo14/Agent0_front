import React, { useState } from 'react';

export interface PolicyThemeOption {
  id: string;
  name: string;
  description: string;
}

interface ResponsivePolicyThemeSelectorProps {
  themes: PolicyThemeOption[];
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  className?: string;
}

export const ResponsivePolicyThemeSelector: React.FC<ResponsivePolicyThemeSelectorProps> = ({
  themes,
  currentTheme,
  onThemeChange,
  className = ""
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const selectedTheme = themes.find(theme => theme.id === currentTheme);
  
  // デバッグログ
  React.useEffect(() => {
    console.log('現在のテーマ:', currentTheme);
    console.log('選択されたテーマ:', selectedTheme);
    console.log('利用可能なテーマ数:', themes.length);
  }, [currentTheme, selectedTheme, themes.length]);
  
  const handleThemeSelect = (themeId: string) => {
    console.log('テーマ選択:', themeId); // デバッグログ
    onThemeChange(themeId);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    console.log('ドロップダウントグル:', !isDropdownOpen); // デバッグログ
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className={className}>
      {/* モバイル・タブレット用ドロップダウン */}
      <div className="block lg:hidden">
        <div className="relative z-50">
          {/* ドロップダウンボタン */}
          <button
            type="button"
            onClick={toggleDropdown}
            className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white font-medium text-left flex items-center justify-between hover:bg-white/25 transition-colors duration-200 relative z-10 pointer-events-auto"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="truncate mr-2">
              {selectedTheme?.name || "政策テーマを選択"}
            </span>
            <svg 
              className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* ドロップダウンメニュー */}
          {isDropdownOpen && (
            <>
              {/* オーバーレイ */}
              <div 
                className="fixed inset-0 z-[100]"
                onClick={() => setIsDropdownOpen(false)}
                aria-hidden="true"
              />
              
              {/* メニューコンテンツ */}
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-[110] max-h-80 overflow-y-auto">
                {themes.map((theme) => {
                  const isSelected = currentTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleThemeSelect(theme.id);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 first:rounded-t-lg last:rounded-b-lg ${
                        isSelected ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="font-medium text-sm">
                        {theme.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {theme.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* デスクトップ用ボタングリッド */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
          {themes.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <div key={theme.id} className="relative group">
                <button
                  onClick={() => handleThemeSelect(theme.id)}
                  className={`relative px-2 sm:px-3 py-1 rounded-[40px] text-xs font-bold transition-all hover:shadow-md h-7 flex items-center justify-center w-full min-w-[120px] sm:min-w-[160px] ${
                    isSelected 
                      ? 'bg-white text-[#2d8cd9] shadow-md' 
                      : 'bg-transparent text-white hover:bg-white/10'
                  }`}
                >
                  <div className={`absolute border-solid inset-0 pointer-events-none rounded-[40px] border-[1px] ${
                    isSelected ? 'border-white' : 'border-white/60'
                  }`} />
                  <span className="text-[14px] sm:text-[16px] leading-[1.3] px-1 text-center whitespace-nowrap">
                    {theme.name}
                  </span>
                </button>
                
                {/* ホバー時のツールチップ - レスポンシブ対応 */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 sm:px-4 py-3 bg-gray-900/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-[280px] sm:w-[400px] lg:w-[500px] whitespace-normal shadow-lg">
                  <div className="font-bold mb-2 text-sm">{theme.name}</div>
                  <div className="text-gray-200 leading-relaxed text-xs">{theme.description}</div>
                  {/* ツールチップの矢印 */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900/80"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 使いやすいラッパーコンポーネント
export const PolicyThemeSelector: React.FC<{
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
  className?: string;
}> = ({ currentTheme, onThemeChange, className }) => {
  const themes: PolicyThemeOption[] = [
    { 
      id: "all", 
      name: "すべて",
      description: "全ての政策テーマの記事を表示します。"
    },
    { 
      id: "economy-industry", 
      name: "経済産業",
      description: "国内外の経済動向を踏まえた産業政策や経済成長戦略を推進する分野。"
    },
    { 
      id: "external-economy", 
      name: "対外経済",
      description: "国際経済関係や貿易・投資促進、国際協力を通じた経済成長の実現。"
    },
    { 
      id: "manufacturing-it-distribution-services", 
      name: "ものづくり/情報/流通・サービス",
      description: "製造業や情報通信、物流・流通、サービス産業の高度化と競争力強化。"
    },
    { 
      id: "sme-regional-economy", 
      name: "中小企業・地域経済産業",
      description: "中小企業の成長支援と地域産業の活性化を促進する分野。"
    },
    { 
      id: "energy-environment", 
      name: "エネルギー・環境",
      description: "安定したエネルギー供給と環境保護、脱炭素社会の実現を目指す政策。"
    },
    { 
      id: "safety-security", 
      name: "安全・安心",
      description: "国民生活や企業活動の安全確保、防災・減災、危機管理体制の強化。"
    },
    { 
      id: "digital-transformation", 
      name: "DX",
      description: "デジタル技術を活用して業務変革や新たな価値創造を行う取り組み。"
    },
    { 
      id: "green-transformation", 
      name: "GX",
      description: "環境負荷低減と経済成長の両立を図るグリーントランスフォーメーション。"
    },
    { 
      id: "startup-support", 
      name: "スタートアップ支援",
      description: "新規事業創出やベンチャー企業の成長支援、資金調達や規制緩和の推進。"
    },
    { 
      id: "diversity-management", 
      name: "ダイバーシティ経営",
      description: "多様な人材の活躍を促進し、企業価値向上を図る経営戦略。"
    },
    { 
      id: "economic-security", 
      name: "経済安全保障",
      description: "経済活動における安全確保や重要物資・技術の保護、サプライチェーン強化。"
    },
    { 
      id: "regional-co-creation", 
      name: "地域共創",
      description: "地域資源を活かし、自治体・企業・住民が協力して地域課題を解決。"
    },
    { 
      id: "femtech", 
      name: "フェムテック",
      description: "女性の健康課題解決を支援するテクノロジーや製品・サービスの開発促進。"
    },
    { 
      id: "data-ai-utilization", 
      name: "データ・AI活用",
      description: "ビッグデータやAIを活用して業務効率化や新たな価値創出を実現。"
    },
    { 
      id: "cashless", 
      name: "キャッシュレス",
      description: "現金に依存しない決済手段の普及促進と関連インフラの整備。"
    }
  ];

  return (
    <ResponsivePolicyThemeSelector
      themes={themes}
      currentTheme={currentTheme}
      onThemeChange={onThemeChange}
      className={className}
    />
  );
};
