import { useMemo, useRef, useState } from "react"
import { ZoomIn, ZoomOut, Maximize } from "lucide-react"
import indiaMap from "@svg-maps/india"
import type { ChartData } from "@/constants/dataset/dataset.types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const PROJECTION = {
  latMin: 6.5,
  latMax: 37.5,
  lonMin: 68,
  lonMax: 97.5,
}

interface IndiaLocation {
  id: string
  name: string
  path: string
}

function project(latitude: number, longitude: number) {
  const [w, h] = indiaMap.viewBox.split(" ").slice(2).map(Number)
  const x = ((longitude - PROJECTION.lonMin) / (PROJECTION.lonMax - PROJECTION.lonMin)) * w
  const y = ((PROJECTION.latMax - latitude) / (PROJECTION.latMax - PROJECTION.latMin)) * h
  return { x, y, width: w, height: h }
}

interface IndiaMapProps {
  data: ChartData
  height?: number
  showZoom?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  Solar: "#f59e0b",
  Wind: "#10b981",
  "Weather Station": "#2563eb",
  Climate: "#2563eb",
  Energy: "#10b981",
  Power: "#ef4444",
}

export function IndiaMap({ data, height = 380, showZoom = true }: IndiaMapProps) {
  const viewBox = project(6.5, 68)
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const dragRef = useRef<{ startX: number; startY: number; tx: number; ty: number } | null>(null)

  const points = data.points ?? []

  const positioned = useMemo(
    () =>
      points.map((p) => {
        const { x, y } = project(p.latitude, p.longitude)
        return { ...p, x, y }
      }),
    [points]
  )

  const maxValue = Math.max(...positioned.map((p) => p.value), 1)
  const selectedPoint = positioned.find((p) => p.id === selected)

  function reset() {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
    setSelected(null)
    setHovered(null)
  }

  function zoom(factor: number) {
    setScale((s) => Math.min(4, Math.max(1, s + factor)))
  }

  function onPointerDown(e: React.PointerEvent<SVGGElement>) {
    if (!e.currentTarget.isSameNode(e.target as Node)) return
    dragRef.current = { startX: e.clientX, startY: e.clientY, tx: translate.x, ty: translate.y }
    ;(e.currentTarget as SVGElement).setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<SVGGElement>) {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setTranslate({ x: dragRef.current.tx + dx, y: dragRef.current.ty + dy })
  }

  function endDrag() {
    dragRef.current = null
  }

  const colorForCategory = (category?: string) => {
    if (!category) return "#2563eb"
    return CATEGORY_COLORS[category] ?? "#2563eb"
  }

  return (
    <div className="relative flex flex-col">
      <div
        className="relative w-full overflow-hidden rounded-lg border bg-[var(--muted)]/30"
        style={{ height }}
        role="img"
        aria-label="Interactive map of India with data points"
      >
        <svg
          viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
          className="h-full w-full select-none"
          preserveAspectRatio="xMidYMid meet"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          <g transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`} style={{ transformOrigin: "center" }}>
            {indiaMap.locations.map((loc: IndiaLocation) => (
              <path
                key={loc.id}
                id={loc.id}
                d={loc.path}
                fill={hovered === loc.name ? "var(--muted-foreground)" : "rgba(120,140,160,0.18)"}
                stroke="var(--border)"
                strokeWidth={0.6}
                className="transition-colors"
                pointerEvents="none"
              />
            ))}

            {positioned.map((p) => {
              const r = 4 + (p.value / maxValue) * 9
              const isSelected = selected === p.id
              return (
                <g
                  key={p.id}
                  transform={`translate(${p.x}, ${p.y})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHovered(p.name)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected((cur) => (cur === p.id ? null : p.id))}
                >
                  <circle r={r + 4} fill="transparent" />
                  <circle
                    r={r}
                    fill={colorForCategory(p.category)}
                    fillOpacity={0.75}
                    stroke="white"
                    strokeWidth={hovered === p.name || isSelected ? 2 : 1.2}
                    className="transition-all"
                  />
                  {isSelected && <circle r={r + 3} fill="none" stroke={colorForCategory(p.category)} strokeWidth={1.5} />}
                </g>
              )
            })}
          </g>
        </svg>

        {showZoom && (
          <div className="absolute right-2 top-2 flex flex-col gap-1 rounded-md border bg-popover p-1 shadow-sm">
            <Button variant="ghost" size="icon-sm" onClick={() => zoom(0.5)} aria-label="Zoom in">
              <ZoomIn className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => zoom(-0.5)} aria-label="Zoom out">
              <ZoomOut className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={reset} aria-label="Reset view">
              <Maximize className="size-3.5" />
            </Button>
          </div>
        )}

        {hovered && (
          <div className="pointer-events-none absolute left-2 top-2 rounded-md bg-popover/95 px-2.5 py-1.5 text-xs shadow-md ring-1 ring-border">
            {hovered}
          </div>
        )}
      </div>

      <div
        className={cn(
          "mt-3 flex items-start gap-3 rounded-md border p-3 text-xs transition-opacity",
          selectedPoint ? "opacity-100" : "opacity-60"
        )}
        aria-live="polite"
      >
        {selectedPoint ? (
          <>
            <span
              className="mt-0.5 size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: colorForCategory(selectedPoint.category) }}
            />
            <div className="min-w-0 space-y-0.5">
              <p className="font-medium text-foreground">{selectedPoint.name}</p>
              <p className="text-muted-foreground">
                {selectedPoint.category ?? "Data point"} · {selectedPoint.value.toLocaleString("en-IN")}
                {data.unit ? ` ${data.unit}` : ""} at {selectedPoint.latitude.toFixed(2)}°N,{" "}
                {selectedPoint.longitude.toFixed(2)}°E
              </p>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">Hover a marker for details. Click to pin a data point.</p>
        )}
      </div>
    </div>
  )
}