import type { loginSchema } from "../schema/login.schema";
import z from "zod";

export type TLoginSchema = z.infer<typeof loginSchema>