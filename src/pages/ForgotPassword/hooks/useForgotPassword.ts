import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForgotPasswordMutation } from "@/hooks/useForgotPasswordMutation"
import { type TForgotPasswordSchema } from "../types/forgotPassword.types"
import { forgotPasswordSchema } from "../schema/forgotPassword.schema"

export function useForgotPassword() {
  const { mutate, isPending, isError, isSuccess, error, reset } = useForgotPasswordMutation()

  const form = useForm<TForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const handleForgotPassword = (data: TForgotPasswordSchema) => {
    mutate(data.email)
  }

  return {
    ...form,
    handleForgotPassword,
    handleSubmit: form.handleSubmit(handleForgotPassword),
    isPending,
    isError,
    isSuccess,
    error,
    reset,
  }
}