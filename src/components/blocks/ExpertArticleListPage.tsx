"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ExpertArticle, ExpertPageState, PolicyProposal } from "@/types";
import { policyThemes, getArticlesByTheme, searchArticles } from "@/data/expert-articles-data";
import { getPolicyProposals, getPolicyProposalsByTag } from "@/lib/expert-api";
import { isAuthenticated } from "@/lib/storage";
import { getUserNameFromAPI, debugToken, testAuth, getUserName } from "@/lib/auth";
// import { PolicyThemeSelector } from "@/components/ui/PolicyThemeSelector";
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
      <ExpertHeader />
      
      {/* 政策テーマ選択 */}
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[65px] pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-[120px] pb-4">
        <div className="mb-1 sm:mb-2 md:mb-3 lg:mb-4 xl:mb-6 relative">
          <h3 className="absolute -top-6 left-0 font-['Noto_Sans_JP'] font-bold text-white text-xs tracking-[2px]">
            政策テーマを選択する
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
            {[
              { 
                id: "economy-industry", 
                title: "経済産業",
                description: "国内外の経済動向を踏まえた産業政策や経済成長戦略を推進する分野。"
              },
              { 
                id: "external-economy", 
                title: "対外経済",
                description: "国際経済関係や貿易・投資促進、国際協力を通じた経済成長の実現。"
              },
              { 
                id: "manufacturing-it-distribution-services", 
                title: "ものづくり/情報/流通・サービス",
                description: "製造業や情報通信、物流・流通、サービス産業の高度化と競争力強化。"
              },
              { 
                id: "sme-regional-economy", 
                title: "中小企業・地域経済産業",
                description: "中小企業の成長支援と地域産業の活性化を促進する分野。"
              },
              { 
                id: "energy-environment", 
                title: "エネルギー・環境",
                description: "安定したエネルギー供給と環境保護、脱炭素社会の実現を目指す政策。"
              },
              { 
                id: "safety-security", 
                title: "安全・安心",
                description: "国民生活や企業活動の安全確保、防災・減災、危機管理体制の強化。"
              },
              { 
                id: "digital-transformation", 
                title: "DX",
                description: "デジタル技術を活用して業務変革や新たな価値創造を行う取り組み。"
              },
              { 
                id: "green-transformation", 
                title: "GX",
                description: "環境負荷低減と経済成長の両立を図るグリーントランスフォーメーション。"
              },
              { 
                id: "startup-support", 
                title: "スタートアップ支援",
                description: "新規事業創出やベンチャー企業の成長支援、資金調達や規制緩和の推進。"
              },
              { 
                id: "diversity-management", 
                title: "ダイバーシティ経営",
                description: "多様な人材の活躍を促進し、企業価値向上を図る経営戦略。"
              },
              { 
                id: "economic-security", 
                title: "経済安全保障",
                description: "経済活動における安全確保や重要物資・技術の保護、サプライチェーン強化。"
              },
              { 
                id: "regional-co-creation", 
                title: "地域共創",
                description: "地域資源を活かし、自治体・企業・住民が協力して地域課題を解決。"
              },
              { 
                id: "femtech", 
                title: "フェムテック",
                description: "女性の健康課題解決を支援するテクノロジーや製品・サービスの開発促進。"
              },
              { 
                id: "data-ai-utilization", 
                title: "データ・AI活用",
                description: "ビッグデータやAIを活用して業務効率化や新たな価値創出を実現。"
              },
              { 
                id: "cashless", 
                title: "キャッシュレス",
                description: "現金に依存しない決済手段の普及促進と関連インフラの整備。"
              }
            ].map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <div key={theme.id} className="relative group">
                  <button
                    onClick={() => handleThemeChange(theme.id)}
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
                      {theme.title}
                    </span>
                  </button>
                  
                  {/* ホバー時のツールチップ - レスポンシブ対応 */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 sm:px-4 py-3 bg-gray-900/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-[280px] sm:w-[400px] lg:w-[500px] whitespace-normal shadow-lg">
                    <div className="font-bold mb-2 text-sm">{theme.title}</div>
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
      
      {/* 選択されたテーマのタイトルと検索バー - レスポンシブ対応 */}
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[72px] pb-1 sm:pb-2 md:pb-3 lg:pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8">
          {/* テーマタイトル */}
          <div className="h-8 sm:h-10 md:h-12 lg:h-16 xl:h-[24.892px] w-full lg:w-auto">
            <div className="flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold h-full justify-center leading-tight lg:leading-[22px] text-[#fff9f9] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[22px] text-left tracking-wide lg:tracking-[3px] w-full">
              <p className="adjustLetterSpacing block">
                {policyThemes.find(t => t.id === currentTheme)?.name || "政策テーマを選ぶ"}
              </p>
            </div>
          </div>
          
          {/* 検索バー - テーマタイトルの横に配置 */}
          <div className="relative w-full lg:w-64 xl:w-80">
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
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-sm sm:text-base text-gray-700 placeholder:text-gray-400 font-medium tracking-wide"
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                />
                {/* 検索クリアボタン */}
                <button
                  onClick={() => handleSearch("")}
                  className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  aria-label="検索をクリア"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 記事エリア */}
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-16 xl:px-[65px] pb-8 sm:pb-12 md:pb-16 lg:pb-20">
        <div className="bg-white w-full h-[280px] sm:h-[320px] md:h-[350px] lg:h-[380px] xl:h-[350px] 2xl:h-[420px] rounded-lg lg:rounded-[11.759px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 shadow-lg">
          {/* データソース表示 */}
          <DataSourceIndicator dataSource={dataSource} />
          
          {/* ローディング・エラー表示 */}
          <LoadingErrorStates pageState={pageState} />
          
          {/* 記事一覧 */}
          {pageState === "success" && filteredArticles.length > 0 && (
            <div className="p-0">
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