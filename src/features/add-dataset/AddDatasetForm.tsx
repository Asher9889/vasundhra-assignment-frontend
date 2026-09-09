import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Loader2, Send, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { DatasetUpload } from "@/components/dataset/DatasetUpload"
import { DatasetPreview } from "@/components/dataset/DatasetPreview"
import { SelectDomain } from "./SelectDomain"
import { cn } from "@/lib/utils"
import { addMockDataset } from "@/lib/dataset-store"
import { mockValidateCsv, sampleValidationErrors } from "@/mock/csv-validation"
import type { ChartData, Dataset, Domain, DatasetTemplate } from "@/types"
import type { CSVValidationResult, SubmitStatus, TimeseriesChartType } from "@/types/dataset-form"
import { templateLabels } from "@/lib/format"

const templates: Array<{ value: DatasetTemplate; label: string; hint: string }> = [
  { value: "latlon", label: "Latitude / Longitude", hint: "Points on a map" },
  { value: "statewise", label: "State-wise", hint: "Values per state" },
  { value: "timeseries", label: "Time-series", hint: "Values over time" },
]

const seriesOptions: TimeseriesChartType[] = [
  { value: "line", label: "Line" },
  { value: "bar", label: "Bar" },
  { value: "area", label: "Area" },
]

const columnGuides = {
  latlon: {
    columns: [
      { name: "latitude", description: "Decimal latitude, e.g. 28.6139" },
      { name: "longitude", description: "Decimal longitude, e.g. 77.2090" },
      { name: "value", description: "Numeric value for the point" },
    ],
  },
  statewise: {
    columns: [
      { name: "state", description: "State or union territory, e.g. Rajasthan" },
      { name: "value", description: "Numeric value for the state" },
    ],
  },
  timeseries: {
    columns: [
      { name: "date", description: "Date or year, e.g. 2024-01-01" },
      { name: "value", description: "Numeric value at that time" },
    ],
  },
} as const

export function AddDatasetForm() {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [validation, setValidation] = useState<CSVValidationResult>({ state: "idle", errors: [] })
  const [domain, setDomain] = useState<Domain | null>(null)
  const [templateType, setTemplateType] = useState<DatasetTemplate | null>(null)
  const [seriesType, setSeriesType] = useState<TimeseriesChartType["value"]>("line")
  const [title, setTitle] = useState("")
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (!file) return
    setValidation({ state: "uploading", errors: [] })
    const timer = window.setTimeout(() => {
      const name = file.name.toLowerCase()
      if (name.startsWith("invalid") || name.includes("broken")) {
        setValidation({ state: "invalid", errors: sampleValidationErrors, fileName: file.name })
      } else {
        setValidation(mockValidateCsv(file.name))
      }
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [file])

  const errors = touched
    ? {
        file: !file ? "A CSV file is required" : undefined,
        domain: !domain ? "Select a domain" : undefined,
        templateType: !templateType ? "Select a dataset type" : undefined,
        title: !title.trim() ? "Chart title is required" : undefined,
      }
    : {}

  const canSubmit =
    Boolean(file) && Boolean(domain) && Boolean(templateType) && title.trim().length > 0 && validation.state !== "invalid"

  function resetForm() {
    setFile(null)
    setValidation({ state: "idle", errors: [] })
    setDomain(null)
    setTemplateType(null)
    setSeriesType("line")
    setTitle("")
    setTouched(false)
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTouched(true)
    if (!canSubmit || submitStatus === "submitting") return

    setSubmitStatus("submitting")
    window.setTimeout(() => {
      const chartType: Dataset["chartType"] =
        templateType === "timeseries" ? seriesType : templateType === "statewise" ? "state-heatmap" : "india-map"
      const newDataset: Dataset = {
        id: `ds-${Date.now()}`,
        title: title.trim(),
        description: "Submitted from the Add Dataset workflow. Awaiting review.",
        domain: domain!,
        chartType,
        templateType: templateType!,
        data: makePreviewData(templateType!, seriesType),
        uploadedBy: "admin@vasudha.org",
        uploadedById: "adm-001",
        status: "pending",
        activeStatus: "active",
        fileName: file?.name ?? "dataset.csv",
        rowCount: validation.rowCount ?? 128,
        createdAt: new Date().toISOString(),
      }
      addMockDataset(newDataset)
      setSubmitStatus("success")
      toast.success("Dataset submitted for Super Admin approval.")
      resetForm()
      window.setTimeout(() => navigate("/admin"), 400)
    }, 900)
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <section className="space-y-4 rounded-lg border bg-card p-5">
        <div>
          <h2 className="font-heading text-base font-semibold tracking-tight">1 · CSV Dataset Upload</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Structure your CSV according to the selected template below.
          </p>
        </div>
        <DatasetUpload value={file} onChange={setFile} validation={validation} />
        {errors.file && (
          <p className="flex items-center gap-1 text-xs text-destructive">
            <AlertCircle className="size-3" />
            {errors.file}
          </p>
        )}
      </section>

      <section className="space-y-4 rounded-lg border bg-card p-5">
        <div>
          <h2 className="font-heading text-base font-semibold tracking-tight">2 · Configuration</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">Describe the dataset so it can be visualised correctly.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <SelectDomain value={domain} onChange={setDomain} id="domain" />
            {errors.domain && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="size-3" />
                {errors.domain}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label id="template-label">Dataset / Visualization Type</Label>
            <div role="radiogroup" aria-labelledby="template-label" className="grid grid-cols-1 gap-2">
              {templates.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  role="radio"
                  aria-checked={templateType === t.value}
                  onClick={() => setTemplateType(t.value)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    templateType === t.value
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-input text-muted-foreground hover:border-primary/40"
                  )}
                >
                  <span className="font-medium">{t.label}</span>
                  <span className="hidden text-xs sm:block">{t.hint}</span>
                </button>
              ))}
            </div>
            {errors.templateType && (
              <p className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="size-3" />
                {errors.templateType}
              </p>
            )}
          </div>
        </div>

        {templateType === "timeseries" && (
          <div className="space-y-2">
            <Label id="series-label">Time-series chart type</Label>
            <div role="radiogroup" aria-labelledby="series-label" className="flex flex-wrap gap-2">
              {seriesOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={seriesType === opt.value}
                  onClick={() => setSeriesType(opt.value)}
                  className={cn(
                    "rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors",
                    seriesType === opt.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {templateType && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-xs font-medium text-foreground">
              Required CSV columns — {templateLabels[templateType]}
            </p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {columnGuides[templateType].columns.map((c) => (
                <div key={c.name} className="rounded-md border bg-background p-2.5">
                  <code className="text-xs font-semibold text-primary">{c.name}</code>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-lg border bg-card p-5">
        <div>
          <h2 className="font-heading text-base font-semibold tracking-tight">3 · Chart Title</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">A short, descriptive title shown publicly with the visualization.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="chart-title">Title</Label>
          <Input
            id="chart-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. State-wise Solar Capacity"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="size-3" />
              {errors.title}
            </p>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border bg-card p-5">
        <div>
          <h2 className="font-heading text-base font-semibold tracking-tight">4 · Preview</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Live preview based on your selections. The final chart is generated from the uploaded data.
          </p>
        </div>
        {templateType ? (
          <DatasetPreview
            templateType={templateType}
            timeseriesChartType={seriesType}
            title={title.trim() || "Untitled visualization"}
            domain={domain ?? undefined}
          />
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Complete the configuration to preview the visualization.
          </div>
        )}
      </section>

      <section className="space-y-4 rounded-lg border bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" disabled={!canSubmit || submitStatus === "submitting" || validation.state === "uploading"}>
            {submitStatus === "submitting" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            {submitStatus === "submitting" ? "Submitting…" : "Submit Dataset"}
          </Button>
          <Button type="button" variant="ghost" onClick={resetForm} disabled={submitStatus === "submitting"}>
            Reset form
          </Button>
        </div>
        <div className="rounded-lg border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
          <strong className="font-medium text-foreground">Review workflow:</strong> New datasets are submitted for Super Admin
          approval and will remain hidden from the public website until approved.
        </div>
      </section>

    </form>
  )
}

function makePreviewData(template: DatasetTemplate, series: TimeseriesChartType["value"]): ChartData {
  if (template === "timeseries") {
    const base = [
      { label: "2015", value: 12 },
      { label: "2018", value: 18 },
      { label: "2021", value: 15 },
      { label: "2024", value: 24 },
    ]
    return { kind: series, series: [{ name: "Value", points: base }] }
  }
  if (template === "statewise") {
    return {
      kind: "state-heatmap",
      states: [
        { state: "Rajasthan", value: 24 },
        { state: "Gujarat", value: 32 },
        { state: "Tamil Nadu", value: 21 },
        { state: "Karnataka", value: 26 },
      ],
    }
  }
  return {
    kind: "india-map",
    points: [
      { id: "x1", name: "Sample Point A", latitude: 28.61, longitude: 77.2, value: 42 },
      { id: "x2", name: "Sample Point B", latitude: 19.07, longitude: 72.87, value: 18 },
      { id: "x3", name: "Sample Point C", latitude: 13.08, longitude: 80.27, value: 27 },
    ],
  }
}