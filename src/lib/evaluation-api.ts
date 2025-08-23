import { apiFetch } from "./apiClient";

// 評価データの型定義
export interface EvaluationData {
  overallRating: number; // 1-5
  empathyRating: number; // 1-5
  aiResponse?: string; // AI返信（オプション）
}

// バックエンドの評価データ型
interface BackendEvaluationData {
  evaluation: number; // 1-5：悪い-良い
  stance: number; // 1-5：否定的-肯定的
}

// 評価レスポンス型
interface EvaluationResponse {
  id: string;
  evaluation: number | null;
  stance: number | null;
  updated_at: string;
}

// コメント投稿用の型定義
interface CommentReplyData {
  author_type: "admin" | "staff" | "contributor" | "viewer";
  author_id: string;
  comment_text: string;
}

// フロントエンドの評価をバックエンド形式に変換
function convertToBackendFormat(data: EvaluationData): BackendEvaluationData {
  return {
    evaluation: data.overallRating, // 意見の総合評価 → 純粋な評価
    stance: data.empathyRating, // 政策への共感度 → スタンス
  };
}

// コメントの評価を保存
export async function saveCommentEvaluation(
  commentId: string,
  evaluationData: EvaluationData
): Promise<EvaluationResponse> {
  const backendData = convertToBackendFormat(evaluationData);
  
  const response = await apiFetch<EvaluationResponse>(
    `/api/policy-proposal-comments/${commentId}/rating`,
    {
      method: "PATCH",
      body: backendData,
      auth: true,
    }
  );
  
  return response;
}

// コメントの評価を取得
export async function getCommentEvaluation(
  commentId: string
): Promise<EvaluationResponse | null> {
  try {
    const response = await apiFetch<EvaluationResponse>(
      `/api/policy-proposal-comments/${commentId}`,
      {
        method: "GET",
        auth: true,
      }
    );
    
    return response;
  } catch (error) {
    console.error('評価取得エラー:', error);
    return null;
  }
}

// AI返信生成
export async function generateAIResponse(
  commentId: string,
  options: {
    persona?: string;
    instruction?: string;
  } = {}
): Promise<{ suggested_reply: string }> {
  const response = await apiFetch<{ suggested_reply: string }>(
    `/api/policy-proposal-comments/${commentId}/ai-reply`,
    {
      method: "POST",
      body: {
        author_type: "staff", // デフォルト値
        author_id: "00000000-0000-0000-0000-000000000000", // ダミーID
        persona: options.persona || "丁寧で建設的な政策担当者",
        instruction: options.instruction || null,
      },
      auth: true,
    }
  );
  
  return response;
}

// AI返信をコメントとして投稿
export async function postAIResponse(
  parentCommentId: string,
  aiResponse: string,
  authorInfo: {
    author_type: "admin" | "staff" | "contributor" | "viewer";
    author_id: string;
  }
): Promise<unknown> {
  const replyData: CommentReplyData = {
    author_type: authorInfo.author_type,
    author_id: authorInfo.author_id,
    comment_text: aiResponse,
  };
  
  const response = await apiFetch(
    `/api/policy-proposal-comments/${parentCommentId}/replies`,
    {
      method: "POST",
      body: replyData,
      auth: true,
    }
  );
  
  return response;
}
