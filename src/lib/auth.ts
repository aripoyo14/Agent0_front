import { apiFetch } from "./apiClient";
import { saveToken, clearToken, isAuthenticated, getToken } from "./storage";

type LoginResponse = {
  access_token: string;
  token_type: string;
};

// JWTトークンからユーザー情報を取得する関数
export function getUserFromToken(): { userId: string; userType: string; role: string } | null {
  const tokenData = getToken();
  // console.log("getToken()の戻り値:", tokenData);
  // console.log("tokenの型:", typeof tokenData);
  
  if (!tokenData) {
    // console.log("トークンが存在しません");
    return null;
  }
  
  // トークンデータからaccessTokenを取得
  let token: string;
  if (typeof tokenData === 'string') {
    token = tokenData;
  } else if (tokenData && typeof tokenData === 'object' && 'accessToken' in tokenData) {
    // accessTokenが存在し、文字列であることを確認
    if (typeof tokenData.accessToken === 'string' && tokenData.accessToken) {
      token = tokenData.accessToken;
    } else {
      return null;
    };
  } else {
    // console.log("トークンの形式が不正です:", tokenData);
    return null;
  }
  
  try {
    // JWTトークンをデコード（base64でデコード）
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.sub,
      userType: payload.user_type, // "user" または "expert"
      role: payload.role // "admin"/"staff" または "contributor"/"viewer"
    };
  } catch {
    // console.error('Token decode error:', error);
    return null;
  }
}

// ログインAPIを呼び出す関数
export async function login(email: string, password: string): Promise<void> {
  const data = await apiFetch<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  // console.log("ログインAPIレスポンス:", data);
  saveToken(data.access_token, data.token_type);
}

export function logout(): void {
  clearToken();
}

export { isAuthenticated, getToken };


