import { FileSpreadsheet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DatasetStatusBadge } from "./DatasetStatusBadge"
import { VisualizationRenderer } from "@/components/visualization/VisualizationRenderer"
import { DATASET_TEMPLATE } from "@/constants/dataset/dataset.constants"
import type { Dataset } from "@/constants/dataset/dataset.types"
import { chartTypeLabels, domainLabels, formatDateTime, templateLabels } from "@/lib/format"

interface DatasetReviewProps {
  dataset: Dataset
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

export function DatasetReview({ dataset }: DatasetReviewProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="space-y-4 lg:col-span-2">
        <div>
          <span className="mb-2 flex items-center gap-2">
            <DatasetStatusBadge status={dataset.status} />
            {dataset.rejectionReason && (
              <Badge variant="destructive" className="gap-1">
                Needs revision
              </Badge>
            )}
          </span>
          <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">{dataset.title}</h2>
          {dataset.description && (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{dataset.description}</p>
          )}
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border p-4">
          <MetaItem label="Domain" value={domainLabels[dataset.domain]} />
          <MetaItem label="Chart Type" value={chartTypeLabels[dataset.chartType]} />
          <MetaItem label="Data Template" value={templateLabels[dataset.templateType]} />
          <MetaItem label="Uploaded by" value={dataset.uploadedBy} />
          <MetaItem label="Created" value={formatDateTime(dataset.createdAt)} />
          <MetaItem label="Approved" value={dataset.approvedAt ? formatDateTime(dataset.approvedAt) : "—"} />
        </dl>

        <div className="rounded-lg border p-4">
          <p className="mb-2 text-xs font-medium text-foreground">Source file</p>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md border bg-muted/50 text-foreground">
              <FileSpreadsheet className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{dataset.fileName ?? "Untitled.csv"}</p>
              <p className="text-xs text-muted-foreground">{dataset.rowCount ?? "—"} rows</p>
            </div>
          </div>
        </div>

        {dataset.rejectionReason && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-xs font-semibold text-destructive">Rejection reason</p>
            <p className="mt-1 text-sm text-destructive/90">{dataset.rejectionReason}</p>
          </div>
        )}

        <Separator />

        <p className="text-xs leading-relaxed text-muted-foreground">
          Approving this dataset will publish the visualization on the public website under the{" "}
          <span className="font-medium text-foreground">{domainLabels[dataset.domain]}</span> section. Rejected
          datasets remain hidden until revised and resubmitted.
        </p>
      </div>

      <div className="lg:col-span-3">
        <p className="mb-2 text-xs font-medium text-foreground">Visualization preview</p>
        <div className="rounded-lg border bg-[var(--muted)]/20 p-3">
          <VisualizationRenderer data={dataset.data} height={360} />
        </div>

        <p className="mb-2 mt-4 text-xs font-medium text-foreground">Data preview</p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-xs">
            <caption className="sr-only">First rows of the source dataset</caption>
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-3 py-2 font-medium text-foreground">Row</th>
                {dataset.templateType === DATASET_TEMPLATE.LAT_LONG && (
                  <>
                    <th className="px-3 py-2 font-medium text-foreground">Latitude</th>
                    <th className="px-3 py-2 font-medium text-foreground">Longitude</th>
                    <th className="px-3 py-2 font-medium text-foreground">Value</th>
                  </>
                )}
                {dataset.templateType === DATASET_TEMPLATE.STATE_WISE && (
                  <>
                    <th className="px-3 py-2 font-medium text-foreground">State</th>
                    <th className="px-3 py-2 font-medium text-foreground">Value</th>
                  </>
                )}
                {dataset.templateType === DATASET_TEMPLATE.TIME_SERIES && (
                  <>
                    <th className="px-3 py-2 font-medium text-foreground">Date / Year</th>
                    <th className="px-3 py-2 font-medium text-foreground">Value</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {Array.from({ length: Math.min(dataset.rowCount ?? 0, 5) }).map((_, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-3 py-1.5">{i + 1}</td>
                  <td className="px-3 py-1.5">
                    {dataset.templateType === DATASET_TEMPLATE.TIME_SERIES ? 2005 + i : dataset.templateType === DATASET_TEMPLATE.LAT_LONG ? `28.6${i}` : "Rajasthan"}
                  </td>
                  <td className="px-3 py-1.5">
                    {dataset.templateType === DATASET_TEMPLATE.LAT_LONG ? `77.2${i}` : 24 + i * 3}
                  </td>
                  {dataset.templateType === DATASET_TEMPLATE.LAT_LONG && <td className="px-3 py-1.5">{18 + i * 4}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}