import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getMe, login } from "@/pages/Login/api/login.api"
import type { IUser } from "@/constants/user/user.types"

interface LoginPayload {
  email: string
  password: string
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation<IUser, Error, LoginPayload>({
    mutationFn: async ({ email, password }) => {
      await login(email, password);
      const user = await getMe();
      return user;
    },
    onSuccess: (user) => {
      queryClient.setQueryData<IUser | null>(["auth", "me"], user);
    },
  })
}