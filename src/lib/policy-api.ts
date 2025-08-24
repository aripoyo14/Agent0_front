// 政策関連のAPIクライアント関数

import { apiFetch } from './apiClient';

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
