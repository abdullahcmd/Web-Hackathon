// Centralized API configuration and reusable fetch helper

export const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE || "http://localhost:3000/api";

export const endpoints = {
  auth: {
    register: `${API_BASE}/auth/register`,
    login: `${API_BASE}/auth/login`,
    me: `${API_BASE}/auth/me`,
  },
  admin: {
    // placeholders for future use
  },
  farmer: {
    // placeholders for future use
  },
};

type Json = Record<string, any> | undefined;

export async function apiFetch<T = any>(
  url: string,
  options: RequestInit & { bodyJson?: Json } = {}
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Only attach Authorization for farmer sessions if token exists
  const stored = localStorage.getItem("auth_user");
  const token = localStorage.getItem("auth_token");
  if (stored && token) {
    try {
      const user = JSON.parse(stored) as { role?: string };
      if (user?.role === "farmer") {
        (headers as any).Authorization = `Bearer ${token}`;
      }
    } catch {}
  }

  const { bodyJson, ...rest } = options;
  const res = await fetch(url, {
    ...rest,
    headers,
    body: bodyJson ? JSON.stringify(bodyJson) : options.body,
  });

  // Throw on non-2xx with parsed error when possible
  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const e = await res.json();
      errMsg = e?.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  // handle no-content
  if (res.status === 204) return undefined as unknown as T;

  return (await res.json()) as T;
}
