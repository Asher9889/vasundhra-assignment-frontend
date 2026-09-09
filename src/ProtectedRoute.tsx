import { Navigate, Outlet } from "react-router-dom"
import { useAuthUser } from "@/lib/auth-store"

export default function ProtectedRoute() {
  const user = useAuthUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}