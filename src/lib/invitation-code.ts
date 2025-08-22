import { apiFetch } from "./apiClient";

export interface InvitationCodeCreate {
  code_type: "expert" | "user";
  max_uses: number;
  expires_in_hours: number;
  description?: string;
}

export interface InvitationCodeResponse {
  code: string;
  invitation_link: string;
  qr_code_data: string;
  code_type: "expert" | "user";
  max_uses: number;
  expires_at: string;
  description?: string;
  message: string;
}

export interface InvitationCode {
  code: string;
  code_type: "expert" | "user";
  max_uses: number;
  used_count: number;
  expires_at: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

// QRコード生成のレスポンス型を定義
export interface QRCodeResponse {
  qr_code: string;
}

// 招待コード用のQRコード生成
export async function generateInvitationQRCode(code: string): Promise<string> {
  console.log("generateInvitationQRCode 呼び出し:", code);
  try {
    const response = await apiFetch<QRCodeResponse>(`/api/invitation-codes/generate-qr/${code}`);
    console.log("generateInvitationQRCode 成功:", response);
    return response.qr_code;
  } catch (error) {
    console.error("generateInvitationQRCode エラー:", error);
    throw error;
  }
}

// 招待コードを発行
export async function generateInvitationCode(data: InvitationCodeCreate): Promise<InvitationCodeResponse> {
  console.log("generateInvitationCode 呼び出し:", data);
  try {
    const result = await apiFetch<InvitationCodeResponse>("/api/invitation-codes/generate", {
      method: "POST",
      body: data,
      auth: true,
    });
    console.log("generateInvitationCode 成功:", result);
    return result;
  } catch (error) {
    console.error("generateInvitationCode エラー:", error);
    throw error;
  }
}

// 自分が発行した招待コード一覧を取得
export async function getMyInvitationCodes(): Promise<{ codes: InvitationCode[] }> {
  return await apiFetch<{ codes: InvitationCode[] }>("/api/invitation-codes/my-codes", {
    method: "GET",
    auth: true,
  });
}

// 招待コードを無効化
export async function deactivateInvitationCode(code: string): Promise<{ message: string }> {
  return await apiFetch<{ message: string }>(`/api/invitation-codes/${code}`, {
    method: "DELETE",
    auth: true,
  });
}
