import type { AuthResponse, LoginCredentials, User } from "../auth/types";

const API_URL = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      (body as { message?: string }).message ??
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export function loginRequest(credentials: LoginCredentials) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function fetchProfile(token: string) {
  return request<User>("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
}
