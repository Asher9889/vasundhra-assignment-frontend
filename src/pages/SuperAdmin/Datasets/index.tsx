import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { PageHeader } from "@/components/common/PageHeader"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DatasetTable, type DatasetAction } from "@/components/dataset/DatasetTable"
import { useMockDatasets, updateMockDatasets } from "@/lib/dataset-store"
import { rejectionReasons } from "@/mock/csv-validation"
import type { ApprovalStatus, Dataset } from "@/types"

type DialogKind = "approve" | "reject" | "delete" | null

export default function SuperAdminDatasetsPage() {
  const navigate = useNavigate()
  const datasets = useMockDatasets()
  const [tab, setTab] = useState<ApprovalStatus | "all">("all")
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState<DialogKind>(null)
  const [target, setTarget] = useState<Dataset | null>(null)
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const counts = useMemo(
    () => ({
      all: datasets.length,
      pending: datasets.filter((d) => d.status === "pending").length,
      approved: datasets.filter((d) => d.status === "approved").length,
      rejected: datasets.filter((d) => d.status === "rejected").length,
    }),
    [datasets]
  )

  const rows = datasets.filter((d) => {
    const matchesTab = tab === "all" || d.status === tab
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.uploadedBy.toLowerCase().includes(search.toLowerCase()) ||
      d.domain.includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

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
      setTarget(dataset)
      setDialog("delete")
    } else if (action === "edit") {
      toast.info("Edit is not available in this demo.")
    }
  }

  function confirmApprove() {
    if (!target) return
    setSubmitting(true)
    window.setTimeout(() => {
      updateMockDatasets((cur) => cur.map((d) => (d.id === target.id ? { ...d, status: "approved", approvedAt: new Date().toISOString() } : d)))
      setSubmitting(false)
      setDialog(null)
      setTarget(null)
      toast.success(`"${target.title}" approved and published.`)
    }, 700)
  }

  function confirmReject() {
    if (!target || !reason.trim()) return
    setSubmitting(true)
    window.setTimeout(() => {
      updateMockDatasets((cur) => cur.map((d) => (d.id === target.id ? { ...d, status: "rejected", rejectionReason: reason.trim() } : d)))
      setSubmitting(false)
      setDialog(null)
      setTarget(null)
      setReason("")
      toast.error(`"${target.title}" rejected.`)
    }, 700)
  }

  function confirmDelete() {
    if (!target) return
    setSubmitting(true)
    window.setTimeout(() => {
      updateMockDatasets((cur) => cur.filter((d) => d.id !== target.id))
      setSubmitting(false)
      setDialog(null)
      setTarget(null)
      toast.success(`"${target.title}" deleted.`)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dataset Management"
        description="Review all submitted datasets and moderate publishing decisions."
      />

      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as ApprovalStatus | "all")} className="w-full sm:w-auto">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({counts.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search title, uploader, domain…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
            aria-label="Search datasets"
          />
        </div>
      </div>

      <DatasetTable
        datasets={rows}
        role="super-admin"
        onAction={onAction}
        detailHref={(d) => `/super-admin/datasets/${d.id}`}
        emptyTitle="No datasets found"
        emptyDescription="Try a different filter or search term."
      />

      <Dialog open={dialog === "approve"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve dataset</DialogTitle>
            <DialogDescription>Publishing “{target?.title}” will make it visible on the public website.</DialogDescription>
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
            <DialogDescription>“{target?.title}” will be permanently removed. This action cannot be undone.</DialogDescription>
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