import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ColumnSelect } from "./ColumnSelect"
import { columnNames, columnNamesOfType } from "../csv"
import type { ParsedCSV, SeriesType } from "../types/add-dataset.types"
import {
  CHART_TYPE,
  DATASET_TEMPLATE,
} from "@/constants/dataset/dataset.constants"
import type { DatasetTemplate } from "@/constants/dataset/dataset.types"

interface VisualizationConfigProps {
  parsed: ParsedCSV
  templateType: DatasetTemplate | null
  seriesType: SeriesType
  xColumn: string
  valueColumn: string
  stateColumn: string
  latitudeColumn: string
  longitudeColumn: string
  onTemplateChange: (template: DatasetTemplate) => void
  onSeriesTypeChange: (value: SeriesType) => void
  onXColumnChange: (value: string) => void
  onValueColumnChange: (value: string) => void
  onStateColumnChange: (value: string) => void
  onLatitudeColumnChange: (value: string) => void
  onLongitudeColumnChange: (value: string) => void
}

const templates: Array<{ value: DatasetTemplate; label: string; hint: string }> = [
  { value: DATASET_TEMPLATE.LATLON, label: "Latitude / Longitude", hint: "Points on a map" },
  { value: DATASET_TEMPLATE.STATEWISE, label: "State-wise", hint: "Values per state" },
  { value: DATASET_TEMPLATE.TIMESERIES, label: "Time-series", hint: "Values over time" },
]

const seriesOptions: Array<{ value: SeriesType; label: string }> = [
  { value: CHART_TYPE.LINE, label: "Line Chart" },
  { value: CHART_TYPE.BAR, label: "Bar Chart" },
  { value: CHART_TYPE.AREA, label: "Area Chart" },
]

export function VisualizationConfig({
  parsed,
  templateType,
  seriesType,
  xColumn,
  valueColumn,
  stateColumn,
  latitudeColumn,
  longitudeColumn,
  onTemplateChange,
  onSeriesTypeChange,
  onXColumnChange,
  onValueColumnChange,
  onStateColumnChange,
  onLatitudeColumnChange,
  onLongitudeColumnChange,
}: VisualizationConfigProps) {
  const allColumns = columnNames(parsed)
  const numericColumns = columnNamesOfType(parsed, "NUMBER")
  const stringColumns = columnNamesOfType(parsed, "STRING")

  const valueOptions = numericColumns.length > 0 ? numericColumns : allColumns
  const axisOptions: string[] = allColumns
  const stateOptions = stringColumns.length > 0 ? stringColumns : allColumns

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label id="template-label">Dataset / Visualization Type</Label>
        <div role="radiogroup" aria-labelledby="template-label" className="grid gap-2 sm:grid-cols-3">
          {templates.map((template) => {
            const selected = templateType === template.value
            return (
              <button
                key={template.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onTemplateChange(template.value)}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                  selected
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-input text-muted-foreground hover:border-primary/40"
                )}
              >
                <span className="font-medium">{template.label}</span>
                <span className="hidden text-xs sm:block">{template.hint}</span>
              </button>
            )
          })}
        </div>
      </div>

      {templateType === DATASET_TEMPLATE.TIMESERIES && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="series-type">Chart Type</Label>
            <Select value={seriesType} onValueChange={(next) => onSeriesTypeChange(next as SeriesType)}>
              <SelectTrigger className="w-full cursor-pointer" id="series-type">
                <SelectValue placeholder="Select a chart type" />
              </SelectTrigger>
              <SelectContent>
                {seriesOptions.map((option) => (
                  <SelectItem className="cursor-pointer" key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ColumnSelect label="X-axis column" value={xColumn} options={axisOptions} onChange={onXColumnChange} id="x-column" />
          <ColumnSelect label="Value column" value={valueColumn} options={valueOptions} onChange={onValueColumnChange} id="value-column" />
        </div>
      )}

      {templateType === DATASET_TEMPLATE.STATEWISE && (
        <div className="grid gap-4 sm:grid-cols-2">
          <ColumnSelect label="State column" value={stateColumn} options={stateOptions} onChange={onStateColumnChange} id="state-column" />
          <ColumnSelect label="Value column" value={valueColumn} options={valueOptions} onChange={onValueColumnChange} id="value-column" />
        </div>
      )}

      {templateType === DATASET_TEMPLATE.LATLON && (
        <div className="grid gap-4 sm:grid-cols-3">
          <ColumnSelect label="Latitude column" value={latitudeColumn} options={allColumns} onChange={onLatitudeColumnChange} id="latitude-column" />
          <ColumnSelect label="Longitude column" value={longitudeColumn} options={allColumns} onChange={onLongitudeColumnChange} id="longitude-column" />
          <ColumnSelect label="Value column" value={valueColumn} options={valueOptions} onChange={onValueColumnChange} id="value-column" />
        </div>
      )}
    </div>
  )
}