import type {
  ChartType,
  DatasetTemplate,
  Domain,
} from "./index"

export type CSVValidationState = "idle" | "uploading" | "valid" | "invalid"

export interface CSVValidationError {
  message: string
}

export interface CSVValidationResult {
  state: CSVValidationState
  errors: CSVValidationError[]
  fileName?: string
  rowCount?: number
}

export interface TimeseriesChartType {
  value: "line" | "bar" | "area"
  label: string
}

export interface AddDatasetFormValues {
  file: File | null
  domain: Domain | null
  templateType: DatasetTemplate | null
  timeseriesChartType: ChartType
  title: string
}

export interface AddDatasetErrors {
  file?: string
  domain?: string
  templateType?: string
  title?: string
}

export type SubmitStatus = "idle" | "submitting" | "success" | "error"

export interface ColumnGuide {
  templateType: DatasetTemplate
  columns: { name: string; description?: string }[]
  example: Record<string, string>
}