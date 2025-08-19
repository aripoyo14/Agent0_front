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
    // JWT payload を base64url デコードして取得
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4 || 0)) % 4, '=');
    const json = atob(padded);
    const payload = JSON.parse(json);
    
    // user_typeからroleを設定
    let role: string;
    if (payload.user_type === "expert") {
      role = "contributor"; // 外部有識者はcontributorとして扱う
    } else if (payload.user_type === "user") {
      role = "staff"; // 一般ユーザーはstaffとして扱う
    } else {
      role = "contributor"; // デフォルト
    }
    
    return {
      userId: payload.sub,
      userType: payload.user_type, // "user" または "expert"
      role: role // "admin"/"staff" または "contributor"/"viewer"
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


