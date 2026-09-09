import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLoginMutation } from "@/hooks/useLoginMutation"
import { type TLoginSchema } from "../types/login.types"
import { loginSchema } from "../schema/login.schema"


export function useLogin() {
  const { mutate, isPending, isError, error, reset } = useLoginMutation();

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const handleLogin = (data: TLoginSchema) => {
    mutate(data);
  }

  return {
    ...form, handleLogin, handleSubmit: form.handleSubmit(handleLogin), isPending, isError, error, reset,
  }
}
