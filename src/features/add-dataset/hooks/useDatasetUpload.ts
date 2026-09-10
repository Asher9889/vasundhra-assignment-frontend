import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { DATASET_UPLOAD_PHASE } from "@/constants/dataset/dataset.constants"
import type { DatasetUploadPhase } from "@/constants/dataset/dataset.types"
import { uploadDataset } from "../api/uploadDataset.api"
import type { ParsedCSV } from "../types/add-dataset.types"

export interface UseDatasetUploadResult {
  file: File | null;
  phase: DatasetUploadPhase;
  parsedData: ParsedCSV | null;
  errors: string[];
  selectFile: (file: File | null) => void;
  reset: () => void;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unable to parse the file. Please check that the file is valid CSV.";
}

export function useDatasetUpload(): UseDatasetUploadResult {
  const [file, setFile] = useState<File | null>(null)
  const mutation = useMutation({
    mutationFn: (file: File) => uploadDataset(file),
  })

  const parsedData = mutation.isSuccess ? mutation.data : null
  const hasNoRows = parsedData !== null && parsedData.rowCount === 0
  const hasNoValidRows = parsedData !== null && parsedData.validCount === 0

  let phase: DatasetUploadPhase
  if (!file) {
    phase = DATASET_UPLOAD_PHASE.IDLE
  } else if (mutation.isPending) {
    phase = DATASET_UPLOAD_PHASE.UPLOADING
  } else if (mutation.isError || hasNoRows || hasNoValidRows) {
    phase = DATASET_UPLOAD_PHASE.INVALID
  } else {
    phase = DATASET_UPLOAD_PHASE.VALID
  }

  let errors: string[]
  if (mutation.isError) {
    errors = [getErrorMessage(mutation.error)]
  } else if (hasNoRows) {
    errors = ["The file is empty or could not be parsed as CSV."]
  } else if (hasNoValidRows) {
    errors = parsedData!.wrongData
      .slice(0, 5)
      .map((row) => `Row ${row.rowNumber}: ${row.errors.map((e) => e.message).join("; ")}`)
    if (errors.length === 0) errors = ["No valid data rows found in the file."]
  } else {
    errors = []
  }

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

  return { file, phase, parsedData, errors, selectFile, reset }
}