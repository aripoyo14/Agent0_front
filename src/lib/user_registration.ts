import { apiFetch } from "./apiClient";
import { MFAResponse } from "./mfa";

// 部署情報の型
export interface Department {
  id: number;
  name: string;
  section?: string;
}

// 役職情報の型
export interface Position {
  id: number;
  name: string;
}

// フォーム用の型（password_confirmを含む）
export interface UserRegistrationFormData {
  last_name: string;
  first_name: string;
  extension?: string;
  direct_phone?: string;
  department_id: number;
  position_id: number;
  email: string;
  password: string;
  password_confirm: string;
}

// API用の型（password_confirmを含まない）
export interface UserRegistrationData {
  last_name: string;
  first_name: string;
  extension?: string;
  direct_phone?: string;
  department_id: number;
  position_id: number;
  email: string;
  password: string;
}

// 部署一覧取得
export async function getDepartments(): Promise<Department[]> {
  return apiFetch<Department[]>("/api/users/departments", {
    method: "GET",
  });
}

// 役職一覧取得
export async function getPositions(): Promise<Position[]> {
  return apiFetch<Position[]>("/api/users/positions", {
    method: "GET",
  });
}

// ユーザー登録
export async function registerUser(data: UserRegistrationData): Promise<MFAResponse> {
  return apiFetch<MFAResponse>("/api/users/register", {
    method: "POST",
    body: data,
  });
}
