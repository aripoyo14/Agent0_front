// 政策関連のAPIクライアント関数

import { apiFetch } from './apiClient';
import { PolicySubmission } from '@/types';

export interface PolicyFormData {
  selectedThemes: string[];
  policyTitle: string;
  policyContent: string;
  attachedFiles: File[];
}

export interface PolicySubmissionResponse {
  id: string;
  title: string;
  body: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// PolicySubmissionResponseをPolicySubmissionに変換
function convertToPolicySubmission(response: PolicySubmissionResponse): PolicySubmission {
  return {
    id: response.id,
    title: response.title,
    content: response.body,
    policyThemes: [], // APIからは取得できないため空配列
    submittedAt: response.created_at,
    status: response.status as PolicySubmission['status'],
    commentCount: 0, // APIからは取得できないため0
  };
}

// ユーザーの政策提案一覧を取得
export async function fetchMyPolicySubmissions(): Promise<PolicySubmission[]> {
  try {
    const response = await apiFetch<{success: boolean, data: PolicySubmissionResponse[]}>('/api/policy-proposals/my-submissions', {
      method: 'GET',
      auth: true,
    });
    
    // response.dataから配列を取得してからmapを実行
    return response.data.map(convertToPolicySubmission);
  } catch (error) {
    console.error('政策提案一覧の取得に失敗しました:', error);
    throw error;
  }
}

// 政策案を投稿
export async function submitPolicyProposal(formData: PolicyFormData): Promise<PolicySubmissionResponse> {
  try {
    const payload = {
      title: formData.policyTitle,
      body: formData.policyContent,
      status: "published" as const, // 投稿時はpublished
    };

    const response = await apiFetch<PolicySubmissionResponse>('/api/policy-proposals/', {
      method: 'POST',
      body: payload,
      auth: true,
    });

    return response;
  } catch (error) {
    console.error('政策案の投稿に失敗しました:', error);
    throw error;
  }
}

// 下書きとして保存
export async function savePolicyDraft(formData: PolicyFormData): Promise<PolicySubmissionResponse> {
  try {
    const payload = {
      title: formData.policyTitle,
      body: formData.policyContent,
      status: "draft" as const, // 下書き保存時はdraft
    };

    const response = await apiFetch<PolicySubmissionResponse>('/api/policy-proposals/', {
      method: 'POST',
      body: payload,
      auth: true,
    });

    return response;
  } catch (error) {
    console.error('下書きの保存に失敗しました:', error);
    throw error;
  }
}