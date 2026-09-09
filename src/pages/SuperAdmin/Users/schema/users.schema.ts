import { z } from "zod"
import { USER_ROLE } from "@/constants/user/user.constant"

export const createUserSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be at most 20 characters"),
  role: z.enum([USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN], { message: "Select a valid role" }),
})