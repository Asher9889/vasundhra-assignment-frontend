import type { TUserRole } from "@/constants/user/user.constant"

export type Domain = "climate" | "energy" | "power"

export type ChartType = "line" | "bar" | "area" | "india-map" | "state-heatmap"

export type DatasetTemplate = "latlon" | "statewise" | "timeseries"

export type ApprovalStatus = "pending" | "approved" | "rejected"

export type DatasetActiveStatus = "active" | "inactive"

export type AdminAccountStatus = "active" | "inactive"

export type Role = TUserRole

export interface SeriesDataPoint {
  label: string
  value: number
}

export interface LatLonPoint {
  id: string
  name: string
  latitude: number
  longitude: number
  value: number
  category?: string
}

export interface StateValue {
  state: string
  value: number
}

export interface ChartData {
  kind: "line" | "bar" | "area" | "india-map" | "state-heatmap"
  series?: Array<{ name: string; points: SeriesDataPoint[] }>
  points?: LatLonPoint[]
  states?: StateValue[]
  unit?: string
  xLabel?: string
  yLabel?: string
}

export interface Dataset {
  id: string
  title: string
  description?: string
  domain: Domain
  chartType: ChartType
  templateType: DatasetTemplate
  data: ChartData
  uploadedBy: string
  uploadedById?: string
  status: ApprovalStatus
  activeStatus: DatasetActiveStatus
  rejectionReason?: string
  fileName?: string
  rowCount?: number
  createdAt: string
  approvedAt?: string
}

export interface AdminUser {
  id: string
  email: string
  name?: string
  role: Role
  status: AdminAccountStatus
  createdAt: string
  lastLogin?: string
}

export interface DashboardStat {
  label: string
  value: number
  hint?: string
  trend?: "up" | "down"
}