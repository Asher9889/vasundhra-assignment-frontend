import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createDataset } from "../api/uploadDataset.api"
import type { CreateDatasetPayload, CreateDatasetResponse } from "../types/add-dataset.types"

export interface CreateDatasetMutateOptions {
  onSuccess?: (data: CreateDatasetResponse) => void
  onError?: (error: unknown) => void
}

export interface UseCreateDatasetResult {
  createDataset: (payload: CreateDatasetPayload, options?: CreateDatasetMutateOptions) => void
  isPending: boolean
  isSuccess: boolean
  isError: boolean
  error: unknown
  data: CreateDatasetResponse | null
  reset: () => void
}

export function useCreateDataset(): UseCreateDatasetResult {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datasets"] })
    },
  })

  return {
    createDataset: mutation.mutate,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data ?? null,
    reset: mutation.reset,
  }
}
