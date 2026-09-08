import type { ChartData } from "@/types"
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
    case "line":
      return <LineChart data={data} height={height} />
    case "bar":
      return <BarChart data={data} height={height} />
    case "area":
      return <AreaChart data={data} height={height} />
    case "india-map":
      return <IndiaMap data={data} height={height} />
    case "state-heatmap":
      return <StateHeatmap data={data} height={height} />
    default:
      return (
        <div className="flex h-full min-h-40 items-center justify-center text-sm text-muted-foreground">
          Unsupported visualization type
        </div>
      )
  }
}