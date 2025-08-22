import { apiFetch } from "./apiClient";
import { MFAResponse } from "./mfa";

// フォーム用の型（password_confirmを含む）
export interface ExpertRegistrationFormData {
  last_name: string;
  first_name: string;
  email: string;
  self_pr: string;
  password: string;
  password_confirm: string;
}

// API用の型（password_confirmを含まない）
export interface ExpertRegistrationData {
  last_name: string;
  first_name: string;
  email: string;
  self_pr: string;
  password: string;
}

// エキスパート登録（招待コード対応）
export async function registerExpert(
  data: ExpertRegistrationData, 
  invitationCode?: string | null
): Promise<MFAResponse> {
  const url = invitationCode 
    ? `/api/experts/register?invitation_code=${encodeURIComponent(invitationCode)}`
    : "/api/experts/register";
    
  return apiFetch<MFAResponse>(url, {
    method: "POST",
    body: data,
  });
}
