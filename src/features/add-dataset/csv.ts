import { DATASET_TEMPLATE } from "@/constants/dataset/dataset.constants"
import type { DatasetTemplate } from "@/constants/dataset/dataset.types"
import type { ColumnType, ParsedCSV } from "./types/add-dataset.types"

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(1)} KB`
}

export function columnNames(parsed: ParsedCSV): string[] {
  return parsed.columns.map((column) => column.name)
}

export function columnNamesOfType(parsed: ParsedCSV, type: ColumnType): string[] {
  return parsed.columns.filter((column) => column.type === type).map((column) => column.name)
}

export interface ColumnSuggestions {
  xColumn?: string
  valueColumn?: string
  stateColumn?: string
  latitudeColumn?: string
  longitudeColumn?: string
}

const dimensionLike = /^(year|month|day|date|period|id|index|sno|serial)/i

function pickValueColumn(numeric: string[], excluded: string[] = []): string | undefined {
  return (
    numeric.find((name) => !excluded.includes(name) && !dimensionLike.test(name)) ??
    numeric.find((name) => !excluded.includes(name)) ??
    numeric[0]
  )
}

export function suggestColumns(parsed: ParsedCSV, template: DatasetTemplate): ColumnSuggestions {
  const names = columnNames(parsed)
  const numeric = columnNamesOfType(parsed, "NUMBER")
  const strings = columnNamesOfType(parsed, "STRING")

  switch (template) {
    case DATASET_TEMPLATE.TIMESERIES: {
      const xColumn =
        names.find((name) => /^(date|year|month|day|period)/i.test(name)) ??
        columnNamesOfType(parsed, "DATE")[0] ??
        names[0]
      const valueColumn = pickValueColumn(numeric, [xColumn])
      return { xColumn, valueColumn }
    }
    case DATASET_TEMPLATE.STATEWISE: {
      const stateColumn = strings.find((name) => /state|region|district/i.test(name)) ?? strings[0] ?? names[0]
      const valueColumn = pickValueColumn(numeric, [stateColumn])
      return { stateColumn, valueColumn }
    }
    case DATASET_TEMPLATE.LATLON: {
      const latitudeColumn = names.find((name) => /^lat/i.test(name)) ?? numeric[0]
      const longitudeColumn = names.find((name) => /lon|long/i.test(name)) ?? numeric.find((name) => name !== latitudeColumn)
      const valueColumn = pickValueColumn(
        numeric,
        [latitudeColumn, longitudeColumn].filter((column): column is string => Boolean(column))
      )
      return { latitudeColumn, longitudeColumn, valueColumn }
    }
  }
}