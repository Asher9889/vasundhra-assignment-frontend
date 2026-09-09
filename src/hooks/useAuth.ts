import { useQuery } from "@tanstack/react-query"
import { getMe } from "@/pages/Login/api/login.api"
import type { AuthStatus } from "@/constants/auth/auth.types"
import { AUTH_STATUS } from "@/constants/auth/auth.constants"

export function useAuth() {
  const { data: user, isPending, isError, isSuccess } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  const status: AuthStatus = isPending  ? AUTH_STATUS.CHECKING : isError ? AUTH_STATUS.UNAUTHENTICATED : AUTH_STATUS.AUTHENTICATED

  return { user: user ?? null, status, isPending, isError, isSuccess }
}