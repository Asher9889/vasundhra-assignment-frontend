import type { ChartData, Domain, DatasetTemplate } from "@/types"

export type SeriesType = "line" | "bar" | "area"

export interface AddDatasetFormState {
  domain: Domain | null
  templateType: DatasetTemplate | null
  seriesType: SeriesType
}

export type PreviewChartData = ChartData