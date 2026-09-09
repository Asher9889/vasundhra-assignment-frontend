import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { SplashScreen } from "@/components/common/SplashScreen"
import type { TUserRole } from "@/constants/user/user.types"

interface ProtectedRouteProps {
  allowedRoles: TUserRole[]
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, status } = useAuth()

  if (status === "CHECKING") {
    return <SplashScreen />
  }

  if (status === "UNAUTHENTICATED") {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}
