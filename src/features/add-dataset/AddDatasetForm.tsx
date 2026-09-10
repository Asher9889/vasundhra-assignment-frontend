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
import type { ParsedCSV, SeriesType } from "./types/add-dataset.types"

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



  const { file, phase, parsedData, errors, selectFile, reset: resetUpload } = useDatasetUpload(applyParsedDefaults);

  function applyParsedDefaults(result: ParsedCSV) {
    setTemplateType(DATASET_TEMPLATE.TIMESERIES)
    const suggestion = suggestColumns(result, DATASET_TEMPLATE.TIMESERIES)
    setXColumn(suggestion.xColumn ?? "")
    setValueColumn(suggestion.valueColumn ?? "")
  }

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(SUBMIT_STATUS.IDLE)

  const chartData = useMemo(
    () =>
      parsedData
        ? buildChartData({
          parsed: parsedData,
          templateType,
          seriesType,
          xColumn,
          valueColumn,
          stateColumn,
          latitudeColumn,
          longitudeColumn,
        })
        : null,
    [parsedData, templateType, seriesType, xColumn, valueColumn, stateColumn, latitudeColumn, longitudeColumn]
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
    Boolean(parsedData) &&
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
    if (!parsedData) return

    const suggestion = suggestColumns(parsedData, next)
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
    if (!canSubmit || !parsedData || !domain || !templateType || !chartData) return

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
        rowCount: parsedData.rowCount,
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
      <DatasetFileStep phase={phase} file={file} parsed={parsedData} errors={errors} onFile={selectFile} />

      {phase === DATASET_UPLOAD_PHASE.VALID && parsedData && (
        <>
          <SchemaTable parsed={parsedData} />

          <VisualizationConfig
            parsed={parsedData}
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

          {templateType && <DataPreviewTable parsed={parsedData} />}

          <VisualizationDetails title={title} domain={domain} onTitleChange={setTitle} onDomainChange={setDomain} />

          {chartData && templateType && (
            <ChartPreview
              data={chartData}
              title={title}
              domain={domain}
              templateType={templateType}
              seriesType={seriesType}
            />
          )}

          <SubmitPanel
            canSubmit={canSubmit}
            isSubmitting={submitStatus === SUBMIT_STATUS.SUBMITTING}
            onCancel={resetForm}
          />
        </>
      )}
    </form>
  )
}