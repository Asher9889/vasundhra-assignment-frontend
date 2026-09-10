import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import {
  CHART_TYPE,
  DATASET_TEMPLATE,
  DATASET_UPLOAD_PHASE,
} from "@/constants/dataset/dataset.constants"
import type { DatasetTemplate, Domain } from "@/constants/dataset/dataset.types"
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
import { useCreateDataset } from "./hooks/useCreateDataset"
import type { CreateDatasetVisualizationConfig, SeriesType } from "./types/add-dataset.types"

export function AddDatasetForm() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [domain, setDomain] = useState<Domain | null>(null)
  const [templateType, setTemplateType] = useState<DatasetTemplate | null>(null)
  const [seriesType, setSeriesType] = useState<SeriesType>(CHART_TYPE.LINE)
  const [xColumn, setXColumn] = useState("")
  const [valueColumn, setValueColumn] = useState("")
  const [stateColumn, setStateColumn] = useState("")
  const [latitudeColumn, setLatitudeColumn] = useState("")
  const [longitudeColumn, setLongitudeColumn] = useState("")
  const [title, setTitle] = useState("")

  const { file, phase, parsedData, errors, selectFile, reset: resetUpload } = useDatasetUpload()
  const { createDataset, isPending: isCreating, isSuccess, data: creationResult, reset: resetCreation } = useCreateDataset()

  const chartData = useMemo(() => parsedData ? buildChartData({
    parsed: parsedData,
    templateType,
    seriesType,
    xColumn,
    valueColumn,
    stateColumn,
    latitudeColumn,
    longitudeColumn,
  }) : null,
    [parsedData, templateType, seriesType, xColumn, valueColumn, stateColumn, latitudeColumn, longitudeColumn]
  )

  const configComplete =
    templateType === DATASET_TEMPLATE.TIME_SERIES
      ? Boolean(xColumn && valueColumn)
      : templateType === DATASET_TEMPLATE.STATE_WISE
        ? Boolean(stateColumn && valueColumn)
        : templateType === DATASET_TEMPLATE.LAT_LONG
          ? Boolean(latitudeColumn && longitudeColumn && valueColumn)
          : false

  const canSubmit =
    phase === DATASET_UPLOAD_PHASE.VALID &&
    Boolean(parsedData) &&
    Boolean(domain) &&
    Boolean(templateType) &&
    configComplete &&
    title.trim().length > 0 &&
    Boolean(user?.id) &&
    !isCreating

  function resetForm() {
    resetUpload()
    resetCreation()
    setDomain(null)
    setTemplateType(null)
    setSeriesType(CHART_TYPE.LINE)
    setXColumn("")
    setValueColumn("")
    setStateColumn("")
    setLatitudeColumn("")
    setLongitudeColumn("")
    setTitle("")
  }

  function handleFileChange(next: File | null) {
    if (!next) {
      resetForm()
      return
    }
    setTemplateType(null)
    setSeriesType(CHART_TYPE.LINE)
    setXColumn("")
    setValueColumn("")
    setStateColumn("")
    setLatitudeColumn("")
    setLongitudeColumn("")
    selectFile(next)
  }

  function handleTemplateChange(next: DatasetTemplate) {
    setTemplateType(next)
    if (!parsedData) return

    const suggestion = suggestColumns(parsedData, next)
    if (next === DATASET_TEMPLATE.TIME_SERIES) {
      setXColumn(suggestion.xColumn ?? "")
      setValueColumn(suggestion.valueColumn ?? "")
    } else if (next === DATASET_TEMPLATE.STATE_WISE) {
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
    if (!canSubmit || !parsedData || !domain || !templateType || !user) return

    const chartType =
      templateType === DATASET_TEMPLATE.TIME_SERIES
        ? seriesType
        : templateType === DATASET_TEMPLATE.STATE_WISE
          ? CHART_TYPE.STATE_HEATMAP
          : CHART_TYPE.INDIA_MAP

    const visualizationConfig: CreateDatasetVisualizationConfig = {}
    if (templateType === DATASET_TEMPLATE.TIME_SERIES) {
      visualizationConfig.xAxisColumn = xColumn
      visualizationConfig.valueColumn = valueColumn
    } else if (templateType === DATASET_TEMPLATE.STATE_WISE) {
      visualizationConfig.stateColumn = stateColumn
      visualizationConfig.valueColumn = valueColumn
    } else if (templateType === DATASET_TEMPLATE.LAT_LONG) {
      visualizationConfig.latitudeColumn = latitudeColumn
      visualizationConfig.longitudeColumn = longitudeColumn
      visualizationConfig.valueColumn = valueColumn
    }

    createDataset(
      {
        fileKey: parsedData.fileKey,
        title: title.trim(),
        domain,
        templateType,
        chartType,
        uploadedBy: user.id,
        file: {
          originalName: file?.name ?? "dataset.csv",
          mimeType: file?.type ?? "text/csv",
          size: file?.size ?? 0,
        },
        csvSchema: { columns: parsedData.columns },
        visualizationConfig,
        rowCount: parsedData.validCount,
      },
      {
        onSuccess: () => {
          toast.success("Dataset submitted for Super Admin approval.")
        },
        onError: (error: unknown) => {
          const message = error instanceof Error ? error.message : "Failed to submit dataset. Please try again."
          toast.error(message)
        },
      }
    )
  }

  if (isSuccess && creationResult) {
    return <SuccessPanel title={title.trim()} onBackToDashboard={() => navigate("/admin")} />
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <DatasetFileStep phase={phase} file={file} parsed={parsedData} errors={errors} onFile={handleFileChange} />

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
            isSubmitting={isCreating}
            onCancel={resetForm}
          />
        </>
      )}
    </form>
  )
}