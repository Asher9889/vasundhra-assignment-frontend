import { Badge } from "@/components/ui/badge"
import { VisualizationRenderer } from "@/components/visualization/VisualizationRenderer"
import { CHART_TYPE, DATASET_TEMPLATE } from "@/constants/dataset/dataset.constants"
import type { ChartData, DatasetTemplate, Domain, TimeseriesChartType } from "@/constants/dataset/dataset.types"
import { chartTypeLabels, domainLabels, templateLabels } from "@/lib/format"

export const previewTimeseries: Record<TimeseriesChartType["value"], ChartData> = {
  LINE: {
    kind: CHART_TYPE.LINE,
    series: [
      {
        name: "Value",
        points: [
          { label: "2005", value: 12 },
          { label: "2010", value: 18 },
          { label: "2015", value: 15 },
          { label: "2020", value: 24 },
          { label: "2025", value: 29 },
        ],
      },
    ],
    unit: "",
    xLabel: "Year",
    yLabel: "Value",
  },
  BAR: {
    kind: CHART_TYPE.BAR,
    series: [
      {
        name: "Value",
        points: [
          { label: "2005", value: 12 },
          { label: "2010", value: 18 },
          { label: "2015", value: 15 },
          { label: "2020", value: 24 },
          { label: "2025", value: 29 },
        ],
      },
    ],
    unit: "",
    xLabel: "Year",
    yLabel: "Value",
  },
  AREA: {
    kind: CHART_TYPE.AREA,
    series: [
      {
        name: "Value",
        points: [
          { label: "2005", value: 12 },
          { label: "2010", value: 18 },
          { label: "2015", value: 15 },
          { label: "2020", value: 24 },
          { label: "2025", value: 29 },
        ],
      },
    ],
    unit: "",
    xLabel: "Year",
    yLabel: "Value",
  },
}

export const previewMapData: ChartData = {
  kind: CHART_TYPE.INDIA_MAP,
  points: [
    { id: "x1", name: "Sample Point A", latitude: 28.61, longitude: 77.2, value: 42, category: "Sample" },
    { id: "x2", name: "Sample Point B", latitude: 19.07, longitude: 72.87, value: 18, category: "Sample" },
    { id: "x3", name: "Sample Point C", latitude: 13.08, longitude: 80.27, value: 27, category: "Sample" },
  ],
  unit: "",
}

export const previewHeatmapData: ChartData = {
  kind: CHART_TYPE.STATE_HEATMAP,
  states: [
    { state: "Rajasthan", value: 24 },
    { state: "Gujarat", value: 32 },
    { state: "Tamil Nadu", value: 21 },
    { state: "Karnataka", value: 26 },
    { state: "Maharashtra", value: 17 },
    { state: "Uttar Pradesh", value: 9 },
    { state: "Madhya Pradesh", value: 12 },
  ],
  unit: "",
}

interface DatasetPreviewProps {
  templateType: DatasetTemplate
  timeseriesChartType: TimeseriesChartType["value"]
  title?: string
  domain?: Domain
  height?: number
}

export function DatasetPreview({ templateType, timeseriesChartType, title, domain, height = 240 }: DatasetPreviewProps) {
  const data: ChartData =
    templateType === DATASET_TEMPLATE.TIME_SERIES
      ? previewTimeseries[timeseriesChartType]
      : templateType === DATASET_TEMPLATE.STATE_WISE
        ? previewHeatmapData
        : previewMapData

  const chartType =
    templateType === DATASET_TEMPLATE.TIME_SERIES
      ? timeseriesChartType
      : templateType === DATASET_TEMPLATE.STATE_WISE
        ? CHART_TYPE.STATE_HEATMAP
        : CHART_TYPE.INDIA_MAP

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {title && <span className="text-sm font-medium text-foreground">{title}</span>}
        {domain && <Badge variant="secondary">{domainLabels[domain]}</Badge>}
        <Badge variant="outline">{chartTypeLabels[chartType]}</Badge>
        <Badge variant="ghost">{templateLabels[templateType]}</Badge>
      </div>
      <div className="rounded-lg border bg-[var(--muted)]/20 p-3">
        <VisualizationRenderer data={data} height={height} />
      </div>
    </div>
  )
}