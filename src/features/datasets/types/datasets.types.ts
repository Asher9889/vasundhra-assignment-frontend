import type { ApprovalStatus, ChartType, DatasetTemplate, Domain } from "@/constants/dataset/dataset.types"

export type DatasetColumnType = "NUMBER" | "STRING" | "DATE"

export interface DatasetFileInfo {
  originalName: string
  mimeType: string
  size: number
}

export interface DatasetColumn {
  name: string
  type: DatasetColumnType
}

export interface DatasetVisualizationConfig {
  latitudeColumn?: string
  longitudeColumn?: string
  valueColumn?: string
  stateColumn?: string
  xAxisColumn?: string
}

export interface DatasetApiRow {
  rowIndex: number
  data: Record<string, string | number | Date | null>
}

export interface DatasetListResponseItem {
  _id?: string
  id?: string
  title: string
  description?: string
  domain: Domain
  templateType: DatasetTemplate
  chartType: ChartType
  uploadedBy: string
  status: ApprovalStatus
  rejectionReason?: string
  file?: DatasetFileInfo
  csvSchema?: { columns: DatasetColumn[] }
  visualizationConfig?: DatasetVisualizationConfig
  rowCount: number
  approvedBy?: string | null
  approvedAt?: string | null
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface DatasetListResponse {
  datasets: DatasetListResponseItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface DatasetDetailResponse extends DatasetListResponseItem {
  rows: DatasetApiRow[]
}

export interface DatasetListQueryParams {
  page?: number
  limit?: number
  domain?: Domain
  status?: ApprovalStatus
  search?: string
  sortBy?: "createdAt" | "title" | "domain"
  sortOrder?: "asc" | "desc"
}