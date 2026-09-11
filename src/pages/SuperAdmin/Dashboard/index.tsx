import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Database, Clock, CheckCircle2, XCircle, Users, UserCheck } from "lucide-react"
import { toast } from "sonner"
import { StatCard } from "@/components/common/StatCard"
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
import { Input } from "@/components/ui/input"
import { DatasetTable, type DatasetAction } from "@/components/dataset/DatasetTable"
import { useDatasetsQuery } from "@/features/datasets/hooks/useDatasetsQuery"
import { useUpdateDatasetStatusMutation } from "@/features/datasets/hooks/useUpdateDatasetStatusMutation"
import { getAdminSummaryStats, getDatasetSummaryStats } from "@/mock/dashboard"
import { rejectionReasons } from "@/mock/csv-validation"
import { APPROVAL_STATUS } from "@/constants/dataset/dataset.constants"
import type { Dataset } from "@/constants/dataset/dataset.types"

type DialogKind = "approve" | "reject" | null

export default function SuperAdminDashboard() {
  const navigate = useNavigate()
  const { datasets, pagination, isPending } = useDatasetsQuery({ limit: 50 })
  const [search, setSearch] = useState("")
  const [dialog, setDialog] = useState<DialogKind>(null)
  const [target, setTarget] = useState<Dataset | null>(null)
  const [reason, setReason] = useState("")
  const updateStatus = useUpdateDatasetStatusMutation()

  const datasetStats = { ...getDatasetSummaryStats(datasets), total: pagination?.total ?? datasets.length }
  const adminStats = getAdminSummaryStats()

  const rows = datasets.filter(
    (d) => d.title.toLowerCase().includes(search.toLowerCase()) || d.uploadedBy.toLowerCase().includes(search.toLowerCase())
  )

  function onAction(action: DatasetAction, dataset: Dataset) {
    if (action === "view") {
      navigate(`/super-admin/datasets/${dataset.id}`)
    } else if (action === "approve") {
      setTarget(dataset)
      setDialog("approve")
    } else if (action === "reject") {
      setTarget(dataset)
      setReason("")
      setDialog("reject")
    } else if (action === "delete") {
      toast.info("Delete is not available in this demo.")
    } else if (action === "edit") {
      toast.info("Edit is not available in this demo.")
    }
  }

  function confirmApprove() {
    if (!target) return
    updateStatus.mutate({ id: target.id, status: APPROVAL_STATUS.APPROVED })
    setDialog(null)
    setTarget(null)
  }

  function confirmReject() {
    if (!target) return
    if (!reason.trim()) return
    updateStatus.mutate({ id: target.id, status: APPROVAL_STATUS.REJECTED, rejectionReason: reason.trim() })
    setDialog(null)
    setTarget(null)
    setReason("")
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-xl font-semibold tracking-tight">Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and moderate datasets, and manage administrator accounts.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total Datasets" value={datasetStats.total} hint="Across all domains" icon={<Database />} />
        <StatCard label="Pending Approval" value={datasetStats.pending} hint="Awaiting review" icon={<Clock />} accent="warning" />
        <StatCard label="Approved" value={datasetStats.approved} hint="Published to the public site" icon={<CheckCircle2 />} accent="success" />
        <StatCard label="Rejected" value={datasetStats.rejected} hint="Hidden until revised" icon={<XCircle />} accent="danger" />
        <StatCard label="Total Admins" value={adminStats.total} hint="Registered administrators" icon={<Users />} />
        <StatCard label="Active Admins" value={adminStats.active} hint="Enabled accounts" icon={<UserCheck />} accent="info" />
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-base font-semibold tracking-tight">Dataset Management</h3>
            <p className="text-sm text-muted-foreground">Approve, reject or remove submitted datasets.</p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search datasets…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-56"
              aria-label="Search datasets"
            />
            <Button variant="outline" render={<Link to="/super-admin/datasets" />}>
              Manage all
            </Button>
          </div>
        </div>

        <DatasetTable
          datasets={rows}
          role="super-admin"
          loading={isPending}
          onAction={onAction}
          detailHref={(d) => `/super-admin/datasets/${d.id}`}
        />
      </div>

      <Dialog open={dialog === "approve"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve dataset</DialogTitle>
            <DialogDescription>
              Publishing “{target?.title}” will make this visualization visible on the public website.
            </DialogDescription>
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
              <Label htmlFor="rejection-reason">Rejection reason</Label>
              <Textarea
                id="rejection-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe what needs to be corrected…"
                rows={3}
              />
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Common reasons</p>
              <div className="flex flex-wrap gap-1.5">
                {rejectionReasons.map((r) => (
                  <Button
                    key={r}
                    type="button"
                    variant="outline"
                    size="xs"
                    className="text-xs"
                    onClick={() => setReason((cur) => (cur === r ? "" : r))}
                  >
                    {r}
                  </Button>
                ))}
              </div>
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
    </div>
  )
}