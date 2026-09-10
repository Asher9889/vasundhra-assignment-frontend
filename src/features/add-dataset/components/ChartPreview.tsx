import { Badge } from "@/components/ui/badge"
import { VisualizationRenderer } from "@/components/visualization/VisualizationRenderer"
import { chartTypeLabels, domainLabels, templateLabels } from "@/lib/format"
import {
  CHART_TYPE,
  DATASET_TEMPLATE,
} from "@/constants/dataset/dataset.constants"
import type { ChartData, DatasetTemplate, Domain } from "@/constants/dataset/dataset.types"
import type { SeriesType } from "../types/add-dataset.types"
import { StepSection } from "./StepSection"

interface ChartPreviewProps {
  data: ChartData
  title: string
  domain: Domain | null
  templateType: DatasetTemplate
  seriesType: SeriesType
  height?: number
}

export function ChartPreview({ data, title, domain, templateType, seriesType, height = 260 }: ChartPreviewProps) {
  const chartType =
    templateType === DATASET_TEMPLATE.TIME_SERIES
      ? seriesType
      : templateType === DATASET_TEMPLATE.STATE_WISE
        ? CHART_TYPE.STATE_HEATMAP
        : CHART_TYPE.INDIA_MAP

  return (
    <StepSection
      heading="6 · Visualization Preview"
      description="This is how your visualization will render with the selected columns."
    >
      <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">{title.trim() || "Untitled visualization"}</span>
        {domain && <Badge variant="secondary">{domainLabels[domain]}</Badge>}
        <Badge variant="outline">{chartTypeLabels[chartType]}</Badge>
        <Badge variant="ghost">{templateLabels[templateType]}</Badge>
      </div>
      <div className="rounded-lg border bg-[var(--muted)]/20 p-3">
        <VisualizationRenderer data={data} height={height} />
      </div>
    </div>
    </StepSection>
  )
}