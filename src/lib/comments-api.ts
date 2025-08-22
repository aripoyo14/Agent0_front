import { getToken } from "./storage";

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
    console.log('コメント取得API URL:', apiUrl);
    console.log('環境変数 NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL);
    
    // 認証トークンを取得
    const { accessToken, tokenType } = getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // 認証ヘッダーを追加
    if (accessToken) {
      headers['Authorization'] = `${tokenType || "Bearer"} ${accessToken}`;
      console.log('認証ヘッダーを追加しました');
    } else {
      console.log('認証トークンが見つかりません');
    }
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
      credentials: 'include', // クッキーも含める
    });

    console.log('API レスポンスステータス:', response.status);
    console.log('API レスポンスヘッダー:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API エラーレスポンス:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const comments = await response.json();
    console.log('取得したコメント数:', comments.length);
    return comments;
  } catch (error) {
    console.error('コメント取得エラー:', error);
    return [];
  }
}
