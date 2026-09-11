import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useResetPasswordMutation } from "@/hooks/useResetPasswordMutation"
import { type TResetPasswordSchema } from "../types/resetPassword.types"
import { resetPasswordSchema } from "../schema/resetPassword.schema"

export function useResetPassword(token: string) {
  const { mutate, isPending, isError, isSuccess, error, reset } = useResetPasswordMutation()

  const form = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const handleResetPassword = (data: TResetPasswordSchema) => {
    mutate({ token, password: data.password })
  }

  return {
    ...form,
    handleResetPassword,
    handleSubmit: form.handleSubmit(handleResetPassword),
    isPending,
    isError,
    isSuccess,
    error,
    reset,
  }
}