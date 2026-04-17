import { createContext } from "react"

import type { LoginCredentials, User } from "./types"

export type AuthContextValue = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (credentials: LoginCredentials, rememberMe?: boolean) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
