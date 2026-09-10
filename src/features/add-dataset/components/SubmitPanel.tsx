import { Loader2, Send, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubmitPanelProps {
  canSubmit: boolean
  isSubmitting: boolean
  onCancel: () => void
}

export function SubmitPanel({ canSubmit, isSubmitting, onCancel }: SubmitPanelProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-5">
      <div className="flex items-start gap-2.5 rounded-lg bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          New datasets are reviewed by a <strong className="font-medium text-foreground">Super Admin</strong> before
          being published on the public website.
        </p>
      </div>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit || isSubmitting} className="sm:min-w-40">
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {isSubmitting ? "Submitting…" : "Submit Dataset"}
        </Button>
      </div>
    </div>
  )
}