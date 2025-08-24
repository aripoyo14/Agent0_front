import { cookies } from 'next/headers';

// サーバーサイドでクッキーからトークンを取得（非同期対応）
export async function getTokenFromCookies(): Promise<{ accessToken: string | null; tokenType: string | null }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const tokenType = cookieStore.get('token_type')?.value || 'Bearer';
  
  return {
    accessToken: accessToken || null,
    tokenType: tokenType || 'Bearer'
  };
}

// サーバーサイドでユーザー名を取得
export async function getUserNameServerSide(): Promise<string> {
  try {
    const { accessToken } = await getTokenFromCookies();
    
    if (!accessToken) {
      return "ゲストユーザー";
    }
    
    // API_BASE_URLの設定
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
      (process.env.NODE_ENV === 'production' 
        ? "https://aps-agent0-01-anbcenbnembacacr.italynorth-01.azurewebsites.net"
        : "http://localhost:8000");
    
    // カスタムヘッダー付きでAPI呼び出し
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return "ログインユーザー";
    }
    
    const userData = await response.json();
    
    // firstnameとlastnameが存在する場合は結合して返す
    if (userData.first_name && userData.last_name) {
      return `${userData.last_name} ${userData.first_name}`;
    }
    
    return userData.first_name || userData.last_name || "ログインユーザー";
  } catch (error) {
    console.error("サーバーサイドユーザー名取得エラー:", error);
    return "ログインユーザー";
  }
}
