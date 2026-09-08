import type { Role } from "./index"

export interface LoginFormValues {
  email: string
  password: string
}

export interface LoginErrors {
  email?: string
  password?: string
}

export type LoginStatus = "idle" | "submitting" | "success" | "error"

export type DemoRole = "super-admin" | "admin"

export interface DemoAccount {
  id: string
  label: string
  description: string
  email: string
  password: string
  redirectTo: string
  role: Role
}