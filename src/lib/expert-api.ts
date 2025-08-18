import { apiFetch } from "./apiClient";
import { PolicyProposal, PolicyProposalComment } from "@/types";

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
  
  if (data.files) {
    data.files.forEach((file) => {
      formData.append("files", file);
    });
  }

  return apiFetch("/api/policy-proposal-with-attachments/", {
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
// 政策提案一覧取得API
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
  
  return apiFetch(`/api/policy-proposals/?${queryParams}`, {
    method: "GET",
    auth: true,
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
export async function getUserInfo(userId: string): Promise<{
  id: string;
  name: string;
  role: string;
  company: string;
  department?: string;
  title?: string;
  badges: Array<{
    type: string;
    label: string;
    color: string;
    description: string;
  }>;
  expertiseLevel: string;
}> {
  return apiFetch(`/api/users/${userId}`, {
    method: "GET",
    auth: true,
  });
}

// 複数ユーザーの情報を一括取得するAPI
export async function getUsersInfo(userIds: string[]): Promise<{
  [userId: string]: {
    id: string;
    name: string;
    role: string;
    company: string;
    department?: string;
    title?: string;
    badges: Array<{
      type: string;
      label: string;
      color: string;
      description: string;
    }>;
    expertiseLevel: string;
  };
}> {
  const queryParams = new URLSearchParams();
  userIds.forEach(id => queryParams.append('user_ids', id));
  
  return apiFetch(`/api/users/batch?${queryParams}`, {
    method: "GET",
    auth: true,
  });
}
