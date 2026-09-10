import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { DATASET_UPLOAD_PHASE } from "@/constants/dataset/dataset.constants"
import type { DatasetUploadPhase } from "@/constants/dataset/dataset.types"
import { parseUpload } from "../api/parseUpload.api"
import type { ParsedCSV } from "../types/add-dataset.types"

export interface UseDatasetUploadResult {
  file: File | null
  phase: DatasetUploadPhase
  parsed: ParsedCSV | null
  errors: string[]
  selectFile: (file: File | null) => void
  reset: () => void
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return "Unable to parse the file. Please check that the file is valid CSV."
}

export function useDatasetUpload(onParsed?: (parsed: ParsedCSV) => void): UseDatasetUploadResult {
  const [file, setFile] = useState<File | null>(null)
  const mutation = useMutation({
    mutationFn: (next: File) => parseUpload(next),
    onSuccess: (result) => {
      if (result.columns.length > 0) onParsed?.(result)
    },
  })

  const parsed = mutation.isSuccess ? mutation.data : null
  const isEmpty = mutation.isSuccess && mutation.data.columns.length === 0
  const phase: DatasetUploadPhase = !file
    ? DATASET_UPLOAD_PHASE.IDLE
    : mutation.isPending
      ? DATASET_UPLOAD_PHASE.UPLOADING
      : mutation.isSuccess && !isEmpty
        ? DATASET_UPLOAD_PHASE.VALID
        : DATASET_UPLOAD_PHASE.INVALID
  const errors = mutation.isError
    ? [getErrorMessage(mutation.error)]
    : isEmpty
      ? ["The file is empty or could not be parsed as CSV."]
      : []

  function selectFile(next: File | null) {
    if (!next) {
      reset();
      return;
    }
    setFile(next)
    mutation.mutate(next)
  }

  function reset() {
    setFile(null)
    mutation.reset()
  }

  return { file, phase, parsed, errors, selectFile, reset }
}