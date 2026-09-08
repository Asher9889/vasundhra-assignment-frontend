import { cn } from "@/lib/utils"

interface TooltipEntry {
  name?: string
  value?: number | string
  color?: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: Array<{ name?: string; value?: number | string; color?: string; dataKey?: string }>
  label?: string
  unit?: string
  labelFormatter?: (label: string) => string
}

export function ChartTooltip({ active, payload, label, unit, labelFormatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  const entries: TooltipEntry[] = payload.map((p) => ({
    name: p.name ?? p.dataKey,
    value: typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value,
    color: p.color,
  }))

  return (
    <div className="min-w-36 rounded-md border bg-popover px-3 py-2 text-xs shadow-md">
      {label != null && (
        <p className="mb-1.5 font-medium text-foreground">{labelFormatter ? labelFormatter(label) : label}</p>
      )}
      <div className="space-y-1">
        {entries.map((e, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className={cn("size-2 rounded-full", e.color ? "" : "bg-primary")}
                style={e.color ? { backgroundColor: e.color } : undefined}
                aria-hidden="true"
              />
              {e.name}
            </span>
            <span className="font-medium tabular-nums text-foreground">
              {e.value}
              {unit ? ` ${unit}` : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}