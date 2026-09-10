import { useRef, useState } from "react"
import { FileSpreadsheet, CheckCircle2, XCircle, UploadCloud, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { DATASET_UPLOAD_PHASE } from "@/constants/dataset/dataset.constants"
import type { DatasetUploadPhase } from "@/constants/dataset/dataset.types"
import { formatNumber } from "@/lib/format"
import { formatFileSize } from "../csv"
import type { ParsedCSV } from "../types/add-dataset.types"
import { StepSection } from "./StepSection"

interface DatasetFileStepProps {
  phase: DatasetUploadPhase
  file: File | null
  parsed: ParsedCSV | null
  errors: string[]
  onFile: (file: File | null) => void
}

export function DatasetFileStep({ phase, file, parsed, errors, onFile }: DatasetFileStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function acceptFile(next?: File | null) {
    if (!next) return
    if (next.type === "text/csv" || next.name.toLowerCase().endsWith(".csv")) {
      onFile(next)
    }
  }

  function clearInput() {
    if (inputRef.current) inputRef.current.value = ""
  }

  function startOver() {
    clearInput()
    onFile(null)
  }

  const dropZone = (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload CSV file"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        acceptFile(e.dataTransfer.files?.[0])
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors",
        dragging
          ? "border-primary bg-primary/5"
          : "border-input bg-muted/20 hover:border-primary/50 hover:bg-muted/30"
      )}
    >
      <UploadCloud className="size-8 text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">Drag &amp; drop your CSV file here</p>
        <p className="text-xs text-muted-foreground">or</p>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
          inputRef.current?.click()
        }}
      >
        Browse files
      </Button>
      <p className="text-[11px] text-muted-foreground">Accepted format: CSV only</p>
    </div>
  )

  const analyzingCard = (
    <div className="flex items-center gap-3 rounded-lg border bg-muted/20 p-5">
      <Loader2 className="size-5 shrink-0 animate-spin text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">Analyzing dataset…</p>
        <p className="truncate text-xs text-muted-foreground">{file?.name}</p>
      </div>
    </div>
  )

  const errorCard = (
    <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-5">
      <div className="flex items-start gap-3">
        <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-foreground">Unable to read CSV</p>
          <p className="text-sm text-muted-foreground">
            The uploaded file could not be parsed. Please check that the file is a valid CSV.
          </p>
          {errors.length > 0 && (
            <ul className="list-inside list-disc space-y-0.5 pt-1 text-xs text-destructive">
              {errors.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="button" variant="outline" size="sm" onClick={startOver}>
          <UploadCloud className="size-4" />
          Try another file
        </Button>
      </div>
    </div>
  )

  const fileCard =
    file && parsed ? (
      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-primary">
              <FileSpreadsheet className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)} · {formatNumber(parsed.rowCount)} rows
              </p>
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={startOver}>
            Replace file
          </Button>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t pt-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            CSV file
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="size-3.5" />
            Successfully parsed
          </span>
        </div>
      </div>
    ) : null

  return (
    <StepSection heading="1 · Dataset File" description="Upload a CSV file to create a visualization.">
      <div className="space-y-3">
        <Label htmlFor="csv-file-input" className="sr-only">
          Choose CSV file
        </Label>
        <Input
          ref={inputRef}
          id="csv-file-input"
          type="file"
          accept=".csv,text/csv"
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => acceptFile(e.target.files?.[0])}
        />

        {phase === DATASET_UPLOAD_PHASE.IDLE
          ? dropZone
          : phase === DATASET_UPLOAD_PHASE.UPLOADING
            ? analyzingCard
            : phase === DATASET_UPLOAD_PHASE.INVALID
              ? errorCard
              : fileCard}
      </div>
    </StepSection>
  )
}