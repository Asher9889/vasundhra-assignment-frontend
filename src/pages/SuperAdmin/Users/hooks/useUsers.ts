import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ACCOUNT_STATUS } from "@/constants/user/user.constant"
import type { TAccountStatus } from "@/constants/user/user.types"
import { createUser, getUsers, updateUserStatus } from "../api/users.api"
import type { TCreateUserPayload, TGetUsersQuery } from "../types/users.types"

const USERS_QUERY_KEY = ["super-admin", "users"] as const

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong"
}

function useGetUsers(query: TGetUsersQuery) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, query],
    queryFn: () => getUsers(query),
  })
}

function useCreateUserMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: TCreateUserPayload) => createUser(payload),
    onSuccess: (user) => {
      toast.success(`Account created. Sign-in credentials sent to ${user.email}.`)
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, accountStatus }: { id: string; accountStatus: TAccountStatus }) =>
      updateUserStatus({ id, accountStatus }),
    onSuccess: (user) => {
      const label = user.accountStatus === ACCOUNT_STATUS.ACTIVE ? "enabled" : "disabled"
      toast.success(`${user.email} is now ${label}.`)
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}

export { USERS_QUERY_KEY, useCreateUserMutation, useGetUsers, useUpdateUserStatusMutation }