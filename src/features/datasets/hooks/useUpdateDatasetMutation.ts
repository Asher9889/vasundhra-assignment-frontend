import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateDataset } from "../api/datasets.api"
import type { DatasetUpdatePayload } from "../types/datasets.types"

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong"
}

export interface UpdateDatasetPayload {
  id: string
  payload: DatasetUpdatePayload
}

export function useUpdateDatasetMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateDatasetPayload) => updateDataset(id, payload),
    onSuccess: (dataset) => {
      toast.success(`"${dataset.title}" updated.`)
      queryClient.invalidateQueries({ queryKey: ["datasets"] })
      queryClient.invalidateQueries({ queryKey: ["public", "datasets"] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}