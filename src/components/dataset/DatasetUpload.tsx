import { useRef, useState } from "react"
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CSVValidationResult } from "@/types/dataset-form"
import { cn } from "@/lib/utils"

interface DatasetUploadProps {
  value: File | null
  onChange: (file: File | null) => void
  validation: CSVValidationResult
  disabled?: boolean
}

export function DatasetUpload({ value, onChange, validation, disabled }: DatasetUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function acceptFile(file?: File | null) {
    if (!file) return
    if (file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")) {
      onChange(file)
    }
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    acceptFile(e.dataTransfer.files?.[0])
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        aria-label="Choose CSV file"
        onChange={(e) => acceptFile(e.target.files?.[0])}
        disabled={disabled}
      />

      {!value ? (
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
          onDrop={onDrop}
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
          <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            Browse files
          </Button>
          <p className="text-[11px] text-muted-foreground">Accepted format: CSV only</p>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/20 p-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md border bg-background text-primary">
              <FileSpreadsheet className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{value.name}</p>
              <p className="text-xs text-muted-foreground">
                {(value.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => {
              onChange(null)
              if (inputRef.current) inputRef.current.value = ""
            }}
            aria-label="Remove file"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {value && (
        <div
          className={cn(
            "flex items-start gap-2 rounded-lg border p-3 text-xs",
            validation.state === "valid" && "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
            validation.state === "invalid" && "border-destructive/40 bg-destructive/10 text-destructive",
            validation.state === "uploading" && "border-border bg-muted/40 text-muted-foreground",
            validation.state === "idle" && "border-border bg-muted/40 text-muted-foreground"
          )}
          role="status"
          aria-live="polite"
        >
          {validation.state === "uploading" && <Loader2 className="mt-0.5 size-3.5 animate-spin shrink-0" />}
          {(validation.state === "valid" || validation.state === "idle") && (
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" />
          )}
          {validation.state === "invalid" && <AlertCircle className="mt-0.5 size-3.5 shrink-0" />}

          <div className="space-y-1">
            {validation.state === "uploading" && <p className="font-medium">Validating dataset…</p>}
            {validation.state === "valid" && (
              <p className="font-medium">Dataset structure is valid</p>
            )}
            {validation.state === "invalid" && (
              <>
                <p className="font-medium">Dataset validation failed</p>
                <ul className="list-inside list-disc space-y-0.5 text-[11px] opacity-90">
                  {validation.errors.map((err, i) => (
                    <li key={i}>{err.message}</li>
                  ))}
                </ul>
              </>
            )}
            {validation.state === "idle" && <p className="font-medium">No file selected</p>}
            {validation.state !== "invalid" && validation.rowCount != null && (
              <p className="opacity-80">{validation.rowCount} rows detected</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}