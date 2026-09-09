import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { SplashScreen } from "@/components/common/SplashScreen"

export default function ProtectedRoute() {
  const { status } = useAuth()

  if (status === "CHECKING") {
    return <SplashScreen />
  }

  if (status === "UNAUTHENTICATED") {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
