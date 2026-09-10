import type { ApprovalStatus, ChartType, DatasetTemplate, Domain } from "@/constants/dataset/dataset.types"

export function formatDate(iso?: string): string {
  if (!iso) return "—"
  const date = new Date(iso)
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function formatDateTime(iso?: string): string {
  if (!iso) return "—"
  const date = new Date(iso)
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-IN")
}

export function formatValue(value: number): string {
  if (Math.abs(value) >= 1000) return value.toLocaleString("en-IN")
  return String(value)
}

export const domainLabels: Record<Domain, string> = {
  CLIMATE: "Climate",
  ENERGY: "Energy",
  POWER: "Power",
}

export const chartTypeLabels: Record<ChartType, string> = {
  LINE: "Line Chart",
  BAR: "Bar Chart",
  AREA: "Area Chart",
  INDIA_MAP: "India Map",
  STATE_HEATMAP: "State Heatmap",
}

export const templateLabels: Record<DatasetTemplate, string> = {
LAT_LONG: "Latitude / Longitude",
STATE_WISE: "State-wise",
TIME_SERIES: "Time-series",
}

export const approvalLabels: Record<ApprovalStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
}

export function initials(name?: string): string {
  if (!name) return "?"
  return name
    .split(/[\s@.]+/)
    .filter((p) => p.length > 0)
    .map((p) => p[0]!.toUpperCase())
    .slice(0, 2)
    .join("")
}