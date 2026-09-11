import type { forgotPasswordSchema } from "../schema/forgotPassword.schema"
import z from "zod"

export type TForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>