"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ExpertPolicyTheme, ExpertArticle, ExpertPageState, ExpertFilterState, ExpertOverlayState, ExpertComment, CommentSortOption, PolicyProposal, UsersInfoResponse } from "@/types";
import { policyThemes, getArticlesByTheme, searchArticles, sortComments } from "@/data/expert-articles-data";
import BackgroundEllipses from "@/components/blocks/BackgroundEllipses";
import { CommentCount } from "@/components/ui/comment-count";
import { getPolicyProposals, getPolicyProposalComments, getUsersInfo } from "@/lib/expert-api";
import { getUserNameFromAPI, debugToken, testAuth, getUserName } from "@/lib/auth";



// 日付フォーマット関数
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return "昨日";
    } else if (diffDays <= 7) {
      return `${diffDays}日前`;
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}週間前`;
    } else if (diffDays <= 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}ヶ月前`;
    } else {
      return date.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  } catch {
    // パースに失敗した場合は元の文字列を返す
    return dateString;
  }
};

// データ変換関数
const convertPolicyProposalToExpertArticle = (proposal: PolicyProposal): ExpertArticle => ({
  id: proposal.id,
  title: proposal.title,
  summary: proposal.body.substring(0, 100) + "...", // 最初の100文字をサマリーとして使用
  content: proposal.body,
  department: "中小企業庁 地域産業支援課", // 仮の値
  publishedAt: formatDate(proposal.published_at || proposal.created_at),
  commentCount: 0, // 後で計算
  themeId: proposal.policy_tags && proposal.policy_tags.length > 0 
    ? proposal.policy_tags[0].id.toString() 
    : "startup" // タグがない場合は"startup"に設定（「すべて」で表示される）
});

// 政策テーマ選択コンポーネント
const PolicyThemeSelector = ({ 
  themes, 
  onThemeSelect 
}: { 
  themes: ExpertPolicyTheme[];
  onThemeSelect: (themeId: string) => void;
}) => {
  return (
    <div className="absolute contents left-[65px] top-[123.83px]">
      {themes.map((theme, index) => {
        // メインエリアのカードと同じ位置に合わせた位置計算
        const positions = [
          { left: 65, top: 123.83 }, // 経済産業省
          { left: 65, top: 163.00 }, // 再生可能エネルギー
          { left: 228.78, top: 123.83 }, // DX（デジタル変革）
          { left: 228.78, top: 163.00 }, // 水素社会
          { left: 392.57, top: 123.83 }, // 産業構造転換
          { left: 392.57, top: 163.00 }, // 資源外交
          { left: 556.36, top: 123.83 }, // スタートアップ・中小企業支援
          { left: 556.36, top: 163.00 }, // グリーン成長戦略
          { left: 720.14, top: 124.33 }, // 通商戦略
          { left: 720.14, top: 163.00 }, // デジタル政策
          { left: 883.93, top: 124.33 }, // 経済安全保障
          { left: 883.93, top: 163.00 }, // 人材政策
          { left: 1047.71, top: 124.33 }, // 経済連携
          { left: 1047.71, top: 163.00 }, // 産学連携
          { left: 1211.5, top: 124.33 }, // ADX（アジア新産業共創）
          { left: 1211.5, top: 163.00 }, // 地域政策
        ];
        
        const position = positions[index] || { left: 65, top: 140.83 };
        
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
        <CommentCount 
          policyProposalId={article.id}
          className="text-[12px] text-gray-700 font-bold"
          showIcon={true}
        />
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
  const [comments, setComments] = useState<ExpertComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  
  // コメントを取得する関数
  const fetchComments = useCallback(async (articleId: string) => {
    try {
      setIsLoadingComments(true);
      
      // バックエンドからコメントデータを取得
      const policyComments = await getPolicyProposalComments(articleId);
      
      // ユーザーIDの一覧を取得
      const userIds = [...new Set(policyComments.map(comment => comment.author_id))];
      
              // ユーザー情報を一括取得
        let usersInfo: UsersInfoResponse = {};
      if (userIds.length > 0) {
        try {
          usersInfo = await getUsersInfo(userIds);
        } catch (error) {
          console.error("ユーザー情報の一括取得に失敗しました:", error);
        }
      }
      
      // コメントを変換（ユーザー情報を使用）
      const convertedComments = policyComments.map(comment => {
        const userInfo = usersInfo[comment.author_id];
        return {
          id: comment.id,
          author: {
            id: comment.author_id,
            name: userInfo?.name || comment.author_name || `ユーザー${comment.author_id.slice(-4)}`,
            role: userInfo?.role || (comment.author_type === "contributor" ? "エキスパート" : comment.author_type),
            company: userInfo?.company || "会社名",
            badges: userInfo?.badges?.map((badge: {
              type: string;
              label: string;
              color: string;
              description: string;
            }) => ({
              type: badge.type as "expert" | "pro" | "verified" | "official" | "influencer",
              label: badge.label,
              color: badge.color,
              description: badge.description
            })) || [
              {
                type: "expert" as const,
                label: "認定エキスパート",
                color: "#4AA0E9",
                description: "認定されたエキスパート"
              }
            ],
            expertiseLevel: (userInfo?.expertiseLevel as "expert" | "pro" | "verified" | "regular") || "expert"
          },
          content: comment.comment_text,
          createdAt: new Date(comment.posted_at).toLocaleDateString('ja-JP', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          likeCount: 0,
          viewCount: 0,
          isLiked: false
        } as ExpertComment;
      });
      
      setComments(convertedComments);
    } catch (error) {
      console.error("コメントの取得エラー:", error);
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  }, []);
  
  // 記事が変更されたときにコメントを取得
  useEffect(() => {
    if (overlay.selectedArticle) {
      fetchComments(overlay.selectedArticle.id);
    }
  }, [overlay.selectedArticle, fetchComments]);
  
  if (!overlay.isOpen || !overlay.selectedArticle) return null;

  const article = overlay.selectedArticle;
  const sortedComments = sortComments(comments, sortOption);

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
              <span>
                コメント: <CommentCount 
                  policyProposalId={article.id}
                  className="text-gray-600"
                  showIcon={false}
                />
              </span>
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
                {isLoadingComments ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500 text-sm mb-3">コメントを読み込み中...</div>
                    
                    {/* アニメーションするローディングドット */}
                    <div className="flex justify-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                ) : sortedComments.length === 0 ? (
                  <div className="text-center py-8">
                    {/* アイコン */}
                    <div className="mb-4">
                      <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    
                    {/* メインテキスト */}
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">まだ意見が投稿されていません</h3>
                    
                    {/* サブテキスト */}
                    <p className="text-gray-500 text-xs max-w-xs mx-auto leading-relaxed">
                      この記事に関する意見がまだ投稿されていません。<br />
                      最初の意見を投稿してみませんか？
                    </p>
                    
                    {/* 装飾的な要素 */}
                    <div className="mt-4 flex justify-center">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                        <div className="w-1.5 h-1.5 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  sortedComments.map((comment, _index) => (
                    <CommentCard key={comment.id} comment={comment} />
                  ))
                )}
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
    selectedTheme: "all", // デフォルトで「すべて」を選択
    searchQuery: ""
  });
  const [_isSearchFocused, setIsSearchFocused] = useState(false);
  const [overlayState, setOverlayState] = useState<ExpertOverlayState>({
    isOpen: false,
    selectedArticle: null
  });
  const [isOverlayAnimating, setIsOverlayAnimating] = useState(false);
  const [filteredArticles, setFilteredArticles] = useState<ExpertArticle[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [dataSource, setDataSource] = useState<'api' | 'public' | 'sample' | null>(null);
  const [userName, setUserName] = useState<string>("ログインユーザー");

  // ユーザー名を取得
  useEffect(() => {
    const fetchUserName = async () => {
      console.log("🔄 ユーザー名取得開始...");
      
      // デバッグ情報を出力
      await debugToken();
      await testAuth();
      
      try {
        const name = await getUserNameFromAPI();
        setUserName(name);
        console.log("✅ ユーザー名取得成功:", name);
      } catch (error) {
        console.error("❌ ユーザー名取得エラー:", error);
        // フォールバック
        const fallbackName = getUserName();
        setUserName(fallbackName);
        console.log("✔ ユーザー名取得成功:", fallbackName);
      }
    };

    fetchUserName();
  }, []);

  // 記事のフィルタリング処理
  const filterArticles = useCallback(async (selectedTheme: string, searchQuery: string) => {
    setPageState("loading");
    
    try {
      // バックエンドから政策提案データを取得
      console.log("バックエンドAPI呼び出し開始...");
      const policyProposals = await getPolicyProposals({
        status: "published",
        q: searchQuery.trim() || undefined,
        limit: 50
      });
      
      console.log("取得された政策提案データ:", policyProposals);
      
      // データ変換
      let articles = policyProposals.map(convertPolicyProposalToExpertArticle);
      console.log("変換後の記事データ:", articles);
      
      // テーマで絞り込み（「すべて」以外が選択されている場合のみ絞り込み）
      if (selectedTheme && selectedTheme !== "all") {
        console.log("テーマ絞り込み前の記事数:", articles.length);
        articles = articles.filter(article => {
          const matches = article.themeId === selectedTheme;
          console.log(`記事 "${article.title}" (themeId: ${article.themeId}) は選択テーマ "${selectedTheme}" と一致: ${matches}`);
          return matches;
        });
        console.log("テーマ絞り込み後の記事数:", articles.length);
      } else {
        console.log("「すべて」が選択されているため、絞り込みなし。記事数:", articles.length);
      }
      
      console.log("フィルタリング結果:", { 
        selectedTheme, 
        searchQuery, 
        articlesCount: articles.length,
        totalProposals: policyProposals.length 
      });
      
      setFilteredArticles(articles);
      setDataSource('api'); // 認証付きAPIから取得
      setPageState("success");
    } catch (error) {
      console.error("記事のフィルタリングエラー:", error);
      
      // エラーの詳細をログ出力
      if (error instanceof Error) {
        console.error("エラー詳細:", error.message);
      }
      
      // バックエンドエラーの場合、サンプルデータを使用
      console.log("バックエンドエラーのため、サンプルデータを使用します");
      console.log("バックエンド側でjoinedloadの修正が必要です");
      
      try {
        let articles = getArticlesByTheme(selectedTheme);
        
        if (searchQuery.trim()) {
          articles = searchArticles(searchQuery);
        }
        
        setFilteredArticles(articles);
        setDataSource('sample'); // サンプルデータを使用
        setPageState("success");
      } catch (fallbackError) {
        console.error("サンプルデータの読み込みエラー:", fallbackError);
        setPageState("error");
      }
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



  // ドロップダウンメニューを閉じる処理
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element;
    if (!target.closest('.user-menu-container')) {
      setShowUserMenu(false);
    }
  };

  // クリックイベントリスナーの追加
  useEffect(() => {
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  return (
    <div className="bg-[#939393] relative size-full h-screen overflow-hidden">
      {/* 背景グラデーション */}
      <div className="absolute bg-gradient-to-t from-[#7bc8e8] via-[#58aadb] to-[#2d8cd9] h-[1024px] left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[1440px]" />
      
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
      
      {/* 背景装飾 */}
      <BackgroundEllipses scale={0.8} />
      
      {/* ヘッダー */}
      <div className="absolute h-[29.446px] left-[68px] top-6 w-[1306.73px]">
        <div className="absolute inset-[13.58%_6.81%_14.98%_81.12%] right-0">
          <div className="absolute right-0 top-0 flex items-center gap-3">
            <div className="font-['Montserrat:SemiBold',_'Noto_Sans_JP:Bold',_sans-serif] font-semibold text-[#ffffff] text-[12.62px] text-right text-nowrap tracking-[1.5144px]">
              <p className="adjustLetterSpacing block leading-[1.4] whitespace-pre">{userName}</p>
            </div>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
          
          {/* ユーザーメニュードロップダウン */}
          {showUserMenu && (
            <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[400px] z-[9999]">
              {/* 矢印 */}
              <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
              
              {/* メニュー項目 */}
              <div className="py-2">
                <div className="px-4 py-2">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v3.75l-1.5 1.5H6l-1.5-1.5V9.75a6 6 0 0 1 6-6z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">新着通知</span>
                  </div>
                  
                  {/* 通知リスト */}
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    <div className="p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#58aadb] rounded-full mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-900 mb-1">新しい政策案が投稿されました</p>
                          <p className="text-xs text-gray-600">「スタートアップ向け税制優遇措置の拡充」について新しい意見が投稿されました</p>
                          <p className="text-xs text-gray-500 mt-1">2時間前</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-[#58aadb] rounded-full mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-900 mb-1">コメントが追加されました</p>
                          <p className="text-xs text-gray-600">「地方スタートアップ育成ファンドの創設」に新しいコメントが追加されました</p>
                          <p className="text-xs text-gray-500 mt-1">5時間前</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-gray-900 mb-1">新しい政策テーマが追加されました</p>
                          <p className="text-xs text-gray-600">「DX-デジタル変革」テーマに新しい記事が追加されました</p>
                          <p className="text-xs text-gray-500 mt-1">1日前</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    // TODO: プロフィール画面への遷移
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  プロフィール
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    router.push("/login");
                    setShowUserMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                >
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  ログアウト
                </button>
              </div>
            </div>
          )}
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
        <div className="absolute flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold justify-center leading-[0] left-0 text-[#ffffff] text-[11.948px] text-left top-[12.5px] tracking-[2.4842px] translate-y-[-50%] w-[563.542px]">
          <p className="adjustLetterSpacing block leading-[24.67px]">政策テーマを選ぶ</p>
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
          {/* データソース表示 */}
          {dataSource === 'sample' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 m-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-yellow-800 text-sm font-medium">
                  現在サンプルデータを表示しています。ログインすると最新のデータをご覧いただけます。
                </p>
              </div>
            </div>
          )}
          
          {dataSource === 'public' && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 m-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-blue-800 text-sm font-medium">
                  公開データを表示しています。ログインするとより詳細な情報をご覧いただけます。
                </p>
              </div>
            </div>
          )}
          
          {pageState === "loading" && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-gray-500 text-lg mb-4 font-medium">Loading...</div>
              
              {/* アニメーションするローディングドット */}
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
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
                <div className="text-gray-500 text-lg mb-4 font-medium">Loading...</div>
                
                {/* アニメーションするローディングドット */}
                <div className="flex justify-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
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
                  <div className="text-center py-12">
                    {/* メインテキスト */}
                    <h3 className="text-lg font-semibold text-[#58aadb] mb-2">記事がまだありません</h3>
                    
                    {/* サブテキスト */}
                    <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                      選択されたテーマに関連する記事がまだ投稿されていません。<br />
                      他のテーマを選択するか、しばらくお待ちください。
                    </p>
                    
                    {/* 装飾的な要素 */}
                    <div className="mt-6 flex justify-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
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
