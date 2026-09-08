import type { AdminAccountStatus, AdminUser, ApprovalStatus } from "./index"

export interface OverviewStat {
  label: string
  value: number
  hint?: string
}

export interface DatasetFilters {
  search: string
  status: ApprovalStatus | "all"
}

export interface AdminUserFormValues {
  email: string
  password: string
}

export interface AdminUserErrors {
  email?: string
  password?: string
}

export type AdminUserFormStatus = "idle" | "submitting" | "success" | "error"

export interface AdminUserFilters {
  search: string
  status: AdminAccountStatus | "all"
}

export interface AdminUserRow extends AdminUser {}

export const emptyDatasetFilters: DatasetFilters = {
  search: "",
  status: "all",
}

export const emptyAdminUserFilters: AdminUserFilters = {
  search: "",
  status: "all",
}