"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ExpertArticle, ExpertPageState, PolicyProposal } from "@/types";
import { policyThemes, getArticlesByTheme, searchArticles } from "@/data/expert-articles-data";
import { getPolicyProposals, getPolicyProposalsByTag } from "@/lib/expert-api";
import { isAuthenticated } from "@/lib/storage";
import { getUserNameFromAPI, debugToken, testAuth, getUserName } from "@/lib/auth";
import { PolicyThemeSelector } from "@/components/ui/PolicyThemeSelector";
import { ArticleOverlay } from "@/components/ui/ArticleOverlay";
import { ExpertHeader } from "@/components/ui/expert_header";
import { ArticleList } from "@/components/ui/ArticleList";
import { DataSourceIndicator } from "@/components/ui/DataSourceIndicator";
import { LoadingErrorStates } from "@/components/ui/LoadingErrorStates";
import { EmptyState } from "@/components/ui/EmptyState";

// コンポーネントのプロパティ型定義
interface ExpertArticleListPageProps {
  initialArticles: PolicyProposal[];
}

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

// データ変換関数（コメント数取得付き）
const convertPolicyProposalToExpertArticle = async (proposal: PolicyProposal): Promise<ExpertArticle> => {
  // コメント数を取得
  let commentCount = 0;
  try {
    const { getCommentCount } = await import('@/lib/expert-api');
    const commentData = await getCommentCount(proposal.id);
    commentCount = commentData.comment_count;
  } catch (error) {
    console.error(`コメント数取得エラー (${proposal.id}):`, error);
    commentCount = 0;
  }

  return {
    id: proposal.id,
    title: proposal.title,
    summary: proposal.body.substring(0, 100) + "...", // 最初の100文字をサマリーとして使用
    content: proposal.body,
    department: "中小企業庁 地域産業支援課", // 仮の値
    publishedAt: formatDate(proposal.published_at || proposal.created_at),
    commentCount: commentCount,
    themeId: proposal.policy_tags && proposal.policy_tags.length > 0 
      ? proposal.policy_tags[0].id.toString() 
      : "startup", // タグがない場合は"startup"に設定（「すべて」で表示される）
    attachments: proposal.attachments || [] // 添付ファイル情報を追加
  };
};

// 開発環境でのみログを表示する関数
const devLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

// 開発環境でのみエラーログを表示する関数
const devError = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  }
};

  // メインコンポーネント
  export default function ExpertArticleListPage({ initialArticles }: ExpertArticleListPageProps) {
    const router = useRouter();
    const [pageState, setPageState] = useState<ExpertPageState>("loading");
    const [filteredArticles, setFilteredArticles] = useState<ExpertArticle[]>([]);
    const [dataSource, setDataSource] = useState<'api' | 'public' | 'sample' | null>(null);
    const [_userName, setUserName] = useState<string>("ログインユーザー");
    
    // オーバーレイの状態管理を追加
    const [overlayState, setOverlayState] = useState<{
      isOpen: boolean;
      selectedArticle: ExpertArticle | null;
    }>({
      isOpen: false,
      selectedArticle: null
    });





  // ユーザー名を取得
  useEffect(() => {
    const fetchUserName = async () => {
      devLog("🔄 ユーザー名取得開始...");
      
      // デバッグ情報を出力
      await debugToken();
      await testAuth();
      
      try {
        const name = await getUserNameFromAPI();
        setUserName(name);
        // devLog("✅ ユーザー名取得成功:", name);
      } catch (error) {
        devError("❌ ユーザー名取得エラー:", error);
        // フォールバック
        const fallbackName = getUserName();
        setUserName(fallbackName);
        // devLog("✔ ユーザー名取得成功:", fallbackName);
      }
    };

    fetchUserName();
  }, []);

  // 記事のフィルタリング処理
  const filterArticles = useCallback(async (selectedTheme: string, searchQuery: string) => {
    devLog(" filterArticles 呼び出し:", { selectedTheme, searchQuery });
    
    // 即座にローディング状態を設定（テーマ切り替え時も確実に表示）
    setPageState("loading");
    
    let articles: ExpertArticle[] = [];
    
    try {
      let policyProposals: PolicyProposal[] = [];
      
      // テーマが選択されている場合は、タグIDで絞り込み
      if (selectedTheme && selectedTheme !== "all") {
        devLog("🎯 タグID別API呼び出し開始:", selectedTheme);
        
        // テーマIDをバックエンドのタグIDに変換
        const tagId = getTagIdFromThemeId(selectedTheme);
        if (!tagId) {
          throw new Error(`テーマID ${selectedTheme} に対応するタグIDが見つかりません`);
        }
        
        const apiParams = {
          status: "published" as const,
          q: searchQuery.trim() || undefined,
          limit: 50
        };
        
        // タグID別API呼び出し（ローディング状態を維持）
        policyProposals = await getPolicyProposalsByTag(tagId, apiParams);
        devLog("✅ タグID別API取得成功:", policyProposals.length, "件");
      } else {
        // 「すべて」が選択されている場合は、全件取得
        devLog("🌐 全件取得API呼び出し開始");
        
        const apiParams = {
          status: "published" as const,
          q: searchQuery.trim() || undefined,
          limit: 50
        };
        
        // 全件取得API呼び出し（ローディング状態を維持）
        policyProposals = await getPolicyProposals(apiParams);
        // devLog("✅ 全件取得API取得成功:", policyProposals.length, "件");
      }
      
      // コメント数取得処理（ローディング状態を維持）
      devLog("🔄 コメント数取得中...");
      const articlesPromises = policyProposals.map(convertPolicyProposalToExpertArticle);
      articles = await Promise.all(articlesPromises);
      devLog("✅ コメント数取得完了:", articles.length, "件");
      
      // 検索フィルタリング処理（ローディング状態を維持）
      if (searchQuery.trim()) {
        devLog("🔍 検索フィルタリング開始:", searchQuery);
        const searchLower = searchQuery.toLowerCase();
        articles = articles.filter(article => 
          article.title.toLowerCase().includes(searchLower) ||
          article.summary.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower)
        );
        devLog("📊 検索フィルタリング完了:", articles.length, "件");
      }
      
      devLog(" 最終フィルタリング結果:", { 
        selectedTheme, 
        searchQuery, 
        articlesCount: articles.length,
        totalProposals: policyProposals.length 
      });
      
      // データの準備が完了してから状態を更新
      setFilteredArticles(articles);
      setDataSource('api');
      
      // 成功状態に設定
      setPageState("success");
      
      // devLog("✅ 状態更新完了:", {
      //   filteredArticlesCount: articles.length,
      //   pageState: "success",
      //   dataSource: "api"
      // });
      
    } catch (error) {
      devError("❌ 記事のフィルタリングエラー:", error);
      
      // エラーの詳細を詳しくログ出力
      if (error instanceof Error) {
        devError("🔍 Error型のエラー:", {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      } else if (typeof error === 'object' && error !== null) {
        devError("🔍 オブジェクト型のエラー:", {
          keys: Object.keys(error),
          values: Object.values(error),
          stringified: JSON.stringify(error, null, 2)
        });
      } else {
        devError("🔍 その他の型のエラー:", {
          type: typeof error,
          value: error
        });
      }
      
      // バックエンドエラーの場合、サンプルデータを使用
      devLog("🔄 バックエンドエラーのため、サンプルデータを使用します");
      
      try {
        // テーマIDをサンプルデータ用に変換
        const sampleThemeId = convertThemeIdForSampleData(selectedTheme);
        
        devLog(" サンプルデータ用テーマID変換:", selectedTheme, "→", sampleThemeId);
        
        // サンプルデータ取得（ローディング状態を維持）
        articles = getArticlesByTheme(sampleThemeId);
        devLog("📋 サンプルデータ取得:", articles.length, "件");
        
        if (searchQuery.trim()) {
          // サンプルデータ検索（ローディング状態を維持）
          articles = searchArticles(searchQuery);
          devLog("🔍 サンプルデータ検索後:", articles.length, "件");
        }
        
        // サンプルデータの準備が完了してから状態を更新
        setFilteredArticles(articles);
        setDataSource('sample');
        
        // 成功状態に設定
        setPageState("success");
        
        devLog("✅ サンプルデータ状態更新完了:", {
          filteredArticlesCount: articles.length,
          pageState: "success",
          dataSource: "sample"
        });
        
      } catch (fallbackError) {
        devError("❌ サンプルデータの読み込みエラー:", fallbackError);
        setPageState("error");
      }
    }
  }, []); // 依存配列からoverlayState.isOpenを削除

  // テーマIDをバックエンドのタグIDに変換する関数
  const getTagIdFromThemeId = (themeId: string): string | null => {
    const themeNameToIdMap: Record<string, string> = {
      "economy-industry": "1",
      "external-economy": "2", 
      "manufacturing-it-distribution-services": "3",
      "sme-regional-economy": "4",
      "energy-environment": "5",
      "safety-security": "6",
      "digital-transformation": "7",
      "green-transformation": "8",
      "startup-support": "9",
      "diversity-management": "10",
      "economic-security": "11",
      "regional-co-creation": "12",
      "femtech": "13",
      "data-ai-utilization": "14",
      "cashless": "15"
    };
    
    return themeNameToIdMap[themeId] || null;
  };

  // サンプルデータ用のテーマID変換関数
  const convertThemeIdForSampleData = (themeId: string): string | null => {
    if (themeId === "all") return null;
    
    const themeIdMap: Record<string, string> = {
      "startup-support": "startup",
      "digital-transformation": "dx",
      "green-transformation": "green",
      "economic-security": "security",
      "regional-co-creation": "regional",
      "femtech": "femtech",
      "data-ai-utilization": "ai",
      "cashless": "cashless",
      "economy-industry": "economy",
      "external-economy": "external",
      "manufacturing-it-distribution-services": "manufacturing",
      "sme-regional-economy": "sme",
      "safety-security": "safety",
      "energy-environment": "energy",
      "diversity-management": "diversity"
    };
    
    return themeIdMap[themeId] || null;
  };

  // 現在選択されているテーマの状態を管理
  const [currentTheme, setCurrentTheme] = useState<string>("all");
  
  // 初期化済みフラグを追加
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期化処理
  useEffect(() => {
    // 既に初期化済みの場合はスキップ
    if (isInitialized) {
      devLog("⏭️ 既に初期化済みのためスキップ");
      return;
    }

    devLog("🚀 コンポーネント初期化開始");
    
    // 初期化開始時にローディング状態を設定
    setPageState("loading");
    
    // 初期化時はデフォルトの「すべて」を選択
    const initialSelectedTheme = policyThemes.find(t => t.isSelected)?.id || "all";
    devLog(" 初期選択テーマ:", initialSelectedTheme);
    
    setCurrentTheme(initialSelectedTheme);
    
    if (initialArticles.length > 0) {
      // 初期データがある場合は、それを変換して表示
      devLog("🔍 初期データを変換中...");
      
      const convertInitialArticles = async () => {
        try {
          // データ変換中はローディング状態を維持
          // devLog("🔄 初期データの変換中...");
          const articles = await Promise.all(
            initialArticles.map(convertPolicyProposalToExpertArticle)
          );
          setFilteredArticles(articles);
          setDataSource('api');
          setPageState("success");
          // devLog("✅ 初期データ変換完了:", articles.length, "件");
          
          // 初期化完了フラグを設定
          // setIsInitialized(true); // この行は、初期データがある場合は、データ取得完了時に設定
        } catch (error) {
          devError("❌ 初期データ変換エラー:", error);
          setFilteredArticles([]);
          setDataSource('api');
          setPageState("error");
        }
      };
      
      convertInitialArticles().finally(() => {
        setIsInitialized(true);
        devLog("✅ 初期化完了");
      });
    } else {
      // 初期データがない場合は、認証状態を確認してからデータを取得
      devLog("🔍 初期データがないため、認証状態を確認してデータを取得");
      
      const checkAuthAndFetchData = async () => {
        try {
          const authenticated = isAuthenticated();
          devLog("🔐 認証状態:", authenticated ? "認証済み" : "未認証");
          
          if (authenticated) {
            // 認証済みの場合は、デフォルトテーマ（「すべて」）のデータを取得
            // devLog("🔍 認証済みのため、デフォルトテーマのデータを取得");
            
            const apiParams = {
              status: "published" as const,
              limit: 50
            };
            
            const policyProposals = await getPolicyProposals(apiParams);
            
            if (policyProposals.length > 0) {
              // データ変換
              const articlesPromises = policyProposals.map(convertPolicyProposalToExpertArticle);
              const articles = await Promise.all(articlesPromises);
              
              setFilteredArticles(articles);
              setDataSource('api');
              setPageState("success");
              // devLog("✅ デフォルトテーマのデータ変換完了:", articles.length, "件");
            } else {
              // データがない場合は空の状態で成功
              setFilteredArticles([]);
              setDataSource('api');
              setPageState("success");
              // devLog("✅ デフォルトテーマのデータなし");
            }
          } else {
            // 未認証の場合は、公開APIを使用してデータを取得
            devLog("🔍 未認証のため、公開APIを使用してデータを取得");
            
            // 公開APIのエンドポイントを直接呼び出し
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/policy-proposals/public/?status=published&limit=50`);
            
            if (response.ok) {
              const policyProposals = await response.json();
              
              if (policyProposals.length > 0) {
                // データ変換
                const articlesPromises = policyProposals.map(convertPolicyProposalToExpertArticle);
                const articles = await Promise.all(articlesPromises);
                
                setFilteredArticles(articles);
                setDataSource('api');
                setPageState("success");
                devLog("✅ 公開APIからのデータ変換完了:", articles.length, "件");
              } else {
                // データがない場合は空の状態で成功
                setFilteredArticles([]);
                setDataSource('api');
                setPageState("success");
                devLog("✅ 公開APIからのデータなし");
              }
            } else {
              throw new Error(`公開APIエラー: ${response.status}`);
            }
          }
        } catch (error) {
          devError("❌ データ取得エラー:", error);
          setFilteredArticles([]);
          setDataSource('api');
          setPageState("error");
          devLog("✅ エラーのため空の状態で完了");
        } finally {
          setIsInitialized(true);
          devLog("✅ 初期化完了");
        }
      };

      checkAuthAndFetchData();
    }
  }, [initialArticles, isInitialized]); // 依存配列にisInitializedを追加

  // オーバーレイ状態変更時の処理
  useEffect(() => {
    // 初期化が完了していない場合は何もしない
    if (!isInitialized) {
      return;
    }
    
    // オーバーレイが開いた場合の処理
    if (overlayState.isOpen) {
      // devLog("🎭 オーバーレイが開きました");
      // 必要に応じて追加の処理
    } else {
      // devLog("🎭 オーバーレイが閉じました");
      // オーバーレイが閉じられた時の処理
      // ローディング中は状態を変更しない
      if (pageState === "idle") {
        setPageState("success");
      }
      // pageState === "loading"の場合は何もしない（ローディング状態を維持）
    }
  }, [overlayState.isOpen, isInitialized, pageState]);

  // テーマ選択時の処理
  const handleThemeChange = useCallback((themeId: string) => {
    // devLog(" テーマ選択処理開始:", themeId);
    
    // オーバーレイが開いている場合は処理をスキップ
    if (overlayState.isOpen) {
      // devLog("⏭️ オーバーレイが開いているためテーマ変更をスキップ");
      return;
    }
    
    // テーマIDをそのまま使用（policyThemesのidと一致）
    const actualThemeId = themeId;
    
    // 現在のテーマを更新
    setCurrentTheme(actualThemeId);
    
    // 即座にローディング状態を設定
    setPageState("loading");
    
    // 記事をフィルタリング（filterArticles内でローディング状態が設定される）
    devLog(" テーマ変更時の記事フィルタリング開始");
    filterArticles(actualThemeId, "");
    
    devLog("✅ テーマ選択完了:", {
      selectedTheme: themeId,
      actualThemeId: actualThemeId,
      currentTheme: actualThemeId,
      timestamp: new Date().toISOString()
    });
  }, [filterArticles, overlayState.isOpen]);

  // 検索処理
  const handleSearch = useCallback((query: string) => {
    devLog(" 検索処理開始:", query, "現在のテーマ:", currentTheme);
    
    // オーバーレイが開いている場合は処理をスキップ
    if (overlayState.isOpen) {
      // devLog("⏭️ オーバーレイが開いているため検索処理をスキップ");
      return;
    }
    
    // 即座にローディング状態を設定
    setPageState("loading");
    
    // filterArticles内でローディング状態が設定される
    filterArticles(currentTheme, query);
  }, [filterArticles, currentTheme, overlayState.isOpen]);

  // 記事クリック処理（オーバーレイを開く）
  const handleArticleClick = (article: ExpertArticle) => {
    setOverlayState({
      isOpen: true,
      selectedArticle: article
    });
  };

  // オーバーレイ閉じる処理
  const handleOverlayClose = () => {
    setOverlayState({
      isOpen: false,
      selectedArticle: null
    });
  };

  // 詳細ページへ遷移
  const _handleViewDetail = (article: ExpertArticle) => {
    router.push(`/expert/articles/${article.id}`);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col overflow-hidden">
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
      <ExpertHeader />
      
      {/* 政策テーマ選択 */}
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[65px] pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-[120px] pb-4">
        <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-12 xl:mb-16">
          <PolicyThemeSelector 
            onThemeChange={handleThemeChange}
            onSearchChange={handleSearch}
          />
        </div>
      </div>
      
      {/* 選択されたテーマのタイトル - レスポンシブ対応 */}
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[72px] pb-4 sm:pb-6 md:pb-8">
        <div className="h-8 sm:h-10 md:h-12 lg:h-16 xl:h-[24.892px] w-full">
          <div className="flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold h-full justify-center leading-tight lg:leading-[22px] text-[#fff9f9] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[22px] text-left tracking-wide lg:tracking-[3px] w-full">
            <p className="adjustLetterSpacing block">
              {policyThemes.find(t => t.id === currentTheme)?.name || "政策テーマを選ぶ"}
            </p>
          </div>
        </div>
      </div>
      
      {/* 記事エリア */}
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[65px] pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <div className="bg-white w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px] 2xl:h-[1000px] rounded-lg lg:rounded-[11.759px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 shadow-lg">
          {/* データソース表示 */}
          <DataSourceIndicator dataSource={dataSource} />
          
          {/* ローディング・エラー表示 */}
          <LoadingErrorStates pageState={pageState} />
          
          {/* 記事一覧 */}
          {pageState === "success" && filteredArticles.length > 0 && (
            <div className="p-3 sm:p-4 md:p-5 lg:p-6">
              <ArticleList 
                articles={filteredArticles} 
                onArticleClick={handleArticleClick} 
              />
            </div>
          )}
          
          {/* 記事がない場合のメッセージ */}
          {pageState === "success" && filteredArticles.length === 0 && (
            <EmptyState />
          )}
        </div>
      </div>
      
      {/* オーバーレイ */}
      {overlayState.isOpen && overlayState.selectedArticle && (
        <ArticleOverlay 
          article={overlayState.selectedArticle}
          isOpen={overlayState.isOpen}
          onClose={handleOverlayClose}
        />
      )}
    </div>
  );
}  