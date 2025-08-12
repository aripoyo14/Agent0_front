export const ACCESS_TOKEN_KEY = "access_token";
export const TOKEN_TYPE_KEY = "token_type";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function saveToken(accessToken: string, tokenType: string = "bearer"): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(TOKEN_TYPE_KEY, tokenType);
}

export function getToken(): { accessToken: string | null; tokenType: string | null } {
  if (!isBrowser()) return { accessToken: null, tokenType: null };
  return {
    accessToken: localStorage.getItem(ACCESS_TOKEN_KEY),
    tokenType: localStorage.getItem(TOKEN_TYPE_KEY),
  };
}

export function clearToken(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
}

export function isAuthenticated(): boolean {
  if (!isBrowser()) return false;
  return Boolean(localStorage.getItem(ACCESS_TOKEN_KEY));
}


