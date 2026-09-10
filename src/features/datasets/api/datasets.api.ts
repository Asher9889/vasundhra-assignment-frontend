import { apiEndPoints, apiRequest } from "@/config"
import type { Dataset } from "@/constants/dataset/dataset.types"
import type { AxiosApiResponse } from "@/types/api-response.type"
import type {
  DatasetDetailResponse,
  DatasetListQueryParams,
  DatasetListResponse,
  DatasetListResponseItem,
} from "../types/datasets.types"

export interface UpdateDatasetStatusPayload {
  status: "APPROVED" | "REJECTED"
  rejectionReason?: string
}

function itemId(item: DatasetListResponseItem): string {
  return item.id ?? item._id ?? ""
}

export function toDatasetMetadata(item: DatasetListResponseItem): Dataset {
  return {
    id: itemId(item),
    title: item.title,
    description: item.description,
    domain: item.domain,
    chartType: item.chartType,
    templateType: item.templateType,
    uploadedBy: item.uploadedBy,
    status: item.status,
    rejectionReason: item.rejectionReason,
    fileName: item.file?.originalName,
    rowCount: item.rowCount,
    createdAt: item.createdAt,
    approvedBy: item.approvedBy ?? null,
    approvedAt: item.approvedAt ?? null,
    publishedAt: item.publishedAt ?? null,
  }
}

export async function listDatasets(query: DatasetListQueryParams = {}): Promise<DatasetListResponse> {
  const { url, method } = apiEndPoints.datasets.list
  const response = await apiRequest<AxiosApiResponse<DatasetListResponse>>({ url, method, params: query })
  return response.data
}

export async function getDatasetDetail(id: string): Promise<DatasetDetailResponse> {
  const { url, method } = apiEndPoints.datasets.detail(id)
  const response = await apiRequest<AxiosApiResponse<DatasetDetailResponse>>({ url, method })
  return response.data
}

export async function listPublicDatasets(query: DatasetListQueryParams = {}): Promise<DatasetListResponse> {
  const { url, method } = apiEndPoints.datasets.publicList
  const response = await apiRequest<AxiosApiResponse<DatasetListResponse>>({ url, method, params: query })
  return response.data
}

export async function getPublicDatasetDetail(id: string): Promise<DatasetDetailResponse> {
  const { url, method } = apiEndPoints.datasets.publicDetail(id)
  const response = await apiRequest<AxiosApiResponse<DatasetDetailResponse>>({ url, method })
  return response.data
}

export async function updateDatasetStatus(id: string, payload: UpdateDatasetStatusPayload): Promise<Dataset> {
  const { url, method } = apiEndPoints.datasets.updateStatus(id)
  const response = await apiRequest<AxiosApiResponse<DatasetListResponseItem>>({ url, method, data: payload })
  return toDatasetMetadata(response.data)
}