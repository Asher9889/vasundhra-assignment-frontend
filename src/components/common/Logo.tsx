import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  compact?: boolean
  onDark?: boolean
}

export function Logo({ className, compact = false, onDark = false }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg",
          onDark ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
        )}
      >
        <Leaf className="size-5" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span
            className={cn(
              "font-heading text-sm font-semibold tracking-tight",
              onDark ? "text-primary-foreground" : "text-foreground"
            )}
          >
            Vasudha Foundation
          </span>
          <span
            className={cn(
              "text-[10px] font-medium uppercase tracking-widest",
              onDark ? "text-primary-foreground/70" : "text-muted-foreground"
            )}
          >
            Data Platform
          </span>
        </span>
      )}
    </span>
  )
}