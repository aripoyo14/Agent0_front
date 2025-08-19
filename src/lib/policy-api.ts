import { PolicySubmission } from '@/types';
import { samplePolicySubmissions } from '@/data/policy-data';
import { getToken } from './storage';

interface PolicySubmissionResponse {
  success: boolean;
  data: PolicySubmission[];
  error?: string;
}

export async function fetchMyPolicySubmissions(): Promise<PolicySubmission[]> {
  try {
    // 認証トークンを取得
    const tokenData = getToken();
    
    // 認証トークンがある場合は認証付きエンドポイント、ない場合はテスト用エンドポイントを使用
    const fallbackUserId = 'ccf94a13-9ebd-46b4-a1c5-f76741b28b0b';
    const apiEndpoint = tokenData.accessToken 
      ? '/api/policy-proposals/my-submissions'
      : `/api/policy-proposals/test-submissions/${fallbackUserId}`;
    
    console.log('使用するエンドポイント:', apiEndpoint);
    console.log('認証トークン:', tokenData.accessToken ? '存在' : 'なし');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // トークンが存在する場合はAuthorizationヘッダーに設定
    if (tokenData.accessToken) {
      headers['Authorization'] = `Bearer ${tokenData.accessToken}`;
    }

    // 認証トークンがある場合は認証付きエンドポイント、ない場合はテスト用エンドポイントを使用
    const testUserId = '581c56f8-6885-467d-a113-ffbbe65cd184';
    const _endpoint = tokenData.accessToken 
      ? '/api/policy-proposals/my-submissions'
      : `/api/policy-proposals/test-submissions/${testUserId}`;

    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: PolicySubmissionResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'データの取得に失敗しました');
    }

    return result.data;
  } catch (error) {
    console.error('政策投稿履歴取得エラー:', error);
    console.log('バックエンドAPIが利用できないため、サンプルデータを使用します');
    
    // バックエンドが利用できない場合はサンプルデータを返す（開発用）
    return samplePolicySubmissions;
  }
}
