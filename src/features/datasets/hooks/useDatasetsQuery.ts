import { useQuery } from "@tanstack/react-query"
import { listDatasets, toDatasetMetadata } from "../api/datasets.api"
import type { DatasetListQueryParams } from "../types/datasets.types"

export function useDatasetsQuery(params: DatasetListQueryParams = {}) {
  const query = useQuery({
    queryKey: ["datasets", params],
    queryFn: () => listDatasets(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })

  return {
    ...query,
    datasets: (query.data?.datasets ?? []).map(toDatasetMetadata),
    pagination: query.data?.pagination,
  }
}