import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { ChartData, SeriesDataPoint } from "@/constants/dataset/dataset.types"
import { ChartTooltip } from "./ChartTooltip"
import { formatValue } from "@/lib/format"

const CHART_COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"]

interface AreaChartProps {
  data: ChartData
  height?: number
  stacked?: boolean
}

function buildSeriesData(series: Array<{ name: string; points: SeriesDataPoint[] }>) {
  const labelOrder = series[0]?.points.map((p) => p.label) ?? []
  const keys = series.map((s) => s.name)
  const rows = labelOrder.map((label) => {
    const row: Record<string, string | number> = { label }
    for (const s of series) {
      row[s.name] = s.points.find((p) => p.label === label)?.value ?? 0
    }
    return row
  })
  return { rows, keys }
}

export function AreaChart({ data, height = 280, stacked = false }: AreaChartProps) {
  const series = data.series ?? []
  const { rows, keys } = buildSeriesData(series)

  if (rows.length === 0) {
    return (
      <div className="flex h-full min-h-40 items-center justify-center text-sm text-muted-foreground">
        No data available
      </div>
    )
  }

  return (
    <div style={{ width: "100%", height }} className="text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={rows} margin={{ top: 8, right: 16, bottom: 4, left: 0 }}>
          <defs>
            {keys.map((key, i) => (
              <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.35} />
                <stop offset="95%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(v: number) => formatValue(v)}
          />
          <Tooltip content={<ChartTooltip unit={data.unit} />} cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }} />
          {keys.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} iconSize={8} />}
          {keys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              strokeWidth={2}
              fill={`url(#grad-${key})`}
              stackId={stacked ? "stack" : undefined}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}