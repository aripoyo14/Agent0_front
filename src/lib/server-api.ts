import { PolicyProposal } from "@/types";

// 開発環境でのみエラーログを表示する関数
const devError = (...args: unknown[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  }
};

// サーバーサイド専用のAPIクライアント
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function serverApiFetch<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
    signal?: AbortSignal;
  } = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const finalHeaders: Record<string, string> = {
    ...headers,
  };

  // FormDataの場合はContent-Typeを自動設定
  if (!(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  const fullUrl = `${API_BASE_URL}${path}`;

  const res = await fetch(fullUrl, {
    method,
    headers: finalHeaders,
    body: body instanceof FormData ? body : (body != null ? JSON.stringify(body) : undefined),
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = data?.detail || data?.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

// サーバーサイド用の政策提案一覧取得API
export async function getServerPolicyProposals(params?: {
  status?: "draft" | "published" | "archived";
  q?: string;
  offset?: number;
  limit?: number;
}): Promise<PolicyProposal[]> {
  // サーバーサイドでは認証できないため、空配列を返す
  if (typeof window === 'undefined') {
    return [];
  }
  
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append('status', params.status);
  if (params?.q) queryParams.append('q', params.q);
  if (params?.offset) queryParams.append('offset', params.offset.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  
  try {
    // まず公開APIを試行
    return await serverApiFetch<PolicyProposal[]>(`/api/policy-proposals/public/?${queryParams}`, {
      method: "GET",
    });
  } catch (error) {
    devError("公開API取得エラー:", error);
    // エラーの場合は空配列を返す
    return [];
  }
}
