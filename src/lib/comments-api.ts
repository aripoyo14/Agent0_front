import { getToken } from "./storage";
import { apiFetch } from "./apiClient";

export interface Comment {
  id: string;
  policy_proposal_id: string;
  author_type: string;
  author_id: string;
  author_name: string;
  comment_text: string;
  parent_comment_id: string | null;
  posted_at: string;
  like_count: number;
  is_deleted: boolean;
  evaluation: number | null;
  stance: number | null;
}

export async function fetchCommentsByPolicyId(
  policyId: string, 
  limit: number = 50, 
  offset: number = 0
): Promise<Comment[]> {
  try {
    const apiUrl = `/api/policy-proposals/${policyId}/comments?limit=${limit}&offset=${offset}`;
    
    // 認証トークンを取得
    const { accessToken, tokenType } = getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 認証ヘッダーを追加
    if (accessToken) {
      headers['Authorization'] = `${tokenType || "Bearer"} ${accessToken}`;
    }
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
      credentials: 'include', // クッキーも含める
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('コメント取得エラー:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const comments = await response.json();
    return comments;
  } catch (error) {
    console.error('コメント取得エラー:', error);
    return [];
  }
}

// 返信コメントを取得する関数（新しいバックエンドエンドポイントを使用）
export async function fetchRepliesByCommentId(parentCommentId: string, limit: number = 20, offset: number = 0): Promise<{
  replies: Comment[];
  total_count: number;
  has_more: boolean;
}> {
  try {
    const response = await apiFetch<{
      replies: Comment[];
      total_count: number;
      has_more: boolean;
    }>(`/api/policy-proposal-comments/${parentCommentId}/replies?limit=${limit}&offset=${offset}`, { auth: true });
    
    return response;
  } catch (error) {
    console.error('返信コメント取得エラー:', error);
    // エラーの詳細を確認
    if (error instanceof Error) {
      if (error.message.includes('Invalid comment ID format')) {
        throw new Error('無効なコメントIDです');
      } else if (error.message.includes('Parent comment not found')) {
        throw new Error('コメントが見つかりません');
      } else {
        throw new Error('返信コメントの取得に失敗しました');
      }
    }
    throw new Error('返信コメントの取得に失敗しました');
  }
}

export async function fetchReplyCountByCommentId(parentCommentId: string): Promise<number> {
  try {
    const response = await apiFetch<{ reply_count: number }>(`/api/policy-proposal-comments/${parentCommentId}/replies/count`, { auth: true });
    return response.reply_count || 0;
  } catch (error) {
    console.error('返信コメント数取得エラー:', error);
    // エラーの詳細を確認
    if (error instanceof Error) {
      if (error.message.includes('Invalid comment ID format')) {
        throw new Error('無効なコメントIDです');
      } else if (error.message.includes('Parent comment not found')) {
        throw new Error('コメントが見つかりません');
      } else {
        throw new Error('返信コメント数の取得に失敗しました');
      }
    }
    return 0;
  }
}

// コメントを親コメントと返信に分類する関数
export function organizeComments(comments: Comment[]): {
  parentComments: Comment[];
  repliesByParent: Record<string, Comment[]>;
} {
  const parentComments = comments.filter(comment => !comment.parent_comment_id);
  const repliesByParent: Record<string, Comment[]> = {};
  
  comments.forEach(comment => {
    if (comment.parent_comment_id) {
      if (!repliesByParent[comment.parent_comment_id]) {
        repliesByParent[comment.parent_comment_id] = [];
      }
      repliesByParent[comment.parent_comment_id].push(comment);
    }
  });
  
  return { parentComments, repliesByParent };
}
