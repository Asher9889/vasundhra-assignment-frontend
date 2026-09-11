import type { resetPasswordSchema } from "../schema/resetPassword.schema"
import z from "zod"

export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>

export const INVALID_TOKEN_STATUS = 400