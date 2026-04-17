import { useEffect, useMemo, type ReactNode } from "react"

import { useAuthStore } from "@/stores/authStore"

import { AuthContext, type AuthContextValue } from "./AuthContext"

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const status = useAuthStore((state) => state.status)
  const error = useAuthStore((state) => state.error)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: status === "authenticated",
      isLoading: status === "idle" || status === "loading",
      error,
      login,
      logout,
    }),
    [user, token, status, error, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
