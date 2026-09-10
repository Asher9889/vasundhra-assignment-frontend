import { CHART_TYPE, DATASET_TEMPLATE } from "@/constants/dataset/dataset.constants"
import type { ChartData } from "@/constants/dataset/dataset.types"
import type { DatasetDetailResponse } from "./types/datasets.types"

function toNumber(value: string | number | Date | null): number {
  if (value == null) return Number.NaN
  if (typeof value === "number") return value
  if (value instanceof Date) return Number.NaN
  const parsed = Number(value)
  return Number.isNaN(parsed) ? Number.NaN : parsed
}

function numberOrNull(value: string | number | Date | null): number | null {
  const parsed = toNumber(value)
  return Number.isNaN(parsed) ? null : parsed
}

function labelOf(value: string | number | Date | null): string {
  if (value == null) return ""
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value)
}

export function buildChartDataFromApiDetail(detail: DatasetDetailResponse): ChartData | null {
  const { chartType, templateType, visualizationConfig, rows } = detail
  if (!templateType || !visualizationConfig || rows.length === 0) return null

  if (templateType === DATASET_TEMPLATE.TIME_SERIES) {
    const { xAxisColumn, valueColumn } = visualizationConfig
    if (!xAxisColumn || !valueColumn) return null
    const points = rows
      .map(({ data }) => ({
        label: labelOf(data[xAxisColumn]),
        value: numberOrNull(data[valueColumn]),
      }))
      .filter((point): point is { label: string; value: number } => point.label.trim() !== "" && point.value !== null)
    if (points.length === 0) return null
    return {
      kind: chartType,
      series: [{ name: valueColumn, points }],
      xLabel: xAxisColumn,
      yLabel: valueColumn,
    }
  }

  if (templateType === DATASET_TEMPLATE.STATE_WISE) {
    const { stateColumn, valueColumn } = visualizationConfig
    if (!stateColumn || !valueColumn) return null
    const states = rows
      .map(({ data }) => ({
        state: labelOf(data[stateColumn]),
        value: numberOrNull(data[valueColumn]),
      }))
      .filter((entry): entry is { state: string; value: number } => entry.state.trim() !== "" && entry.value !== null)
    if (states.length === 0) return null
    return { kind: CHART_TYPE.STATE_HEATMAP, states }
  }

  if (templateType === DATASET_TEMPLATE.LAT_LONG) {
    const { latitudeColumn, longitudeColumn, valueColumn } = visualizationConfig
    if (!latitudeColumn || !longitudeColumn || !valueColumn) return null
    const points = rows
      .map(({ data, rowIndex }) => {
        const latitude = numberOrNull(data[latitudeColumn])
        const longitude = numberOrNull(data[longitudeColumn])
        const value = numberOrNull(data[valueColumn])
        if (latitude === null || longitude === null || value === null) return null
        return {
          id: `row-${rowIndex}`,
          name: valueColumn,
          latitude,
          longitude,
          value,
        }
      })
      .filter((point): point is NonNullable<typeof point> => point !== null)
    if (points.length === 0) return null
    return { kind: CHART_TYPE.INDIA_MAP, points }
  }

  return null
}