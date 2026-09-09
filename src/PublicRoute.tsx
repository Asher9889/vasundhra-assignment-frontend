import { Navigate, Outlet } from "react-router-dom"
import { useAuthUser } from "@/lib/auth-store"
import { roleHomePath } from "@/lib/auth-store"

export default function PublicRoute() {
  const user = useAuthUser()

  if (user) {
    return <Navigate to={roleHomePath(user.role)} replace />
  }

  return <Outlet />
}