import { useState } from "react"
import { Link } from "react-router-dom"
import { Database, Clock, CheckCircle2, XCircle, Plus } from "lucide-react"
import { toast } from "sonner"
import { StatCard } from "@/components/common/StatCard"
import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatasetTable, type DatasetAction } from "@/components/dataset/DatasetTable"
import { useDatasetsQuery } from "@/features/datasets/hooks/useDatasetsQuery"
import { getDatasetSummaryStats } from "@/mock/dashboard"

export default function AdminDashboardPage() {
  const { datasets, pagination, isPending } = useDatasetsQuery({ limit: 50 })
  const [search, setSearch] = useState("")

  const stats = { ...getDatasetSummaryStats(datasets), total: pagination?.total ?? datasets.length }
  const rows = datasets.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()))

  function onAction(action: DatasetAction) {
    if (action === "delete") toast.info("Delete is not available in this demo.")
    else if (action === "edit") toast.info("Edit is not available in this demo.")
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
          loading={isPending}
          onAction={onAction}
          detailHref={(d) => `/admin/datasets/${d.id}`}
          emptyTitle="No datasets yet"
          emptyDescription="Submit your first dataset to see it here."
        />
      </div>
    </div>
  )
}