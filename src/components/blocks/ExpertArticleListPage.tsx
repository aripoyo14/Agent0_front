"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ExpertPolicyTheme, ExpertArticle, ExpertPageState, ExpertFilterState, ExpertOverlayState, ExpertComment, CommentSortOption } from "@/types";
import { policyThemes, getArticlesByTheme, searchArticles, getArticleComments, sortComments } from "@/data/expert-articles-data";
import BackgroundEllipses from "@/components/blocks/BackgroundEllipses";

// 画像アセット
const imgSubTitleIcon = "http://localhost:3845/assets/97cd832355f773e22c5e4fede61842ffbe828a02.svg";
const imgUserIcon = "http://localhost:3845/assets/0046f2f481d47419a2b5046e941c98fae542e480.svg";

// 政策テーマ選択コンポーネント
const PolicyThemeSelector = ({ 
  themes, 
  onThemeSelect 
}: { 
  themes: ExpertPolicyTheme[];
  onThemeSelect: (themeId: string) => void;
}) => {
  return (
    <div className="absolute contents left-[74.99px] top-[123.83px]">
      {themes.map((theme, index) => {
        // Figmaのデザインに合わせた正確な位置計算
        const positions = [
          { left: 74.99, top: 123.83 }, // 経済産業省
          { left: 74.99, top: 163.00 }, // 再生可能エネルギー
          { left: 238.77, top: 123.83 }, // DX（デジタル変革）
          { left: 238.77, top: 163.00 }, // 水素社会
          { left: 402.56, top: 123.83 }, // 産業構造転換
          { left: 402.56, top: 163.00 }, // 資源外交
          { left: 566.35, top: 123.83 }, // スタートアップ・中小企業支援
          { left: 566.35, top: 163.00 }, // グリーン成長戦略
          { left: 730.13, top: 124.33 }, // 通商戦略
          { left: 730.13, top: 163.00 }, // デジタル政策
          { left: 893.92, top: 124.33 }, // 経済安全保障
          { left: 893.92, top: 163.00 }, // 人材政策
          { left: 1057.7, top: 124.33 }, // 経済連携
          { left: 1057.7, top: 163.00 }, // 産学連携
          { left: 1221.49, top: 124.33 }, // ADX（アジア新産業共創）
          { left: 1221.49, top: 163.00 }, // 地域政策
        ];
        
        const position = positions[index] || { left: 74.99, top: 140.83 };
        
        return (
          <div
            key={theme.id}
            className="absolute box-border content-stretch flex flex-row h-[25.389px] items-start justify-start p-0"
            style={{
              left: `${position.left}px`,
              top: `${position.top}px`,
              width: "146.362px"
            }}
          >
            <button
              onClick={() => onThemeSelect(theme.id)}
              className={`box-border content-stretch flex flex-row gap-[10px] h-[30px] items-center justify-start px-[3.346px] py-[2.51px] relative rounded-[40px] shrink-0 w-[160px] transition-all hover:shadow-md ${
                theme.isSelected ? 'bg-white ring-2 ring-white' : 'bg-transparent'
              }`}
            >
              <div
                aria-hidden="true"
                className={`absolute border-solid inset-0 pointer-events-none rounded-[40px] ${
                  theme.isSelected 
                    ? 'border-white border-[1px]' 
                    : 'border-white border-[1px]'
                }`}
              />
              <div className={`basis-0 font-['Noto_Sans_JP:Bold',_sans-serif] font-bold grow leading-[0] min-h-px min-w-px relative shrink-0 text-[11px] text-center tracking-[2px] ${
                theme.isSelected ? 'text-[#58aadb]' : 'text-white'
              }`}>
                <p className="block leading-[1.4] whitespace-pre-line">{theme.name}</p>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
};

// 記事カードコンポーネント
const ArticleCard = ({ 
  article, 
  onArticleClick 
}: { 
  article: ExpertArticle;
  onArticleClick: (article: ExpertArticle) => void;
}) => {
  return (
    <button
      onClick={() => onArticleClick(article)}
      className="block cursor-pointer h-[90px] w-[1200px] p-0 hover:bg-gray-50 transition-colors relative mx-auto"
      aria-label={`記事「${article.title}」を開く`}
    >
      <div className="flex flex-col font-['Noto_Sans_JP:DemiLight',_sans-serif] font-[350] h-[18px] justify-center text-[rgba(34,34,34,0.7)] text-left w-[250px] absolute top-[50px] left-0">
        <p 
          className="block leading-[16px] whitespace-nowrap overflow-hidden text-[11.95px]"
          style={{
            fontFamily: 'Noto Sans JP, sans-serif'
          }}
        >
          {article.department}
        </p>
      </div>
      
      <div className="flex flex-col font-['Noto_Sans_JP:DemiLight',_sans-serif] font-[350] h-[18px] justify-center text-[11.95px] text-[rgba(34,34,34,0.7)] text-left w-[100.562px] absolute top-[50px] left-[260px]">
        <p className="block leading-[16px]">{article.publishedAt}</p>
      </div>
      
      <div className="font-['Noto_Sans_JP:DemiLight',_sans-serif] font-[350] h-[39.826px] leading-[20px] text-[13px] text-[rgba(34,34,34,0.7)] text-left tracking-[0.4779px] w-[600px] absolute top-[11.95px] left-[430.92px]">
        <p className="adjustLetterSpacing block mb-0">{article.summary}</p>
      </div>
      
      <div className="h-[52.272px] w-[450px] absolute top-0 left-0">
        <div className="flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center leading-[0] text-[#707070] text-[16px] text-left top-[25.39px] tracking-[0.9911px] translate-y-[-50%] w-full absolute">
          <p className="adjustLetterSpacing block leading-[20px]">{article.title}</p>
        </div>
      </div>
      
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
        <div className="flex items-center justify-center w-4 h-4">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-gray-500 font-medium">コメント</span>
          <span className="text-[12px] text-gray-700 font-bold">({article.commentCount})</span>
        </div>
      </div>
      
      <div className="absolute flex h-[3.983px] items-center justify-center left-0 right-0 top-[85px]">
        <div className="flex-none h-[3.983px] scale-y-[-100%] w-full">
          <div className="relative size-full">
            <div
              aria-hidden="true"
              className="absolute border-[1.958px_0px_0px] border-[rgba(34,34,34,0.12)] border-solid inset-0 pointer-events-none"
            />
          </div>
        </div>
      </div>
    </button>
  );
};

// コメントバッジコンポーネント
const CommentBadge = ({ badge }: { badge: { label: string; color: string; description: string } }) => {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium"
      style={{ backgroundColor: badge.color + '20', color: badge.color, border: `1px solid ${badge.color}40` }}
      title={badge.description}
    >
      {badge.label}
    </span>
  );
};

// 並び替えセレクターコンポーネント
const CommentSortSelector = ({ 
  currentSort, 
  onSortChange 
}: { 
  currentSort: CommentSortOption;
  onSortChange: (sort: CommentSortOption) => void;
}) => {
  const sortOptions = [
    { value: 'relevance', label: '関連性順' },
    { value: 'likes', label: 'いいね順' },
    { value: 'views', label: '閲覧数順' },
    { value: 'date', label: '投稿日時順' }
  ] as const;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">並び替え:</span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as CommentSortOption)}
        className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// コメントカードコンポーネント
const CommentCard = ({ comment }: { comment: ExpertComment }) => {
  return (
    <div className="border-b border-gray-100 pb-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
          {comment.author.name.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{comment.author.name}</span>
              <span className="text-xs text-gray-500">{comment.author.role}</span>
            </div>
            {/* バッジの表示（右端） */}
            <div className="flex gap-1">
              {comment.author.badges.map((badge, index) => (
                <CommentBadge key={index} badge={badge} />
              ))}
            </div>
          </div>
          <span className="text-xs text-gray-500">{comment.createdAt}</span>
        </div>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed ml-11">
        {comment.content}
      </p>
      <div className="flex items-center gap-2 mt-3 ml-11">
        <button className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-xs">{comment.likeCount}</span>
        </button>
      </div>
    </div>
  );
};

// オーバーレイコンポーネント
const ArticleOverlay = ({ 
  overlay, 
  onClose, 
  onViewDetail: _onViewDetail,
  isAnimating
}: { 
  overlay: ExpertOverlayState;
  onClose: () => void;
  onViewDetail: (article: ExpertArticle) => void;
  isAnimating: boolean;
}) => {
  const [sortOption, setSortOption] = useState<CommentSortOption>('relevance');
  
  if (!overlay.isOpen || !overlay.selectedArticle) return null;

  const article = overlay.selectedArticle;
  const allComments = getArticleComments(article.id);
  const sortedComments = sortComments(allComments, sortOption);

  return (
    <>
      {/* 背景オーバーレイ */}
      <div 
        className="fixed inset-0 bg-black/0 z-30 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* スライドインオーバーレイ */}
      <div className={`fixed inset-y-0 right-0 w-[800px] bg-white shadow-2xl z-50 transform transition-all duration-500 ease-in-out overflow-hidden ${
        isAnimating ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* ヘッダー */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button
              onClick={onClose}
              className="flex items-center justify-center w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="オーバーレイを閉じる"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* 固定コンテンツエリア */}
          <div className="p-4">
            {/* 記事タイトル */}
            <h1 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
              {article.title}
            </h1>
            
            {/* 記事メタ情報 */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span>{article.department}</span>
              <span>{article.publishedAt}</span>
              <span>コメント: {article.commentCount}件</span>
            </div>
            
            {/* 記事本文 */}
            <div className="prose max-w-none mb-4">
              <p className="text-gray-700 leading-relaxed text-sm">
                {article.summary}
              </p>
            </div>
            
            {/* 詳細を見るボタン */}
            <div className="flex justify-center mb-2">
              <button
                onClick={() => _onViewDetail(article)}
                className="bg-[#4AA0E9] text-white px-5 py-2 rounded-full hover:bg-[#3a8fd9] transition-colors text-sm font-medium shadow-md hover:shadow-lg"
              >
                詳細を見る
              </button>
            </div>
            
            {/* 注目のコメントセクション */}
            <div className="pt-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-base font-bold text-gray-900">意見一覧</h3>
                </div>
                <CommentSortSelector 
                  currentSort={sortOption} 
                  onSortChange={setSortOption} 
                />
              </div>
              <div className="border-t border-gray-200 pt-3"></div>
            </div>
          </div>
          
          {/* スクロール可能なコメントエリア */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 pb-6">
              {/* コメント一覧 */}
              <div className="space-y-6">
                                  {sortedComments.map((comment, _index) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// メインコンポーネント
export default function ExpertArticleListPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<ExpertPageState>("idle");
  const [themes, setThemes] = useState<ExpertPolicyTheme[]>(policyThemes);
  const [filterState, setFilterState] = useState<ExpertFilterState>({
    selectedTheme: "startup",
    searchQuery: ""
  });
  const [_isSearchFocused, setIsSearchFocused] = useState(false);
  const [overlayState, setOverlayState] = useState<ExpertOverlayState>({
    isOpen: false,
    selectedArticle: null
  });
  const [isOverlayAnimating, setIsOverlayAnimating] = useState(false);
  const [filteredArticles, setFilteredArticles] = useState<ExpertArticle[]>([]);

  // 記事のフィルタリング処理
  const filterArticles = useCallback((selectedTheme: string, searchQuery: string) => {
    setPageState("loading");
    
    try {
      let articles = getArticlesByTheme(selectedTheme);
      console.log("フィルタリング結果:", { selectedTheme, searchQuery, articlesCount: articles.length });
      
      if (searchQuery.trim()) {
        articles = searchArticles(searchQuery);
      }
      
      setFilteredArticles(articles);
      setPageState("success");
    } catch (error) {
      console.error("記事のフィルタリングエラー:", error);
      setPageState("error");
    }
  }, []);

  // 初期化時とフィルター状態変更時に記事をフィルタリング
  useEffect(() => {
    filterArticles(filterState.selectedTheme || "startup", filterState.searchQuery);
  }, [filterState.selectedTheme, filterState.searchQuery, filterArticles]);

  // テーマ選択処理
  const handleThemeSelect = (themeId: string) => {
    setThemes(prev => prev.map(theme => ({
      ...theme,
      isSelected: theme.id === themeId
    })));
    
    setFilterState(prev => ({
      ...prev,
      selectedTheme: themeId
    }));
  };

  // 検索処理
  const handleSearch = (query: string) => {
    setFilterState(prev => ({
      ...prev,
      searchQuery: query
    }));
  };

  // 検索クリア処理
  const handleSearchClear = () => {
    setFilterState(prev => ({
      ...prev,
      searchQuery: ""
    }));
  };

  // 記事クリック処理
  const handleArticleClick = (article: ExpertArticle) => {
    // オーバーレイが既に開いている場合は、アニメーションなしで切り替え
    if (overlayState.isOpen) {
      setOverlayState({
        isOpen: true,
        selectedArticle: article
      });
    } else {
      // 初回オープン時はアニメーション付き
      setOverlayState({
        isOpen: true,
        selectedArticle: article
      });
      // 少し遅延させてからアニメーション開始
      setTimeout(() => {
        setIsOverlayAnimating(true);
      }, 10);
    }
  };

  // オーバーレイ閉じる処理
  const handleOverlayClose = () => {
    setIsOverlayAnimating(false);
    setTimeout(() => {
      setOverlayState({
        isOpen: false,
        selectedArticle: null
      });
    }, 500);
  };

  // 詳細ページへ遷移
  const handleViewDetail = (article: ExpertArticle) => {
    router.push(`/expert/articles/${article.id}`);
  };

  // ログアウト処理
  const handleLogout = () => {
    // ログアウト処理を実装
    router.push("/login");
  };

  return (
    <div className="bg-[#939393] relative size-full h-screen overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute bg-gradient-to-t from-[#b4d9d6] h-[1024px] left-1/2 to-[#58aadb] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[1440px]" />
      
      {/* 背景装飾 */}
      <BackgroundEllipses scale={0.8} />
      
      {/* ヘッダー */}
      <div className="absolute h-[29.446px] left-[68px] top-6 w-[1306.73px]">
        <button
          onClick={handleLogout}
          className="absolute bg-[#ffffff] box-border content-stretch flex flex-row inset-[3.4%_-0.02%_-1.03%_94.36%] items-center justify-center px-[7.097px] py-[9.463px] rounded-[15.971px] hover:bg-gray-50 transition-colors"
        >
          <div className="box-border content-stretch flex flex-row gap-[5.914px] items-center justify-center px-[9.463px] py-0 relative shrink-0">
            <div className="bg-clip-text bg-gradient-to-b font-['Noto_Sans_JP:Bold',_sans-serif] font-bold from-[#64b0db] leading-[0] relative shrink-0 text-[9.463px] text-left text-nowrap to-[#a8d3d7] tracking-[0.2957px]">
              <p className="adjustLetterSpacing block leading-none whitespace-pre">ログアウト</p>
            </div>
          </div>
        </button>
        
        <div className="absolute inset-[13.58%_6.81%_14.98%_81.12%]">
          <div className="absolute bottom-[2.5%] font-['Montserrat:SemiBold',_'Noto_Sans_JP:Bold',_sans-serif] font-semibold leading-[0] left-0 right-[20%] text-[#ffffff] text-[12.62px] text-left text-nowrap top-[12.5%] tracking-[1.5144px]">
            <p className="adjustLetterSpacing block leading-[1.4] whitespace-pre">テックゼロ太郎さん</p>
          </div>
          <div className="absolute inset-[12.5%_4.83%_10%_85.67%]">
            <img alt="ユーザーアイコン" className="block max-w-none size-full" src={imgUserIcon} />
          </div>
        </div>
        
        {/* 検索バー */}
        <div className="absolute h-[32px] left-[141px] top-[19%] w-[350px]">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-white rounded-[8px] shadow-md border border-gray-200 transition-all duration-300">
            </div>
            <div className="relative flex items-center h-full px-3">
              <div className="flex items-center justify-center w-4 h-4 mr-2">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="キーワードで検索..."
                value={filterState.searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="flex-1 bg-transparent border-none outline-none text-[12px] text-gray-700 placeholder:text-gray-400 font-medium tracking-wide"
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              />
              {filterState.searchQuery && (
                <button
                  onClick={handleSearchClear}
                  className="flex items-center justify-center w-4 h-4 ml-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  aria-label="検索をクリア"
                >
                  <svg className="w-2.5 h-2.5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={() => router.push('/expert/articles')}
          className="absolute bottom-[-5.28%] font-['Montserrat:SemiBold',_sans-serif] font-semibold leading-[0] left-0 right-[90.82%] text-[#ffffff] text-[18.029px] text-left text-nowrap top-[20.38%] tracking-[2.1635px] hover:text-blue-200 transition-colors cursor-pointer"
        >
          <p className="adjustLetterSpacing block leading-[1.4] whitespace-pre">METI Picks</p>
        </button>
      </div>
      
      {/* サブタイトル */}
      <div className="absolute h-[25px] left-[77.48px] top-[85px] w-[563.542px]">
        <div className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center leading-[0] left-[27.38px] text-[#ffffff] text-[11.948px] text-left top-[12.5px] tracking-[2.4842px] translate-y-[-50%] w-[536.163px]">
          <p className="adjustLetterSpacing block leading-[24.67px]">政策テーマを選ぶ</p>
        </div>
        <div className="absolute left-0 size-[21.407px] top-[1px]">
          <img alt="サブタイトルアイコン" className="block max-w-none size-full" src={imgSubTitleIcon} />
        </div>
      </div>
      
      {/* 政策テーマ選択 */}
      <PolicyThemeSelector themes={themes} onThemeSelect={handleThemeSelect} />
      
      {/* 選択されたテーマのタイトル */}
      <div className="absolute bottom-0 left-[72px] pointer-events-none top-[218px] w-[608.847px]">
        <div className="h-[24.892px] pointer-events-auto sticky top-0 w-full">
          <div className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold h-[24.892px] justify-center leading-[0] left-0 text-[#fff9f9] text-[22px] text-left top-[12.45px] tracking-[3px] translate-y-[-50%] w-[558.068px]">
            <p className="adjustLetterSpacing block leading-[22px]">
              {themes.find(t => t.isSelected)?.name || "政策テーマを選ぶ"}
            </p>
          </div>
        </div>
      </div>
      
      {/* 記事エリア */}
      <div className="absolute h-[500px] left-[65px] top-[249px] w-[1304px] z-40">
        <div className="absolute bg-[#ffffff] h-[500px] left-0 rounded-[11.759px] top-0 w-[1304px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {pageState === "loading" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">読み込み中...</div>
            </div>
          )}
          
          {pageState === "error" && (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500">エラーが発生しました</div>
            </div>
          )}
          
          <div className="p-6 pb-8">
            {pageState === "loading" && (
              <div className="text-center py-8">
                <p className="text-gray-500">読み込み中...</p>
              </div>
            )}
            
            {pageState === "error" && (
              <div className="text-center py-8">
                <p className="text-red-500">エラーが発生しました</p>
              </div>
            )}
            
            {pageState !== "loading" && pageState !== "error" && (
              <>
                {filteredArticles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">記事が見つかりませんでした</p>
                  </div>
                ) : (
                  filteredArticles.map((article, _index) => (
                    <div key={article.id} className="relative mb-2 flex justify-center">
                      <ArticleCard 
                        article={article} 
                        onArticleClick={handleArticleClick}
                      />
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* オーバーレイ */}
      <ArticleOverlay 
        overlay={overlayState}
        onClose={handleOverlayClose}
        onViewDetail={handleViewDetail}
        isAnimating={isOverlayAnimating}
      />
    </div>
  );
}
