import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ColumnSelect } from "@/features/add-dataset/components/ColumnSelect"
import { suggestColumns } from "@/features/add-dataset/csv"
import { useDatasetDetailQuery } from "./hooks/useDatasetDetailQuery"
import { useUpdateDatasetMutation } from "./hooks/useUpdateDatasetMutation"
import { cn } from "@/lib/utils"
import { domainLabels } from "@/lib/format"
import {
  CHART_TYPE,
  DATASET_TEMPLATE,
  DOMAIN,
} from "@/constants/dataset/dataset.constants"
import type { ChartType, DatasetTemplate, Domain } from "@/constants/dataset/dataset.types"
import type { DatasetVisualizationConfig } from "./types/datasets.types"

interface EditDatasetDialogProps {
  datasetId: string | null
  onClose: () => void
}

interface EditFormState {
  title: string
  domain: Domain
  templateType: DatasetTemplate
  chartType: ChartType
  xColumn: string
  valueColumn: string
  stateColumn: string
  latitudeColumn: string
  longitudeColumn: string
}

const templates: Array<{ value: DatasetTemplate; label: string; hint: string }> = [
  { value: DATASET_TEMPLATE.LAT_LONG, label: "Latitude / Longitude", hint: "Points on a map" },
  { value: DATASET_TEMPLATE.STATE_WISE, label: "State-wise", hint: "Values per state" },
  { value: DATASET_TEMPLATE.TIME_SERIES, label: "Time-series", hint: "Values over time" },
]

const seriesOptions: Array<{ value: ChartType; label: string }> = [
  { value: CHART_TYPE.LINE, label: "Line Chart" },
  { value: CHART_TYPE.BAR, label: "Bar Chart" },
  { value: CHART_TYPE.AREA, label: "Area Chart" },
]

export function EditDatasetDialog({ datasetId, onClose }: EditDatasetDialogProps) {
  const { detail, isPending, isError } = useDatasetDetailQuery(datasetId ?? undefined)
  const update = useUpdateDatasetMutation()
  const [form, setForm] = useState<EditFormState | null>(null)

  useEffect(() => {
    if (!detail) return
    const config = detail.visualizationConfig
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot init from async query; not a cascading render
    setForm({
      title: detail.title,
      domain: detail.domain,
      templateType: detail.templateType,
      chartType: detail.chartType,
      xColumn: config?.xAxisColumn ?? "",
      valueColumn: config?.valueColumn ?? "",
      stateColumn: config?.stateColumn ?? "",
      latitudeColumn: config?.latitudeColumn ?? "",
      longitudeColumn: config?.longitudeColumn ?? "",
    })
  }, [detail])

  useEffect(() => {
    if (update.isSuccess) onClose()
  }, [update.isSuccess, onClose])

  const columns = useMemo(() => detail?.csvSchema?.columns ?? [], [detail])

  const allColumns = columns.map((column) => column.name)
  const numericColumns = columns.filter((column) => column.type === "NUMBER").map((column) => column.name)
  const stringColumns = columns.filter((column) => column.type === "STRING").map((column) => column.name)

  const valueOptions = numericColumns.length > 0 ? numericColumns : allColumns
  const stateOptions = stringColumns.length > 0 ? stringColumns : allColumns

  function applyTemplate(next: DatasetTemplate) {
    setForm((current) => {
      if (!current) return current
      const suggestions = suggestColumns({ columns }, next)
      let chartType = current.chartType
      if (next === DATASET_TEMPLATE.TIME_SERIES) {
        if (current.chartType !== CHART_TYPE.LINE && current.chartType !== CHART_TYPE.BAR && current.chartType !== CHART_TYPE.AREA) {
          chartType = CHART_TYPE.LINE
        }
      } else if (next === DATASET_TEMPLATE.STATE_WISE) {
        chartType = CHART_TYPE.STATE_HEATMAP
      } else {
        chartType = CHART_TYPE.INDIA_MAP
      }
      return {
        ...current,
        templateType: next,
        chartType,
        xColumn: suggestions.xColumn ?? "",
        valueColumn: suggestions.valueColumn ?? "",
        stateColumn: suggestions.stateColumn ?? "",
        latitudeColumn: suggestions.latitudeColumn ?? "",
        longitudeColumn: suggestions.longitudeColumn ?? "",
      }
    })
  }

  const configComplete =
    form !== null &&
    form.title.trim().length > 0 &&
    (form.templateType === DATASET_TEMPLATE.LAT_LONG
      ? Boolean(form.latitudeColumn && form.longitudeColumn && form.valueColumn)
      : form.templateType === DATASET_TEMPLATE.STATE_WISE
        ? Boolean(form.stateColumn && form.valueColumn)
        : Boolean(form.xColumn && form.valueColumn))

  function handleSave() {
    if (!form || !datasetId || !configComplete) return

    const visualizationConfig: DatasetVisualizationConfig = {}
    if (form.templateType === DATASET_TEMPLATE.LAT_LONG) {
      visualizationConfig.latitudeColumn = form.latitudeColumn
      visualizationConfig.longitudeColumn = form.longitudeColumn
      visualizationConfig.valueColumn = form.valueColumn
    } else if (form.templateType === DATASET_TEMPLATE.STATE_WISE) {
      visualizationConfig.stateColumn = form.stateColumn
      visualizationConfig.valueColumn = form.valueColumn
    } else {
      visualizationConfig.xAxisColumn = form.xColumn
      visualizationConfig.valueColumn = form.valueColumn
    }

    update.mutate({
      id: datasetId,
      payload: {
        title: form.title.trim(),
        domain: form.domain,
        templateType: form.templateType,
        chartType: form.chartType,
        visualizationConfig,
      },
    })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit dataset</DialogTitle>
          <DialogDescription>
            Update the metadata and visualization configuration. Uploaded row data is not modified.
          </DialogDescription>
        </DialogHeader>

        {isPending || !form ? (
          <div className="space-y-4 py-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        ) : isError ? (
          <p className="py-4 text-sm text-destructive">Couldn&apos;t load this dataset. Please close and try again.</p>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Chart Title</Label>
              <Input
                id="edit-title"
                value={form.title}
                onChange={(event) => setForm((current) => (current ? { ...current, title: event.target.value } : current))}
                placeholder="e.g. Renewable Energy Capacity – State Wise"
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label id="edit-domain-label">Domain</Label>
              <Select
                value={form.domain}
                onValueChange={(next) =>
                  setForm((current) => (current ? { ...current, domain: next as Domain } : current))
                }
              >
                <SelectTrigger className="w-full cursor-pointer" id="edit-domain">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(DOMAIN).map((value) => (
                    <SelectItem key={value} value={value}>
                      {domainLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label id="edit-template-label">Dataset / Visualization Type</Label>
              <div role="radiogroup" aria-labelledby="edit-template-label" className="grid gap-2 sm:grid-cols-3">
                {templates.map((template) => {
                  const selected = form.templateType === template.value
                  return (
                    <button
                      key={template.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => applyTemplate(template.value)}
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

            {form.templateType === DATASET_TEMPLATE.TIME_SERIES && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label id="edit-series-label">Chart Type</Label>
                  <Select
                    value={form.chartType}
                    onValueChange={(next) =>
                      setForm((current) => (current ? { ...current, chartType: next as ChartType } : current))
                    }
                  >
                    <SelectTrigger className="w-full cursor-pointer" id="edit-series">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {seriesOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <ColumnSelect
                  label="X-axis column"
                  value={form.xColumn}
                  options={allColumns}
                  onChange={(value) => setForm((current) => (current ? { ...current, xColumn: value } : current))}
                  id="edit-x-column"
                />
                <ColumnSelect
                  label="Value column"
                  value={form.valueColumn}
                  options={valueOptions}
                  onChange={(value) => setForm((current) => (current ? { ...current, valueColumn: value } : current))}
                  id="edit-value-column"
                />
              </div>
            )}

            {form.templateType === DATASET_TEMPLATE.STATE_WISE && (
              <div className="grid gap-4 sm:grid-cols-2">
                <ColumnSelect
                  label="State column"
                  value={form.stateColumn}
                  options={stateOptions}
                  onChange={(value) => setForm((current) => (current ? { ...current, stateColumn: value } : current))}
                  id="edit-state-column"
                />
                <ColumnSelect
                  label="Value column"
                  value={form.valueColumn}
                  options={valueOptions}
                  onChange={(value) => setForm((current) => (current ? { ...current, valueColumn: value } : current))}
                  id="edit-value-column"
                />
              </div>
            )}

            {form.templateType === DATASET_TEMPLATE.LAT_LONG && (
              <div className="grid gap-4 sm:grid-cols-3">
                <ColumnSelect
                  label="Latitude column"
                  value={form.latitudeColumn}
                  options={allColumns}
                  onChange={(value) => setForm((current) => (current ? { ...current, latitudeColumn: value } : current))}
                  id="edit-latitude-column"
                />
                <ColumnSelect
                  label="Longitude column"
                  value={form.longitudeColumn}
                  options={allColumns}
                  onChange={(value) => setForm((current) => (current ? { ...current, longitudeColumn: value } : current))}
                  id="edit-longitude-column"
                />
                <ColumnSelect
                  label="Value column"
                  value={form.valueColumn}
                  options={valueOptions}
                  onChange={(value) => setForm((current) => (current ? { ...current, valueColumn: value } : current))}
                  id="edit-value-column"
                />
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={update.isPending}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!configComplete || update.isPending}>
            {update.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}