import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createUserSchema } from "../schema/users.schema"
import type { TCreateUserSchema } from "../types/users.types"
import { useCreateUserMutation } from "./useUsers"

export function useAddAdmin() {
  const { mutate, isPending, isSuccess } = useCreateUserMutation()

  const form = useForm<TCreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { email: "", password: "", role: "ADMIN" },
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const handleCreate = (data: TCreateUserSchema) => mutate(data)

  return {
    ...form,
    handleSubmit: form.handleSubmit(handleCreate),
    isPending,
    isSuccess,
  }
}