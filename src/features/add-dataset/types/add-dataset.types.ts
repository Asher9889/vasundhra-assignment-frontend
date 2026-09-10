import type { ChartData, DatasetTemplate, DatasetUploadPhase, Domain, TimeseriesChartType } from "@/constants/dataset/dataset.types"

export type SeriesType = TimeseriesChartType["value"]

export type ColumnType = "NUMBER" | "STRING" | "DATE"

export interface ParsedColumn {
  name: string
  type: ColumnType
}

export interface CSVInvalidRowError {
  field: string
  message: string
}

export interface CSVInvalidRow {
  rowNumber: number
  row: Record<string, string | number>
  errors: CSVInvalidRowError[]
}

export interface ParsedCSV {
  columns: ParsedColumn[]
  rows: string[][]
  rowCount: number
  validCount: number
  wrongCount: number
  wrongData: CSVInvalidRow[]
}

export interface AddDatasetFormState {
  domain: Domain | null
  templateType: DatasetTemplate | null
  seriesType: SeriesType
  xColumn: string
  valueColumn: string
  stateColumn: string
  latitudeColumn: string
  longitudeColumn: string
  title: string
}

export interface CSVValidationError {
  message: string
}

export interface CSVValidationResult {
  state: DatasetUploadPhase
  errors: CSVValidationError[]
  fileName?: string
  rowCount?: number
}

export type PreviewChartData = ChartData