import { APPROVAL_STATUS, DOMAIN } from "@/constants/dataset/dataset.constants"
import { ACCOUNT_STATUS } from "@/constants/user/user.constant"
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
    pending: datasets.filter((d) => d.status === APPROVAL_STATUS.PENDING).length,
    approved: datasets.filter((d) => d.status === APPROVAL_STATUS.APPROVED).length,
    rejected: datasets.filter((d) => d.status === APPROVAL_STATUS.REJECTED).length,
    byDomain: {
      [DOMAIN.CLIMATE]: datasets.filter((d) => d.domain === DOMAIN.CLIMATE).length,
      [DOMAIN.ENERGY]: datasets.filter((d) => d.domain === DOMAIN.ENERGY).length,
      [DOMAIN.POWER]: datasets.filter((d) => d.domain === DOMAIN.POWER).length,
    },
  }
}

export function getAdminSummaryStats(admins = mockAdmins): AdminSummaryStats {
  return {
    total: admins.length,
    active: admins.filter((a) => a.status === ACCOUNT_STATUS.ACTIVE).length,
    inactive: admins.filter((a) => a.status === ACCOUNT_STATUS.INACTIVE).length,
  }
}

export const domainLabels: Record<string, string> = {
  [DOMAIN.CLIMATE]: "Climate",
  [DOMAIN.ENERGY]: "Energy",
  [DOMAIN.POWER]: "Power",
}