import { useMutation } from "@tanstack/react-query"
import { resetPassword } from "@/pages/ResetPassword/api/resetPassword.api"

interface ResetPasswordResponse {
  message: string
}

interface ResetPasswordPayload {
  token: string
  password: string
}

export function useResetPasswordMutation() {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordPayload>({
    mutationFn: ({ token, password }) => resetPassword(token, password),
  })
}