import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { addMockDataset } from "@/lib/dataset-store"
import {
  APPROVAL_STATUS,
  CHART_TYPE,
  DATASET_ACTIVE_STATUS,
  DATASET_TEMPLATE,
  DATASET_UPLOAD_PHASE,
} from "@/constants/dataset/dataset.constants"
import type { Dataset, DatasetTemplate, Domain } from "@/constants/dataset/dataset.types"
import { SUBMIT_STATUS } from "@/constants/form/form.constants"
import type { SubmitStatus } from "@/constants/form/form.types"
import { DatasetFileStep } from "./components/DatasetFileStep"
import { SchemaTable } from "./components/SchemaTable"
import { VisualizationConfig } from "./components/VisualizationConfig"
import { DataPreviewTable } from "./components/DataPreviewTable"
import { VisualizationDetails } from "./components/VisualizationDetails"
import { ChartPreview } from "./components/ChartPreview"
import { SubmitPanel } from "./components/SubmitPanel"
import { SuccessPanel } from "./components/SuccessPanel"
import { suggestColumns } from "./csv"
import { buildChartData } from "./chart-builder"
import { useDatasetUpload } from "./hooks/useDatasetUpload"
import type { SeriesType } from "./types/add-dataset.types"

export function AddDatasetForm() {
  const navigate = useNavigate()

  const [domain, setDomain] = useState<Domain | null>(null)
  const [templateType, setTemplateType] = useState<DatasetTemplate | null>(null)
  const [seriesType, setSeriesType] = useState<SeriesType>(CHART_TYPE.LINE)
  const [xColumn, setXColumn] = useState("")
  const [valueColumn, setValueColumn] = useState("")
  const [stateColumn, setStateColumn] = useState("")
  const [latitudeColumn, setLatitudeColumn] = useState("")
  const [longitudeColumn, setLongitudeColumn] = useState("")
  const [title, setTitle] = useState("")

  const { file, phase, parsed, errors, selectFile, reset: resetUpload } = useDatasetUpload((result) => {
    setTemplateType(DATASET_TEMPLATE.TIMESERIES)
    const suggestion = suggestColumns(result, DATASET_TEMPLATE.TIMESERIES)
    setXColumn(suggestion.xColumn ?? "")
    setValueColumn(suggestion.valueColumn ?? "")
  })

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(SUBMIT_STATUS.IDLE)

  const chartData = useMemo(
    () =>
      parsed
        ? buildChartData({
          parsed,
          templateType,
          seriesType,
          xColumn,
          valueColumn,
          stateColumn,
          latitudeColumn,
          longitudeColumn,
        })
        : null,
    [parsed, templateType, seriesType, xColumn, valueColumn, stateColumn, latitudeColumn, longitudeColumn]
  )

  const configComplete =
    templateType === DATASET_TEMPLATE.TIMESERIES
      ? Boolean(xColumn && valueColumn)
      : templateType === DATASET_TEMPLATE.STATEWISE
        ? Boolean(stateColumn && valueColumn)
        : templateType === DATASET_TEMPLATE.LATLON
          ? Boolean(latitudeColumn && longitudeColumn && valueColumn)
          : false

  const canSubmit =
    phase === DATASET_UPLOAD_PHASE.VALID &&
    Boolean(parsed) &&
    Boolean(domain) &&
    Boolean(templateType) &&
    configComplete &&
    title.trim().length > 0 &&
    submitStatus !== SUBMIT_STATUS.SUBMITTING

  function resetForm() {
    resetUpload()
    setDomain(null)
    setTemplateType(null)
    setSeriesType(CHART_TYPE.LINE)
    setXColumn("")
    setValueColumn("")
    setStateColumn("")
    setLatitudeColumn("")
    setLongitudeColumn("")
    setTitle("")
    setSubmitStatus(SUBMIT_STATUS.IDLE)
  }

  function handleTemplateChange(next: DatasetTemplate) {
    setTemplateType(next)
    if (!parsed) return

    const suggestion = suggestColumns(parsed, next)
    if (next === DATASET_TEMPLATE.TIMESERIES) {
      setXColumn(suggestion.xColumn ?? "")
      setValueColumn(suggestion.valueColumn ?? "")
    } else if (next === DATASET_TEMPLATE.STATEWISE) {
      setStateColumn(suggestion.stateColumn ?? "")
      setValueColumn(suggestion.valueColumn ?? "")
    } else {
      setLatitudeColumn(suggestion.latitudeColumn ?? "")
      setLongitudeColumn(suggestion.longitudeColumn ?? "")
      setValueColumn(suggestion.valueColumn ?? "")
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit || !parsed || !domain || !templateType || !chartData) return

    setSubmitStatus(SUBMIT_STATUS.SUBMITTING)
    window.setTimeout(() => {
      const chartType: Dataset["chartType"] =
        templateType === DATASET_TEMPLATE.TIMESERIES
          ? seriesType
          : templateType === DATASET_TEMPLATE.STATEWISE
            ? CHART_TYPE.STATE_HEATMAP
            : CHART_TYPE.INDIA_MAP
      const newDataset: Dataset = {
        id: `ds-${Date.now()}`,
        title: title.trim(),
        description: "Submitted from the Add Dataset workflow. Awaiting review.",
        domain,
        chartType,
        templateType,
        data: chartData,
        uploadedBy: "admin@vasudha.org",
        uploadedById: "adm-001",
        status: APPROVAL_STATUS.PENDING,
        activeStatus: DATASET_ACTIVE_STATUS.ACTIVE,
        fileName: file?.name ?? "dataset.csv",
        rowCount: parsed.rowCount,
        createdAt: new Date().toISOString(),
      }
      addMockDataset(newDataset)
      setSubmitStatus(SUBMIT_STATUS.SUCCESS)
      toast.success("Dataset submitted for Super Admin approval.")
    }, 900)
  }

  if (submitStatus === SUBMIT_STATUS.SUCCESS) {
    return <SuccessPanel title={title.trim()} onBackToDashboard={() => navigate("/admin")} />
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <section className="space-y-4 rounded-lg border bg-card p-5 sm:p-6">
        <div>
          <h2 className="font-heading text-base font-semibold tracking-tight">1 · Dataset File</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Upload a CSV file to create a visualization.</p>
        </div>
        <DatasetFileStep phase={phase} file={file} parsed={parsed} errors={errors} onFile={selectFile} />
      </section>

      {phase === DATASET_UPLOAD_PHASE.VALID && parsed && (
        <>
          <section className="space-y-4 rounded-lg border bg-card p-5 sm:p-6">
            <div>
              <h2 className="font-heading text-base font-semibold tracking-tight">2 · Detected Dataset Structure</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">The columns detected in your file and their types.</p>
            </div>
            <SchemaTable parsed={parsed} />
          </section>

          <section className="space-y-4 rounded-lg border bg-card p-5 sm:p-6">
            <div>
              <h2 className="font-heading text-base font-semibold tracking-tight">3 · Visualization</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Choose a visualization type and map the columns from your file.
              </p>
            </div>
            <VisualizationConfig
              parsed={parsed}
              templateType={templateType}
              seriesType={seriesType}
              xColumn={xColumn}
              valueColumn={valueColumn}
              stateColumn={stateColumn}
              latitudeColumn={latitudeColumn}
              longitudeColumn={longitudeColumn}
              onTemplateChange={handleTemplateChange}
              onSeriesTypeChange={setSeriesType}
              onXColumnChange={setXColumn}
              onValueColumnChange={setValueColumn}
              onStateColumnChange={setStateColumn}
              onLatitudeColumnChange={setLatitudeColumn}
              onLongitudeColumnChange={setLongitudeColumn}
            />
          </section>

          {templateType && (
            <section className="space-y-4 rounded-lg border bg-card p-5 sm:p-6">
              <div>
                <h2 className="font-heading text-base font-semibold tracking-tight">4 · Dataset Preview</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">Verify the first few rows of your file.</p>
              </div>
              <DataPreviewTable parsed={parsed} />
            </section>
          )}

          <section className="space-y-4 rounded-lg border bg-card p-5 sm:p-6">
            <div>
              <h2 className="font-heading text-base font-semibold tracking-tight">5 · Visualization Details</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Set a title and assign the visualization to a domain.</p>
            </div>
            <VisualizationDetails title={title} domain={domain} onTitleChange={setTitle} onDomainChange={setDomain} />
          </section>

          {chartData && templateType && (
            <section className="space-y-4 rounded-lg border bg-card p-5 sm:p-6">
              <div>
                <h2 className="font-heading text-base font-semibold tracking-tight">6 · Visualization Preview</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  This is how your visualization will render with the selected columns.
                </p>
              </div>
              <ChartPreview
                data={chartData}
                title={title}
                domain={domain}
                templateType={templateType}
                seriesType={seriesType}
              />
            </section>
          )}

          <SubmitPanel canSubmit={canSubmit} isSubmitting={submitStatus === SUBMIT_STATUS.SUBMITTING} onCancel={resetForm} />
        </>
      )}
    </form>
  )
}