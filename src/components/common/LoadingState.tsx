import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  label?: string
  className?: string
  fullHeight?: boolean
}

export function LoadingState({ label = "Loading…", className, fullHeight = false }: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-muted-foreground",
        fullHeight && "min-h-[60vh]",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="size-5 animate-spin" />
      <p className="text-xs">{label}</p>
    </div>
  )
}