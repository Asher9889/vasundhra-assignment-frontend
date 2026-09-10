import { ArrowLeft, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessPanelProps {
  title: string
  onBackToDashboard: () => void
}

export function SuccessPanel({ title, onBackToDashboard }: SuccessPanelProps) {
  return (
    <div className="mx-auto max-w-md space-y-5 py-10 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/10">
        <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="space-y-1">
        <h2 className="font-heading text-lg font-semibold tracking-tight">Dataset submitted successfully</h2>
        <p className="text-sm text-muted-foreground">{title.trim() || "Your dataset"} has been received.</p>
      </div>
      <div className="rounded-lg border bg-muted/30 px-4 py-3 text-left">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Status</span>
          <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <Clock className="size-3.5" />
            PENDING
          </span>
        </div>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Your dataset will become visible on the public website after Super Admin approval.
        </p>
      </div>
      <Button onClick={onBackToDashboard}>
        <ArrowLeft className="size-4" />
        Return to dashboard
      </Button>
    </div>
  )
}