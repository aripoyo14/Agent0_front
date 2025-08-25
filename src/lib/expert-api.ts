import { apiFetch } from "./apiClient";
import { PolicyProposal, PolicyProposalComment, UserInfo, UsersInfoResponse } from "@/types";
import { getToken } from "./storage";

// 認証状態の詳細ログ出力関数
function logAuthStatus() {
  const _tokenData = getToken();
  // console.log("🔐 認証状態詳細:", {
  //   isAuthenticated: isAuthenticated(),
  //   hasAccessToken: !!_tokenData.accessToken,
  //   tokenType: _tokenData.tokenType,
  //   tokenLength: _tokenData.accessToken?.length,
  //   tokenPreview: _tokenData.accessToken?.substring(0, 30) + "...",
  //   currentUrl: typeof window !== 'undefined' ? window.location.href : 'server-side',
  //   userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server-side'
  // });
}

// 政策提案コメント投稿のリクエスト型
export interface PolicyCommentRequest {
  policy_proposal_id: string;
  author_type: "admin" | "staff" | "contributor";
  author_id: string;
  comment_text: string;
  parent_comment_id?: string | null;
}

// 政策提案コメント投稿のレスポンス型
export interface PolicyCommentResponse {
  success: boolean;
  comment_id: string;
  message: string;
}

// コメント数取得のレスポンス型
export interface CommentCountResponse {
  policy_proposal_id: string;
  comment_count: number;
}

// 政策提案作成（添付ファイル付き）のリクエスト型
export interface PolicyProposalWithAttachmentsRequest {
  title: string;
  body: string;
  published_by_user_id: string;
  status?: string;
  files?: File[];
  policy_tag_ids?: number[];
}

// 政策提案作成（添付ファイル付き）のレスポンス型
export interface PolicyProposalWithAttachmentsResponse {
  success: boolean;
  proposal_id: string;
  attachments: Array<{
    id: string;
    file_name: string;
    file_url: string;
    file_type: string;
    file_size: number;
  }>;
  message: string;
}

// 政策提案コメント投稿API
export async function submitPolicyComment(data: PolicyCommentRequest): Promise<PolicyCommentResponse> {
  return apiFetch("/api/policy-proposal-comments/", {
    method: "POST",
    body: data,
    auth: true,
  });
}

// 政策提案作成（添付ファイル付き）API
export async function createPolicyProposalWithAttachments(
  data: PolicyProposalWithAttachmentsRequest
): Promise<PolicyProposalWithAttachmentsResponse> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("body", data.body);
  formData.append("published_by_user_id", data.published_by_user_id);
  formData.append("status", data.status || "draft");
  
  // 政策テーマIDを追加
  if (data.policy_tag_ids && data.policy_tag_ids.length > 0) {
    formData.append("policy_tag_ids", JSON.stringify(data.policy_tag_ids));
  }
  
  if (data.files) {
    data.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  return apiFetch("/api/policy-proposals/with-attachments", {
    method: "POST",
    body: formData,
    auth: true,
  });
}

// 政策提案コメント一覧取得API
export async function getPolicyComments(policyProposalId: string): Promise<PolicyProposalComment[]> {
  return apiFetch(`/api/policy-proposal-comments/?policy_proposal_id=${policyProposalId}`, {
    method: "GET",
    auth: true,
  });
}

// コメントのいいねAPI（必要に応じて）
export async function likeComment(commentId: string): Promise<{ success: boolean; likeCount: number }> {
  return apiFetch(`/api/policy-proposal-comments/${commentId}/like`, {
    method: "POST",
    auth: true,
  });
}

// コメントのいいね解除API（必要に応じて）
export async function unlikeComment(commentId: string): Promise<{ success: boolean; likeCount: number }> {
  return apiFetch(`/api/policy-proposal-comments/${commentId}/unlike`, {
    method: "DELETE",
    auth: true,
  });
}

// コメント数取得API
export async function getCommentCount(policyProposalId: string): Promise<CommentCountResponse> {
  return apiFetch(`/api/policy-proposal-comments/policy-proposals/${policyProposalId}/comment-count`, {
    method: "GET",
    auth: true,
  });
}

// ========== Policy Proposal APIs (Backend Integration) ==========
// 政策提案一覧取得API（段階的フォールバック付き）
export async function getPolicyProposals(params?: {
  status?: "draft" | "published" | "archived";
  q?: string;
  offset?: number;
  limit?: number;
}): Promise<PolicyProposal[]> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.q) queryParams.append('q', params.q);
  if (params?.offset) queryParams.append('offset', params.offset.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  // 認証状態をログ出力
  logAuthStatus();
  
  try {
    const result = await apiFetch<PolicyProposal[]>(`/api/policy-proposals/?${queryParams}`, {
      method: "GET",
      auth: true,
    });
    return result;
  } catch (error) {
    console.error("❌ 認証付きAPI呼び出し失敗:", error);
    
    // 認証エラーの詳細をログ出力
    if (error instanceof Error) {
      console.error("🔍 エラー詳細:", {
        message: error.message,
        stack: error.stack,
        isAuthError: error.message.includes("credentials") || error.message.includes("401")
      });
    }
    
    // 認証エラーの場合は、公開APIを試行
    if (error instanceof Error && 
        (error.message.includes("credentials") || error.message.includes("401"))) {
      console.log("🔄 認証エラーのため、公開APIを試行...");
      try {
        const publicResult = await getPublicPolicyProposals(params);
        // console.log("✅ 公開API呼び出し成功:", publicResult);
        return publicResult;
      } catch (publicError) {
        console.error("❌ 公開APIも失敗:", publicError);
        throw error; // 元のエラーを再スロー
      }
    }
    
    throw error; // 認証以外のエラーはそのまま再スロー
  }
}

// 公開API（認証なし）の実装
async function getPublicPolicyProposals(params?: {
  status?: "draft" | "published" | "archived";
  q?: string;
  offset?: number;
  limit?: number;
}): Promise<PolicyProposal[]> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.q) queryParams.append('q', params.q);
  if (params?.offset) queryParams.append('offset', params.offset.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  console.log("🌐 公開API呼び出し開始...");
  return await apiFetch<PolicyProposal[]>(`/api/policy-proposals/public/?${queryParams}`, {
    method: "GET",
    auth: false,
  });
}

// 政策提案詳細取得API
export async function getPolicyProposalById(id: string): Promise<PolicyProposal> {
  return apiFetch(`/api/policy-proposals/${id}`, {
    method: "GET",
    auth: true,
  });
}

// 政策提案コメント一覧取得API
export async function getPolicyProposalComments(id: string, limit = 50, offset = 0): Promise<PolicyProposalComment[]> {
  return apiFetch(`/api/policy-proposals/${id}/comments?limit=${limit}&offset=${offset}`, {
    method: "GET",
    auth: true,
  });
}

// ユーザー情報取得API
export async function getUserInfo(userId: string): Promise<UserInfo> {
  return apiFetch(`/api/users/${userId}`, {
    method: "GET",
    auth: true,
  });
}

// 複数ユーザーの情報を一括取得するAPI
export async function getUsersInfo(userIds: string[]): Promise<UsersInfoResponse> {
  const queryParams = new URLSearchParams();
  userIds.forEach(id => queryParams.append('user_ids', id));
  
  return apiFetch(`/api/users/batch?${queryParams}`, {
    method: "GET",
    auth: true,
  });
}

// 特定の政策テーマタグに紐づく政策案を取得
export async function getPolicyProposalsByTag(
  tagId: string,
  params?: {
    status?: "draft" | "published" | "archived";
    q?: string;
    offset?: number;
    limit?: number;
  }
): Promise<PolicyProposal[]> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.q) queryParams.append('q', params.q);
  if (params?.offset) queryParams.append('offset', params.offset.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  try {
    const result = await apiFetch<PolicyProposal[]>(`/api/policy-proposals/by-tag/${tagId}?${queryParams}`, {
      method: "GET",
      auth: true,
    });
    return result;
  } catch (error) {
    
    // 認証エラーの場合は、公開APIを試行
    if (error instanceof Error && 
        (error.message.includes("credentials") || error.message.includes("401"))) {
      try {
        const publicResult = await getPublicPolicyProposalsByTag(tagId, params);
        return publicResult;
      } catch {
        throw error;
      }
    }
    
    throw error;
  }
}

// 公開API（認証なし）の実装
async function getPublicPolicyProposalsByTag(
  tagId: string,
  params?: {
    status?: "draft" | "published" | "archived";
    q?: string;
    offset?: number;
    limit?: number;
  }
): Promise<PolicyProposal[]> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.q) queryParams.append('q', params.q);
  if (params?.offset) queryParams.append('offset', params.offset.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  console.log("🌐 公開タグID別API呼び出し開始:", tagId);
  return await apiFetch<PolicyProposal[]>(`/api/policy-proposals/public/by-tag/${tagId}?${queryParams}`, {
    method: "GET",
    auth: false,
  });
}
