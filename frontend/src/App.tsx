import { BrowserRouter, Navigate, Route, Routes } from "react-router"

import { AuthProvider } from "@/auth/AuthProvider"
import { AuthGuard, GuestGuard } from "@/components/auth-guard"
import Login from "@/pages/auth/Login"
import Tracking from "@/pages/tracking/Tracking"

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestGuard>
                <Login />
              </GuestGuard>
            }
          />
          <Route
            path="/tracking"
            element={
              <AuthGuard>
                <Tracking />
              </AuthGuard>
            }
          />
          <Route path="/" element={<Navigate to="/tracking" replace />} />
          <Route path="*" element={<Navigate to="/tracking" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
