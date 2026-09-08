import { Link } from "react-router-dom"
import { ArrowRight, CalendarDays } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Dataset } from "@/types"
import { VisualizationRenderer } from "./VisualizationRenderer"
import { chartTypeLabels, domainLabels, formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

interface VisualizationCardProps {
  dataset: Dataset
  showDomain?: boolean
  detailHref?: string
  aspect?: "wide" | "standard"
}

export function VisualizationCard({
  dataset,
  showDomain = true,
  detailHref,
  aspect = "standard",
}: VisualizationCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border bg-card">
      <div
        className={cn(
          "relative border-b bg-[var(--muted)]/30",
          aspect === "wide" ? "aspect-[16/7]" : "aspect-[4/3]"
        )}
      >
        <div className="absolute inset-0 p-3">
          <VisualizationRenderer data={dataset.data} height={undefined} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">{dataset.title}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {showDomain && <Badge variant="secondary">{domainLabels[dataset.domain]}</Badge>}
          <Badge variant="outline">{chartTypeLabels[dataset.chartType]}</Badge>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 border-t pt-3 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {formatDate(dataset.createdAt)}
          </span>
          {detailHref ? (
            <Link
              to={detailHref}
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              View Details
              <ArrowRight className="size-3.5" />
            </Link>
          ) : (
            <span className="text-muted-foreground">Published</span>
          )}
        </div>
      </div>
    </article>
  )
}