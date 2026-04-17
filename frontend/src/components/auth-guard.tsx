import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router"

import { useAuth } from "@/auth/useAuth"

type AuthGuardProps = {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-xs text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}

export function GuestGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-xs text-muted-foreground">
        Loading...
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/tracking" replace />
  }

  return <>{children}</>
}
