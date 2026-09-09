import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { SplashScreen } from "@/components/common/SplashScreen"
import { USER_ROLE } from "@/constants/user/user.constant"
import type { TUserRole } from "@/constants/user/user.types"

const HOME_PATH: Record<TUserRole, string> = {
  [USER_ROLE.SUPER_ADMIN]: "/super-admin",
  [USER_ROLE.ADMIN]: "/admin",
}

export default function PublicRoute() {
  const { user, status } = useAuth()

  if (status === "CHECKING") {
    return <SplashScreen />
  }

  if (user) {
    return <Navigate to={HOME_PATH[user.role] ?? "/"} replace />
  }

  return <Outlet />
}
