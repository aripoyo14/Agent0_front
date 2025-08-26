import { useState, useEffect, useCallback, useMemo } from 'react';
import { Comment } from '@/lib/comments-api';
import { fetchCommentsByPolicyId, getFeedbackStates } from '@/lib/comments-api';

interface UsePolicyCommentsReturn {
  comments: Comment[];
  loading: boolean;
  error: string | null;
  feedbackStates: Set<string>;
  refreshComments: () => Promise<void>;
}

export const usePolicyComments = (policyId: string | null): UsePolicyCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フィードバック状態をメモ化して不要な再計算を防ぐ
  const feedbackStates = useMemo(() => 
    getFeedbackStates(comments), [comments]
  );

  const loadComments = useCallback(async () => {
    if (!policyId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const fetchedComments = await fetchCommentsByPolicyId(policyId);
      setComments(fetchedComments);
    } catch (err) {
      console.error('コメント取得エラー:', err);
      setError(err instanceof Error ? err.message : 'コメントの取得に失敗しました');
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [policyId]);

  // コメント一覧を再取得する関数
  const refreshComments = useCallback(async () => {
    await loadComments();
  }, [loadComments]);

  // 政策IDが変更された時にコメントを取得
  useEffect(() => {
    loadComments();
  }, [loadComments]);

  return {
    comments,
    loading,
    error,
    feedbackStates,
    refreshComments,
  };
};
