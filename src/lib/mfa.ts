import { apiFetch } from "./apiClient";

export interface MFAResponse {
  message: string;
  user_id: string;
  mfa_setup_required: boolean;
  totp_secret: string;
  backup_codes: string[];
  qr_code_url: string;
  next_step: string;
}

export interface MFASetupRequest {
  user_id: string;
  totp_secret: string;
  backup_codes: string[];
}

// MFA設定完了
export async function completeMFASetup(data: MFASetupRequest): Promise<void> {
  return apiFetch("/api/mfa/setup-complete", {
    method: "POST",
    body: data,
  });
}

// QRコード生成
export async function generateQRCode(userId: string): Promise<string> {
  const response = await apiFetch(`/api/mfa/generate-qr/${userId}`);
  return response.qr_code;
}
