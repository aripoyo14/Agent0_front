import { apiFetch } from "./apiClient";
import { saveToken, clearToken, isAuthenticated, getToken } from "./storage";
// UserInfo型は現在使用していないため、コメントアウト
// import { UserInfo } from "@/types";

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

// ユーザー名を取得する関数（JWTトークンから）
export function getUserName(): string {
  const userInfo = getUserFromToken();
  if (userInfo) {
    // JWTトークンにユーザー名が含まれている場合は使用
    // 現在はデフォルト値を返す
    return "ログインユーザー";
  }
  return "ゲストユーザー";
}

// ユーザー名を取得する関数（APIから）
export async function getUserNameFromAPI(): Promise<string> {
  try {
    const userInfo = getUserFromToken();
    if (!userInfo) {
      return "ゲストユーザー";
    }
    
    // /api/users/meエンドポイントからユーザー情報を取得
    const response = await apiFetch<{
      id: string;
      email: string;
      last_name: string;
      first_name: string;
      role: string;
    }>("/api/users/me", {
      method: "GET",
      auth: true,
    });
    
    // firstnameとlastnameが存在する場合は結合して返す
    if (response.first_name && response.last_name) {
      return `${response.last_name} ${response.first_name}`;
    }
    
    // 従来のnameフィールドをフォールバックとして使用
    return response.first_name || response.last_name || "ログインユーザー";
  } catch (error) {
    console.error("ユーザー名取得エラー:", error);
    // APIが失敗した場合はJWTトークンから取得を試行
    return getUserName();
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

// デバッグ用：トークンの状態を確認
export async function debugToken(): Promise<void> {
  try {
    const tokenInfo = getToken();
    if (!tokenInfo || !tokenInfo.accessToken) {
      console.log("❌ トークンが存在しません");
      return;
    }

    console.log("🔍 トークンデバッグ開始...");
    console.log("トークン長:", tokenInfo.accessToken.length);
    console.log("トークンプレビュー:", tokenInfo.accessToken.substring(0, 50) + "...");

    const response = await apiFetch("/api/users/debug-token", {
      method: "GET",
      auth: true,
    });

    console.log("✅ トークンデバッグ結果:", response);
  } catch (error) {
    console.error("❌ トークンデバッグエラー:", error);
  }
}

// テスト用：認証処理の各段階をテスト
export async function testAuth(): Promise<void> {
  try {
    console.log("🧪 認証テスト開始...");
    
    const response = await apiFetch("/api/users/test-auth", {
      method: "GET",
      auth: true,
    });

    console.log("✅ 認証テスト結果:", response);
  } catch (error) {
    console.error("❌ 認証テストエラー:", error);
  }
}


