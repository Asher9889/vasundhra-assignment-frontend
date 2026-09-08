import { useMemo, useState } from "react"
import indiaMap from "@svg-maps/india"
import type { ChartData } from "@/types"
import { formatNumber } from "@/lib/format"

const COLOR_STOPS = [
  { stop: 0, color: "#f1f5f9" },
  { stop: 0.25, color: "#dbeafe" },
  { stop: 0.5, color: "#93c5fd" },
  { stop: 0.75, color: "#3b82f6" },
  { stop: 1, color: "#1d4ed8" },
]

function colorForValue(value: number, min: number, max: number, log = true) {
  const norm = max === min ? 0 : (value - min) / (max - min)
  const scaled = log ? Math.pow(norm, 0.55) : norm
  for (let i = 1; i < COLOR_STOPS.length; i++) {
    if (scaled <= COLOR_STOPS[i].stop) {
      return COLOR_STOPS[i - 1].color
    }
  }
  return COLOR_STOPS[COLOR_STOPS.length - 1].color
}

interface StateHeatmapProps {
  data: ChartData
  height?: number
}

export function StateHeatmap({ data, height = 380 }: StateHeatmapProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const stateValues = data.states ?? []

  const { min, max } = useMemo(() => {
    const values = stateValues.map((s) => s.value)
    return {
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 1,
    }
  }, [stateValues])

  const valueForState = useMemo(() => {
    const map = new Map(stateValues.map((s) => [s.state.toLowerCase(), s.value]))
    return map
  }, [stateValues])

  const hoveredEntry = hovered ? stateValues.find((s) => s.state.toLowerCase() === hovered.toLowerCase()) : undefined

  const viewBox = indiaMap.viewBox.split(" ").slice(2).map(Number)

  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <div className="relative w-full overflow-hidden rounded-lg border bg-[var(--muted)]/30" style={{ height }}>
        <svg
          viewBox={indiaMap.viewBox}
          className="h-full w-full select-none"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="State-level heatmap of India"
        >
          {indiaMap.locations.map((loc: { id: string; name: string; path: string }) => {
            const value = valueForState.get(loc.name.toLowerCase())
            const fill = value != null ? colorForValue(value, min, max) : "rgba(120,140,160,0.12)"
            const isHovered = hovered === loc.name
            return (
              <path
                key={loc.id}
                d={loc.path}
                fill={fill}
                stroke={isHovered ? "var(--foreground)" : "var(--background)"}
                strokeWidth={isHovered ? 1.4 : 0.7}
                className="cursor-pointer transition-[fill]"
                onMouseEnter={() => setHovered(loc.name)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(loc.name)}
                onBlur={() => setHovered(null)}
                tabIndex={value != null ? 0 : -1}
                role={value != null ? "button" : undefined}
                aria-label={value != null ? `${loc.name}: ${formatNumber(value)} ${data.unit ?? ""}` : loc.name}
              >
                <title>
                  {loc.name}
                  {value != null ? ` — ${formatNumber(value)} ${data.unit ?? ""}` : ""}
                </title>
              </path>
            )
          })}
        </svg>
      </div>

      <div className="w-full space-y-3 lg:w-60 lg:shrink-0">
        <div className="rounded-md border p-3 text-xs">
          <p className="font-medium text-foreground">{hoveredEntry ? hoveredEntry.state : "India"}</p>
          <p className="mt-1 text-muted-foreground">
            {hoveredEntry ? (
              <>
                Installed capacity:{" "}
                <span className="font-medium tabular-nums text-foreground">
                  {formatNumber(hoveredEntry.value)} {data.unit ?? ""}
                </span>
              </>
            ) : (
              <>{stateValues.length} states with data</>
            )}
          </p>
        </div>

        <div className="rounded-md border p-3">
          <p className="mb-2 text-xs font-medium text-foreground">Legend</p>
          <div className="h-2 w-full rounded-full" style={{ background: `linear-gradient(to right, ${COLOR_STOPS.map((s) => s.color).join(", ")})` }} />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>{formatNumber(min)}</span>
            <span>{formatNumber(max)}</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground">{data.unit ?? "value"}</p>
        </div>

        <p className="text-[11px] leading-relaxed text-muted-foreground">
          Hover or tab through states to inspect values. States without data are shown in grey.
        </p>
        <span className="sr-only" aria-hidden="true">
          Map dimensions: {viewBox.join(" × ")}
        </span>
      </div>
    </div>
  )
}