import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { APPROVAL_STATUS } from "@/constants/dataset/dataset.constants"
import { updateDatasetStatus } from "../api/datasets.api"

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong"
}

export interface UpdateDatasetStatusPayload {
  id: string
  status: "APPROVED" | "REJECTED"
  rejectionReason?: string
}

export function useUpdateDatasetStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status, rejectionReason }: UpdateDatasetStatusPayload) =>
      updateDatasetStatus(id, { status, rejectionReason }),
    onSuccess: (dataset, variables) => {
      if (variables.status === APPROVAL_STATUS.APPROVED) {
        toast.success(`"${dataset.title}" approved and published.`)
      } else {
        toast.error(`"${dataset.title}" rejected.`)
      }
      queryClient.invalidateQueries({ queryKey: ["datasets"] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}