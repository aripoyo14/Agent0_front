import { policyThemes, industryOptions, positionOptions } from "@/data/search-data";
import { cookies } from "next/headers";
import { getToken, getTokenFromCookies } from "./auth";
import { NetworkMapResponseDTO } from "@/types";

// サーバーサイド用のAPIベースURL
const SERVER_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

async function getAuthHeaders(): Promise<Record<string, string>> {
  // Server-side (Next server runtime)
  if (typeof window === "undefined") {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("access_token")?.value;
      if (token) return { Authorization: `Bearer ${token}` };
    } catch {
      // ignore
    }
    return {};
  }

  // Client-side fallback
  // 1) localStorage 経由
  try {
    const tokenInfo = getToken?.();
    if (tokenInfo && typeof tokenInfo === "object" && tokenInfo.accessToken) {
      return { Authorization: `Bearer ${tokenInfo.accessToken}` };
    }
  } catch {
    // ignore
  }
  // 2) document.cookie 経由
  try {
    const { accessToken } = getTokenFromCookies?.() || { accessToken: null };
    if (accessToken) return { Authorization: `Bearer ${accessToken}` };
  } catch {
    // ignore
  }
  // 3) 最終手段: document.cookie を直接読む
  try {
    const raw = document.cookie || "";
    const map: Record<string, string> = {};
    raw.split(";").forEach((c) => {
      const [k, v] = c.trim().split("=");
      if (k) map[k] = v;
    });
    const token = map["access_token"];
    if (token) return { Authorization: `Bearer ${token}` };
  } catch {
    // ignore
  }
  return {};
}

/**
 * サーバーサイドで検索データを取得
 */
export async function fetchSearchData(): Promise<{
  policyThemes: typeof policyThemes;
  industryOptions: typeof industryOptions;
  positionOptions: typeof positionOptions;
  defaultSearchResult: NetworkMapResponseDTO | null;
}> {
  try {
    // 静的データは即座に返す
    const staticData = {
      policyThemes,
      industryOptions,
      positionOptions,
    };

    // デフォルト検索結果を取得（全政策テーマでの検索）
    const defaultSearchResult = await fetchDefaultSearchResult();

    return {
      ...staticData,
      defaultSearchResult,
    };
  } catch (error) {
    console.error("Failed to fetch search data:", error);
    // エラーが発生しても静的データは返す
    return {
      policyThemes,
      industryOptions,
      positionOptions,
      defaultSearchResult: null,
    };
  }
}

/**
 * デフォルト検索結果を取得（全政策テーマでの検索）
 */
async function fetchDefaultSearchResult(): Promise<NetworkMapResponseDTO | null> {
  try {
    // 全ての政策テーマ名を取得
    const allPolicyThemeNames = policyThemes.map(theme => theme.title);
    
    const _auth = await getAuthHeaders();
    const response = await fetch(`${SERVER_API_BASE_URL}/api/search_network_map/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ..._auth,
      },
      body: JSON.stringify({
        policy_tag: allPolicyThemeNames,
        free_text: "",
      }),
    });

    if (!response.ok) {
      console.warn('Default search failed:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Default search error:', error);
    return null;
  }
}

/**
 * 特定の検索条件で検索結果を取得
 */
export async function fetchSearchResults(
  policyTags: string[],
  freeText: string
): Promise<NetworkMapResponseDTO | null> {
  try {
    const _auth = await getAuthHeaders();
    const response = await fetch(`${SERVER_API_BASE_URL}/api/search_network_map/match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ..._auth,
      },
      body: JSON.stringify({
        policy_tag: policyTags,
        free_text: freeText,
      }),
    });

    if (!response.ok) {
      console.warn('Search failed:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Search error:', error);
    return null;
  }
}
