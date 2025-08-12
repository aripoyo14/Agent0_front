import { getToken } from "./storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function apiFetch<T>(
  path: string,
  options: {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
    auth?: boolean;
  } = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, auth = false } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const { accessToken, tokenType } = getToken();
    if (accessToken) {
      finalHeaders["Authorization"] = `${tokenType || "Bearer"} ${accessToken}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body != null ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message = data?.detail || data?.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}


