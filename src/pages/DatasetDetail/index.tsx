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
import { Skeleton } from "@/components/ui/skeleton"
import { DatasetReview } from "@/components/dataset/DatasetReview"
import { EmptyState } from "@/components/common/EmptyState"
import { useAuth } from "@/hooks/useAuth"
import { USER_ROLE } from "@/constants/user/user.constant"
import { useDatasetDetailQuery } from "@/features/datasets/hooks/useDatasetDetailQuery"
import { useUpdateDatasetStatusMutation } from "@/features/datasets/hooks/useUpdateDatasetStatusMutation"
import { updateMockDatasets } from "@/lib/dataset-store"
import { rejectionReasons } from "@/mock/csv-validation"
import { APPROVAL_STATUS } from "@/constants/dataset/dataset.constants"

type DialogKind = "approve" | "reject" | "delete" | null

export default function DatasetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { dataset, detail, isPending, isError, refetch } = useDatasetDetailQuery(id)

  const canModerate = user?.role === USER_ROLE.SUPER_ADMIN
  const [dialog, setDialog] = useState<DialogKind>(null)
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const updateStatus = useUpdateDatasetStatusMutation()

  if (isPending) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <Skeleton className="h-64 w-full lg:col-span-3" />
        </div>
      </div>
    )
  }

  if (isError || !dataset) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-lg border">
          <EmptyState
            title="Dataset not found"
            description="This dataset may have been removed or the link is incorrect."
            action={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                  Go back
                </Button>
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            }
          />
        </div>
      </div>
    )
  }

  const current = dataset

  function confirmApprove() {
    updateStatus.mutate({ id: current.id, status: APPROVAL_STATUS.APPROVED })
    setDialog(null)
  }

  function confirmReject() {
    if (!reason.trim()) return
    updateStatus.mutate({ id: current.id, status: APPROVAL_STATUS.REJECTED, rejectionReason: reason.trim() })
    setDialog(null)
    setReason("")
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

      <DatasetReview dataset={dataset} rows={detail?.rows} columns={detail?.csvSchema?.columns} />

      <div className="flex flex-wrap justify-end gap-2 border-t pt-5">
        <Button variant="destructive" onClick={() => setDialog("delete")}>
          Delete
        </Button>
        {canModerate && (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setReason("")
                setDialog("reject")
              }}
              disabled={dataset.status === APPROVAL_STATUS.REJECTED}
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
          </>
        )}
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
            <Button onClick={confirmApprove} disabled={updateStatus.isPending}>
              {updateStatus.isPending ? "Approving…" : "Approve Dataset"}
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
            <Button variant="destructive" onClick={confirmReject} disabled={updateStatus.isPending || !reason.trim()}>
              {updateStatus.isPending ? "Rejecting…" : "Reject Dataset"}
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