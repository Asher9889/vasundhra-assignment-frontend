import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { APPROVAL_STATUS } from "@/constants/dataset/dataset.constants"
import type { Dataset } from "@/constants/dataset/dataset.types"
import { DatasetTable, type DatasetAction } from "@/components/dataset/DatasetTable"
import { EditDatasetDialog } from "@/features/datasets/EditDatasetDialog"
import { useDatasetsListQuery } from "@/features/datasets/hooks/useDatasetsListQuery"
import { useUpdateDatasetStatusMutation } from "@/features/datasets/hooks/useUpdateDatasetStatusMutation"
import { rejectionReasons } from "@/mock/csv-validation"

type DialogKind = "approve" | "reject" | null

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "title:asc", label: "Title A-Z" },
  { value: "title:desc", label: "Title Z-A" },
  { value: "domain:asc", label: "Domain A-Z" },
]

export default function SuperAdminDatasetsPage() {
  const navigate = useNavigate()
  const { datasets, pagination, isPending, isError, refetch, page, status, sort, searchInput, setSearchInput, updateParams } =
    useDatasetsListQuery()

  const [dialog, setDialog] = useState<DialogKind>(null)
  const [target, setTarget] = useState<Dataset | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const updateStatus = useUpdateDatasetStatusMutation()

  function onAction(action: DatasetAction, dataset: Dataset) {
    if (action === "view") navigate(`/super-admin/datasets/${dataset.id}`)
    else if (action === "approve") {
      setTarget(dataset)
      setDialog("approve")
    } else if (action === "reject") {
      setTarget(dataset)
      setReason("")
      setDialog("reject")
    } else if (action === "delete") {
      toast.info("Delete is not available in this demo.")
    } else if (action === "edit") {
      setEditId(dataset.id)
    }
  }

  function confirmApprove() {
    if (!target) return
    updateStatus.mutate({ id: target.id, status: APPROVAL_STATUS.APPROVED })
    setDialog(null)
    setTarget(null)
  }

  function confirmReject() {
    if (!target || !reason.trim()) return
    updateStatus.mutate({ id: target.id, status: APPROVAL_STATUS.REJECTED, rejectionReason: reason.trim() })
    setDialog(null)
    setTarget(null)
    setReason("")
  }

  const start = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0
  const end = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dataset Management"
        description="Review all submitted datasets and moderate publishing decisions."
      />

      <div className="flex flex-wrap items-center gap-2">
        {pagination && (
          <span className="text-sm text-muted-foreground">
            {pagination.total > 0 ? `${pagination.total} dataset${pagination.total === 1 ? "" : "s"}` : "No datasets"}
          </span>
        )}

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search title, uploader, domain…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8"
              aria-label="Search datasets"
            />
          </div>

          <Select value={status ?? "ALL"} onValueChange={(value) => updateParams({ status: value === "ALL" ? null : value })}>
            <SelectTrigger className="h-8" aria-label="Filter by approval status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value={APPROVAL_STATUS.PENDING}>Pending</SelectItem>
              <SelectItem value={APPROVAL_STATUS.APPROVED}>Approved</SelectItem>
              <SelectItem value={APPROVAL_STATUS.REJECTED}>Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(value) => updateParams({ sort: value })}>
            <SelectTrigger className="h-8" aria-label="Sort datasets">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isError ? (
        <div className="rounded-lg border">
          <EmptyState title="Couldn't load datasets" description="The server may be unreachable. Try again." />
          <div className="flex justify-center pb-6">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <>
          <DatasetTable
            datasets={datasets}
            role="super-admin"
            loading={isPending}
            onAction={onAction}
            detailHref={(d) => `/super-admin/datasets/${d.id}`}
            emptyTitle="No datasets found"
            emptyDescription="Try a different filter or search term."
          />

          {pagination && pagination.total > 0 && (
            <div className="flex items-center justify-between gap-4 border-t px-4 py-3">
              <span className="text-sm text-muted-foreground">
                {pagination.total === 0 ? "No datasets" : `Showing ${start}–${end} of ${pagination.total}`}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => updateParams({ page: String(page - 1) })}>
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => updateParams({ page: String(page + 1) })}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog open={dialog === "approve"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve dataset</DialogTitle>
            <DialogDescription>Publishing “{target?.title}” will make it visible on the public website.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>
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
            <DialogDescription>
              Provide a reason so the admin can revise and resubmit “{target?.title}”.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="superadmin-reason">Rejection reason</Label>
              <Textarea
                id="superadmin-reason"
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
            <Button variant="outline" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject} disabled={updateStatus.isPending || !reason.trim()}>
              {updateStatus.isPending ? "Rejecting…" : "Reject Dataset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {editId && <EditDatasetDialog datasetId={editId} onClose={() => setEditId(null)} />}
    </div>
  )
}