import { useQuery } from "@tanstack/react-query"
import { getPublicDatasetDetail, toDatasetMetadata } from "../api/datasets.api"
import { buildChartDataFromApiDetail } from "../chart-builder"
import type { Dataset } from "@/constants/dataset/dataset.types"

export function usePublicDatasetDetailQuery(id?: string) {
  const query = useQuery({
    queryKey: ["public", "datasets", id],
    queryFn: () => getPublicDatasetDetail(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  const detail = query.data
  const dataset: Dataset | undefined = detail
    ? { ...toDatasetMetadata(detail), data: buildChartDataFromApiDetail(detail) ?? undefined }
    : undefined

  return {
    ...query,
    detail: detail ?? null,
    dataset: dataset ?? null,
  }
}