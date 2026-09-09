import { USER_ROLE } from "@/constants/user/user.constant"
import type { LucideIcon } from "lucide-react"
import type { ComponentType } from "react"

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE]

export interface ChildRoute {
  path: string | undefined
  element: ComponentType
  roles?: UserRole[]
}

export interface AppRoute {
  title: string
  path: string
  icon: LucideIcon
  element: ComponentType
  showInSidebar: boolean
  roles: UserRole[]
  group?: string
  children?: ChildRoute[]
}

export type AppRoutes = Record<string, AppRoute>