import { CHART_TYPE } from "@/constants/dataset/dataset.constants"
import type { ChartData } from "@/constants/dataset/dataset.types"
import { LineChart } from "./LineChart"
import { BarChart } from "./BarChart"
import { AreaChart } from "./AreaChart"
import { IndiaMap } from "./IndiaMap"
import { StateHeatmap } from "./StateHeatmap"

interface VisualizationRendererProps {
  data: ChartData
  height?: number
}

export function VisualizationRenderer({ data, height }: VisualizationRendererProps) {
  switch (data.kind) {
    case CHART_TYPE.LINE:
      return <LineChart data={data} height={height} />
    case CHART_TYPE.BAR:
      return <BarChart data={data} height={height} />
    case CHART_TYPE.AREA:
      return <AreaChart data={data} height={height} />
    case CHART_TYPE.INDIA_MAP:
      return <IndiaMap data={data} height={height} />
    case CHART_TYPE.STATE_HEATMAP:
      return <StateHeatmap data={data} height={height} />
    default:
      return (
        <div className="flex h-full min-h-40 items-center justify-center text-sm text-muted-foreground">
          Unsupported visualization type
        </div>
      )
  }
}