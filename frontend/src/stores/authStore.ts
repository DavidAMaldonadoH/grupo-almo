import { create } from "zustand";

import { fetchProfile, loginRequest } from "@/services/auth";
import type { LoginCredentials, User } from "@/auth/types";
import { getCookie, removeCookie, setCookie } from "@/lib/cookies";

export const AUTH_COOKIE = "auth_token";
const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30;
const SESSION_MAX_AGE = 60 * 60 * 8;

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  user: User | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;
  login: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  status: "idle",
  error: null,

  async login(credentials, rememberMe = false) {
    set({ status: "loading", error: null });
    try {
      const { access_token, user } = await loginRequest(credentials);
      setCookie(AUTH_COOKIE, access_token, {
        maxAge: rememberMe ? REMEMBER_ME_MAX_AGE : SESSION_MAX_AGE,
      });
      set({
        user,
        token: access_token,
        status: "authenticated",
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      set({
        user: null,
        token: null,
        status: "unauthenticated",
        error: message,
      });
      throw err;
    }
  },

  logout() {
    removeCookie(AUTH_COOKIE);
    set({ user: null, token: null, status: "unauthenticated", error: null });
  },

  async hydrate() {
    if (get().status === "loading") return;
    const token = getCookie(AUTH_COOKIE);
    if (!token) {
      set({ status: "unauthenticated" });
      return;
    }

    set({ status: "loading" });
    try {
      const user = await fetchProfile(token);
      set({ user, token, status: "authenticated" });
    } catch {
      removeCookie(AUTH_COOKIE);
      set({ user: null, token: null, status: "unauthenticated" });
    }
  },
}));
