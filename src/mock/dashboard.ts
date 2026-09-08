import { mockAdmins } from "./admins"
import { mockDatasets } from "./datasets"

export interface DatasetSummaryStats {
  total: number
  pending: number
  approved: number
  rejected: number
  byDomain: Record<string, number>
}

export interface AdminSummaryStats {
  total: number
  active: number
  inactive: number
}

export function getDatasetSummaryStats(datasets = mockDatasets): DatasetSummaryStats {
  return {
    total: datasets.length,
    pending: datasets.filter((d) => d.status === "pending").length,
    approved: datasets.filter((d) => d.status === "approved").length,
    rejected: datasets.filter((d) => d.status === "rejected").length,
    byDomain: {
      climate: datasets.filter((d) => d.domain === "climate").length,
      energy: datasets.filter((d) => d.domain === "energy").length,
      power: datasets.filter((d) => d.domain === "power").length,
    },
  }
}

export function getAdminSummaryStats(admins = mockAdmins): AdminSummaryStats {
  return {
    total: admins.length,
    active: admins.filter((a) => a.status === "active").length,
    inactive: admins.filter((a) => a.status === "inactive").length,
  }
}

export const domainLabels: Record<string, string> = {
  climate: "Climate",
  energy: "Energy",
  power: "Power",
}