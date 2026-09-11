import { useLayoutEffect, useMemo, useRef, useState } from "react"
import indiaMap from "@svg-maps/india"
import type { ChartData } from "@/constants/dataset/dataset.types"
import { formatNumber } from "@/lib/format"

const VIEW_PADDING = { x: 26, y: 30 }

const SHORT_NAMES: Record<string, string> = {
  an: "AN",
  ap: "AP",
  ar: "AR",
  as: "AS",
  br: "BR",
  ch: "CH",
  ct: "CG",
  dn: "DN",
  dd: "DD",
  dl: "DL",
  ga: "GA",
  gj: "GJ",
  hr: "HR",
  hp: "HP",
  jk: "JK",
  jh: "JH",
  ka: "KA",
  kl: "KL",
  ld: "LD",
  mp: "MP",
  mh: "MH",
  mn: "MN",
  ml: "ML",
  mz: "MZ",
  nl: "NL",
  or: "OD",
  py: "PY",
  pb: "PB",
  rj: "RJ",
  sk: "SK",
  tn: "TN",
  tg: "TS",
  tr: "TR",
  up: "UP",
  ut: "UK",
  wb: "WB",
}

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

interface LabelPos {
  x: number
  y: number
  size: number
}

function sampleCentroid(el: SVGPathElement) {
  const length = el.getTotalLength()
  const samples = 72
  let sx = 0
  let sy = 0
  for (let i = 0; i < samples; i++) {
    const p = el.getPointAtLength((i / samples) * length)
    sx += p.x
    sy += p.y
  }
  return { x: sx / samples, y: sy / samples }
}

function pointInside(el: SVGPathElement, x: number, y: number) {
  try {
    return el.isPointInFill(new DOMPoint(x, y))
  } catch {
    return false
  }
}

function computeLabelPos(el: SVGPathElement): LabelPos {
  const bbox = el.getBBox()
  const cx = bbox.x + bbox.width / 2
  const cy = bbox.y + bbox.height / 2
  const fallback = sampleCentroid(el)
  const best = { x: cx, y: cy }

  if (!pointInside(el, cx, cy)) {
    let found = false
    for (let i = 0; i <= 12; i++) {
      const t = i / 12
      const px = fallback.x + (cx - fallback.x) * t
      const py = fallback.y + (cy - fallback.y) * t
      if (pointInside(el, px, py)) {
        best.x = px
        best.y = py
        found = true
        break
      }
    }
    if (!found) {
      const step = Math.max(bbox.width, bbox.height) / 6
      if (step > 0) {
        for (let r = 1; r <= 3 && !found; r++) {
          for (let dy = -r; dy <= r && !found; dy++) {
            for (let dx = -r; dx <= r && !found; dx++) {
              if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue
              if (pointInside(el, cx + dx * step, cy + dy * step)) {
                best.x = cx + dx * step
                best.y = cy + dy * step
                found = true
              }
            }
          }
        }
      }
      if (!found) {
        best.x = fallback.x
        best.y = fallback.y
      }
    }
  }
  const size = Math.min(12, Math.max(6, Math.min(bbox.width, bbox.height) * 0.4))
  return { x: best.x, y: best.y, size }
}

export function StateHeatmap({ data, height }: StateHeatmapProps) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [labels, setLabels] = useState<Record<string, LabelPos>>({})
  const svgRef = useRef<SVGSVGElement | null>(null)
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

  const [vbW, vbH] = indiaMap.viewBox.split(" ").slice(2).map(Number)
  const viewBox = `${-VIEW_PADDING.x} ${-VIEW_PADDING.y} ${vbW + VIEW_PADDING.x * 2} ${vbH + VIEW_PADDING.y * 2}`

  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const next: Record<string, LabelPos> = {}
    svg.querySelectorAll<SVGPathElement>("path[data-loc]").forEach((el) => {
      next[el.getAttribute("data-loc") as string] = computeLabelPos(el)
    })
    setLabels(next)
  }, [])

  return (
    <div className="relative w-full overflow-hidden rounded-lg border bg-[var(--muted)]/30" style={{ height: height ?? "100%" }}>
      <svg
        ref={svgRef}
        viewBox={viewBox}
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
              data-loc={loc.id}
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

        {indiaMap.locations.map((loc: { id: string; name: string; path: string }) => {
          const pos = labels[loc.id]
          if (!pos) return null
          return (
            <text
              key={`label-${loc.id}`}
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={pos.size}
              fontWeight={600}
              fill="rgba(15,23,42,0.8)"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth={2.5}
              strokeLinejoin="round"
              paintOrder="stroke"
              style={{ fontFamily: "inherit", userSelect: "none" }}
              pointerEvents="none"
            >
              {SHORT_NAMES[loc.id] ?? loc.id.toUpperCase()}
            </text>
          )
        })}
      </svg>

      {hoveredEntry && (
        <div className="absolute left-3 top-3 rounded-md border bg-background/90 px-3 py-2 text-xs shadow-sm backdrop-blur-sm">
          <p className="font-medium text-foreground">{hoveredEntry.state}</p>
          <p className="text-muted-foreground">
            Installed capacity: <span className="font-medium tabular-nums text-foreground">{formatNumber(hoveredEntry.value)} {data.unit ?? ""}</span>
          </p>
        </div>
      )}

      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
        {/* <div className="rounded-md border bg-background/90 px-3 py-2 text-xs shadow-sm backdrop-blur-sm"> */}
          {/* <div className="mb-1 h-2 w-32 rounded-full" style={{ background: `linear-gradient(to right, ${COLOR_STOPS.map((s) => s.color).join(", ")})` }} /> */}
          {/* <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{formatNumber(min)}</span>
            <span>{formatNumber(max)}</span>
            <span>{data.unit ?? "value"}</span>
          </div> */}
        {/* </div> */}
        <p className="shrink-0 text-[10px] text-muted-foreground">{stateValues.length} states with data</p>
      </div>

      <span className="sr-only" aria-hidden="true">
        Map dimensions: {vbW} × {vbH}
      </span>
    </div>
  )
}