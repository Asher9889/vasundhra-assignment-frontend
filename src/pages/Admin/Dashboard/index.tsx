import { useState } from "react"
import { Link } from "react-router-dom"
import { Database, Clock, CheckCircle2, XCircle, Plus } from "lucide-react"
import { toast } from "sonner"
import { StatCard } from "@/components/common/StatCard"
import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DatasetTable, type DatasetAction } from "@/components/dataset/DatasetTable"
import { useMockDatasets, updateMockDatasets } from "@/lib/dataset-store"
import { getDatasetSummaryStats } from "@/mock/dashboard"
import type { Dataset } from "@/types"

export default function AdminDashboardPage() {
  const datasets = useMockDatasets()
  const [search, setSearch] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Dataset | null>(null)
  const [deleting, setDeleting] = useState(false)

  const stats = getDatasetSummaryStats(datasets)
  const rows = datasets.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()))

  function onAction(action: DatasetAction, dataset: Dataset) {
    if (action === "delete") setDeleteTarget(dataset)
    else if (action === "edit") toast.info("Edit is not available in this demo.")
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    window.setTimeout(() => {
      updateMockDatasets((cur) => cur.filter((d) => d.id !== deleteTarget.id))
      setDeleting(false)
      setDeleteTarget(null)
      toast.success(`"${deleteTarget.title}" deleted.`)
    }, 500)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of the datasets you have submitted and their approval status."
      >
        <Button render={<Link to="/admin/datasets/new" />}>
            <Plus className="size-4" />
            Add Dataset
          </Button>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Datasets" value={stats.total} icon={<Database />} />
        <StatCard label="Pending" value={stats.pending} hint="Awaiting approval" icon={<Clock />} accent="warning" />
        <StatCard label="Approved" value={stats.approved} hint="Published" icon={<CheckCircle2 />} accent="success" />
        <StatCard label="Rejected" value={stats.rejected} hint="Needs revision" icon={<XCircle />} accent="danger" />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-base font-semibold tracking-tight">My Datasets</h3>
            <p className="text-sm text-muted-foreground">Track the review status of your submissions.</p>
          </div>
          <Input
            type="search"
            placeholder="Search your datasets…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56"
            aria-label="Search datasets"
          />
        </div>

        <DatasetTable
          datasets={rows}
          role="admin"
          onAction={onAction}
          detailHref={(d) => `/admin/datasets/${d.id}`}
          emptyTitle="No datasets yet"
          emptyDescription="Submit your first dataset to see it here."
        />
      </div>

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete dataset</DialogTitle>
            <DialogDescription>“{deleteTarget?.title}” will be permanently removed. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete Dataset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}