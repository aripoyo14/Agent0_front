import { getToken } from "./storage";

// デプロイ先での動作確認のため、一時的に直接設定
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? "https://aps-agent0-01-anbcenbnembacacr.italynorth-01.azurewebsites.net"
    : "http://localhost:8000");

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiFetch<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
    auth?: boolean;
    signal?: AbortSignal;
  } = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, auth = false, signal } = options;

  const finalHeaders: Record<string, string> = {
    ...headers,
  };

  // FormDataの場合はContent-Typeを自動設定（ブラウザがboundaryを設定）
  // JSONの場合はContent-Typeをapplication/jsonに設定
  if (!(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const { accessToken, tokenType } = getToken();
    if (accessToken) {
      finalHeaders["Authorization"] = `${tokenType || "Bearer"} ${accessToken}`;
    }
  }

  const fullUrl = `${API_BASE_URL}${path}`;

  const res = await fetch(fullUrl, {
    method,
    headers: finalHeaders,
    body: body instanceof FormData ? body : (body != null ? JSON.stringify(body) : undefined),
    credentials: "include",
    signal,
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = data?.detail || data?.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}