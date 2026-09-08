import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: number | string
  hint?: string
  icon?: React.ReactNode
  accent?: "default" | "success" | "warning" | "danger" | "info"
  className?: string
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "bg-background",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-700 dark:text-red-400",
  info: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
}

export function StatCard({ label, value, hint, icon, accent = "default", className }: StatCardProps) {
  return (
    <Card className={cn("shadow-none", className)}>
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {icon && (
          <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", accentClasses[accent])}>
            {icon}
          </span>
        )}
      </CardContent>
    </Card>
  )
}