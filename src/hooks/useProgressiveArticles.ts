import { useState, useEffect, useCallback } from 'react';
import { ExpertArticle, PolicyProposal } from '@/types';
import { getCachedCommentCountsBatch } from '@/lib/comment-cache';

interface UseProgressiveArticlesProps {
  initialProposals: PolicyProposal[];
  batchSize?: number;
  concurrency?: number;
}

interface ProgressiveLoadingState {
  articles: ExpertArticle[];
  loadingProgress: number; // 0-100
  isLoading: boolean;
  error: string | null;
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
        day: 'numeric'
      });
    }
  } catch {
    return dateString;
  }
};

// PolicyProposalをExpertArticleに変換（コメント数なし）
const convertWithoutCommentCount = (proposal: PolicyProposal): ExpertArticle => ({
  id: proposal.id,
  title: proposal.title,
  summary: proposal.body.substring(0, 100) + "...",
  content: proposal.body,
  department: "中小企業庁 地域産業支援課",
  publishedAt: formatDate(proposal.published_at || proposal.created_at),
  commentCount: 0, // 初期値は0
  themeId: proposal.policy_tags?.[0]?.id?.toString() || "startup",
  attachments: proposal.attachments || []
});

export const useProgressiveArticles = ({
  initialProposals,
  batchSize = 10,
  concurrency = 5
}: UseProgressiveArticlesProps) => {
  const [state, setState] = useState<ProgressiveLoadingState>({
    articles: [],
    loadingProgress: 0,
    isLoading: false,
    error: null
  });

  const loadCommentCounts = useCallback(async () => {
    if (initialProposals.length === 0) return;

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      loadingProgress: 0
    }));

    try {
      // 1. 即座に記事リストを表示（コメント数は0）
      const initialArticles = initialProposals.map(convertWithoutCommentCount);
      setState(prev => ({
        ...prev,
        articles: initialArticles,
        loadingProgress: 10
      }));

      // 2. バッチごとにコメント数を取得
      const proposalIds = initialProposals.map(p => p.id);
      const totalBatches = Math.ceil(proposalIds.length / batchSize);
      let completedBatches = 0;

      for (let i = 0; i < proposalIds.length; i += batchSize) {
        const batchIds = proposalIds.slice(i, i + batchSize);
        
        try {
          // 並列度を制限してコメント数を取得
          const commentCounts = await getCachedCommentCountsBatch(batchIds, concurrency);
          
          // 取得したコメント数で記事を更新
          setState(prev => ({
            ...prev,
            articles: prev.articles.map(article => 
              commentCounts.hasOwnProperty(article.id) 
                ? { ...article, commentCount: commentCounts[article.id] }
                : article
            ),
            loadingProgress: Math.min(90, 10 + (80 * (completedBatches + 1) / totalBatches))
          }));

          completedBatches++;
          
          // ユーザー体験向上のため少し待機
          if (completedBatches < totalBatches) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        } catch (error) {
          console.error(`バッチ ${i}-${i + batchSize} のコメント数取得エラー:`, error);
          // エラーが発生してもバッチを継続
        }
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        loadingProgress: 100
      }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'コメント数の取得に失敗しました',
        loadingProgress: 0
      }));
    }
  }, [initialProposals, batchSize, concurrency]);

  // 初期プロポーザルが変更されたら実行
  useEffect(() => {
    loadCommentCounts();
  }, [loadCommentCounts]);

  // 手動再読み込み機能
  const retry = useCallback(() => {
    loadCommentCounts();
  }, [loadCommentCounts]);

  return {
    ...state,
    retry
  };
};

// 開発環境でのデバッグ情報
export const useProgressiveArticlesDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    renderCount: 0,
    lastUpdate: new Date()
  });

  useEffect(() => {
    setDebugInfo(prev => ({
      renderCount: prev.renderCount + 1,
      lastUpdate: new Date()
    }));
  }, []);

  return debugInfo;
};
