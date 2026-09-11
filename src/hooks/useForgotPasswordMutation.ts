import { useMutation } from "@tanstack/react-query"
import { forgotPassword } from "@/pages/ForgotPassword/api/forgotPassword.api"

interface ForgotPasswordResponse {
  message: string
}

export function useForgotPasswordMutation() {
  return useMutation<ForgotPasswordResponse, Error, string>({
    mutationFn: forgotPassword,
  })
}