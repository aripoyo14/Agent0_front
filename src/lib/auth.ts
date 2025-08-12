import { apiFetch } from "./apiClient";
import { saveToken, clearToken, isAuthenticated, getToken } from "./storage";

type LoginResponse = {
  access_token: string;
  token_type: string;
};

export async function login(email: string, password: string): Promise<void> {
  const data = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  saveToken(data.access_token, data.token_type);
}

export function logout(): void {
  clearToken();
}

export { isAuthenticated, getToken };


