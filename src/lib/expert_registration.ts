import { apiFetch } from "./apiClient";
import { MFAResponse } from "./mfa";

// フォーム用の型（password_confirmを含む）
export interface ExpertRegistrationFormData {
  last_name: string;
  first_name: string;
  company_name: string;
  department: string;
  email: string;
  password: string;
  password_confirm: string;
}

// API用の型（password_confirmを含まない）
export interface ExpertRegistrationData {
  last_name: string;
  first_name: string;
  company_name: string;
  department: string;
  email: string;
  password: string;
}

// エキスパート登録
export async function registerExpert(data: ExpertRegistrationData): Promise<MFAResponse> {
  return apiFetch<MFAResponse>("/api/experts/register", {
    method: "POST",
    body: data,
  });
}
