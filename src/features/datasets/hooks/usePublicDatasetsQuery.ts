import { useQuery } from "@tanstack/react-query"
import { listPublicDatasets, toDatasetMetadata } from "../api/datasets.api"
import type { DatasetListQueryParams } from "../types/datasets.types"

export function usePublicDatasetsQuery(params: DatasetListQueryParams = {}) {
  const query = useQuery({
    queryKey: ["public", "datasets", params],
    queryFn: () => listPublicDatasets(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  return {
    ...query,
    datasets: (query.data?.datasets ?? []).map(toDatasetMetadata),
    pagination: query.data?.pagination,
  }
}