import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Pencil } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DatasetReview } from "@/components/dataset/DatasetReview"
import { EmptyState } from "@/components/common/EmptyState"
import { useMockDatasets, updateMockDatasets } from "@/lib/dataset-store"
import { rejectionReasons } from "@/mock/csv-validation"
import { APPROVAL_STATUS } from "@/constants/dataset/dataset.constants"
import type { Dataset } from "@/constants/dataset/dataset.types"

type DialogKind = "approve" | "reject" | "delete" | null

export default function DatasetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const datasets = useMockDatasets()
  const [dataset, setDataset] = useState<Dataset | null>(() => datasets.find((d) => d.id === id) ?? null)
  const [dialog, setDialog] = useState<DialogKind>(null)
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (!dataset) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border">
          <EmptyState
            title="Dataset not found"
            description="This dataset may have been removed or the link is incorrect."
            action={<Button variant="outline" size="sm" onClick={() => navigate(-1)}>Go back</Button>}
          />
        </div>
      </div>
    )
  }

  const current = dataset

  function confirmApprove() {
    setSubmitting(true)
    window.setTimeout(() => {
      updateMockDatasets((cur) =>
        cur.map((d) => (d.id === current.id ? { ...d, status: APPROVAL_STATUS.APPROVED, approvedAt: new Date().toISOString() } : d))
      )
      setDataset((cur) => (cur ? { ...cur, status: APPROVAL_STATUS.APPROVED, approvedAt: new Date().toISOString() } : cur))
      setSubmitting(false)
      setDialog(null)
      toast.success(`"${current.title}" approved and published.`)
    }, 700)
  }

  function confirmReject() {
    if (!reason.trim()) return
    setSubmitting(true)
    window.setTimeout(() => {
      updateMockDatasets((cur) =>
        cur.map((d) => (d.id === current.id ? { ...d, status: APPROVAL_STATUS.REJECTED, rejectionReason: reason.trim() } : d))
      )
      setDataset((cur) => (cur ? { ...cur, status: APPROVAL_STATUS.REJECTED, rejectionReason: reason.trim() } : cur))
      setSubmitting(false)
      setDialog(null)
      setReason("")
      toast.error(`"${current.title}" rejected.`)
    }, 700)
  }

  function confirmDelete() {
    setSubmitting(true)
    window.setTimeout(() => {
      updateMockDatasets((cur) => cur.filter((d) => d.id !== current.id))
      setSubmitting(false)
      setDialog(null)
      toast.success(`"${current.title}" deleted.`)
      navigate(-1)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="-ml-2 text-muted-foreground">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button variant="outline" size="sm" onClick={() => toast.info("Edit is not available in this demo.")}>
          <Pencil className="size-4" />
          Edit
        </Button>
      </div>

      <DatasetReview dataset={dataset} />

      <div className="flex flex-wrap justify-end gap-2 border-t pt-5">
        <Button variant="destructive" onClick={() => setDialog("delete")}>
          Delete
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setReason("")
            setDialog("reject")
          }}
        >
          Reject
        </Button>
        <Button
          onClick={() => setDialog("approve")}
          disabled={dataset.status === APPROVAL_STATUS.APPROVED}
          className="min-w-36"
        >
          {dataset.status === APPROVAL_STATUS.APPROVED ? "Approved" : "Approve"}
        </Button>
      </div>

      <Dialog open={dialog === "approve"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve dataset</DialogTitle>
            <DialogDescription>Publishing “{dataset.title}” will make this visualization visible on the public website.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={confirmApprove} disabled={submitting}>
              {submitting ? "Approving…" : "Approve Dataset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "reject"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject dataset</DialogTitle>
            <DialogDescription>Provide a reason so the admin can revise and resubmit “{dataset.title}”.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="review-reason">Rejection reason</Label>
              <Textarea
                id="review-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe what needs to be corrected…"
                rows={3}
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {rejectionReasons.map((r) => (
                <Button key={r} type="button" variant="outline" size="xs" onClick={() => setReason((cur) => (cur === r ? "" : r))}>
                  {r}
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject} disabled={submitting || !reason.trim()}>
              {submitting ? "Rejecting…" : "Reject Dataset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "delete"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete dataset</DialogTitle>
            <DialogDescription>“{dataset.title}” will be permanently removed. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={submitting}>
              {submitting ? "Deleting…" : "Delete Dataset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}