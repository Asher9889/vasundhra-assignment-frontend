import { CHART_TYPE, DATASET_TEMPLATE } from "@/constants/dataset/dataset.constants"
import type { ChartData, DatasetTemplate } from "@/constants/dataset/dataset.types"
import type { ParsedCSV, SeriesType } from "./types/add-dataset.types"

interface BuildChartDataParams {
  parsed: ParsedCSV
  templateType: DatasetTemplate | null
  seriesType: SeriesType
  xColumn: string
  valueColumn: string
  stateColumn: string
  latitudeColumn: string
  longitudeColumn: string
}

function toRecords(parsed: ParsedCSV): Array<Record<string, string>> {
  return parsed.rows.map((row) => {
    const record: Record<string, string> = {}
    parsed.columns.forEach((column, index) => {
      record[column.name] = row[index] ?? ""
    })
    return record
  })
}

export function buildChartData({
  parsed,
  templateType,
  seriesType,
  xColumn,
  valueColumn,
  stateColumn,
  latitudeColumn,
  longitudeColumn,
}: BuildChartDataParams): ChartData | null {
  if (!templateType || parsed.rows.length === 0) return null
  const records = toRecords(parsed)

  if (templateType === DATASET_TEMPLATE.TIME_SERIES) {
    if (!xColumn || !valueColumn) return null
    const points = records
      .map((record) => ({
        label: record[xColumn] || "",
        value: Number(record[valueColumn]),
      }))
      .filter((point) => point.label.trim() !== "" && !Number.isNaN(point.value))
    if (points.length === 0) return null
    return {
      kind: seriesType,
      series: [{ name: valueColumn, points }],
      xLabel: xColumn,
      yLabel: valueColumn,
    }
  }

  if (templateType === DATASET_TEMPLATE.STATE_WISE) {
    if (!stateColumn || !valueColumn) return null
    const states = records
      .map((record) => ({
        state: record[stateColumn] || "",
        value: Number(record[valueColumn]),
      }))
      .filter((entry) => entry.state.trim() !== "" && !Number.isNaN(entry.value))
    if (states.length === 0) return null
    return { kind: CHART_TYPE.STATE_HEATMAP, states }
  }

  if (!latitudeColumn || !longitudeColumn || !valueColumn) return null
  const points = records
    .map((record, index) => ({
      id: `pv-${index}`,
      name: record[valueColumn] || `Point ${index + 1}`,
      latitude: Number(record[latitudeColumn]),
      longitude: Number(record[longitudeColumn]),
      value: Number(record[valueColumn]),
    }))
    .filter(
      (point) => !Number.isNaN(point.latitude) && !Number.isNaN(point.longitude) && !Number.isNaN(point.value)
    )
  if (points.length === 0) return null
  return { kind: CHART_TYPE.INDIA_MAP, points }
}