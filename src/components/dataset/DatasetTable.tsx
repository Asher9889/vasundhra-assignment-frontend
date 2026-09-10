import { Link } from "react-router-dom"
import {
  MoreHorizontal,
  Eye,
  Pencil,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DatasetStatusBadge } from "./DatasetStatusBadge"
import { EmptyState } from "@/components/common/EmptyState"
import {
  APPROVAL_STATUS,
  DATASET_ACTIVE_STATUS,
} from "@/constants/dataset/dataset.constants"
import type { Dataset } from "@/constants/dataset/dataset.types"
import { chartTypeLabels, domainLabels, formatDate } from "@/lib/format"
import { cn } from "@/lib/utils"

export type DatasetTableRole = "super-admin" | "admin"

export type DatasetAction =
  | "view"
  | "edit"
  | "approve"
  | "reject"
  | "delete"

interface DatasetTableProps {
  datasets: Dataset[]
  role: DatasetTableRole
  loading?: boolean
  onAction?: (action: DatasetAction, dataset: Dataset) => void
  detailHref?: (dataset: Dataset) => string
  emptyTitle?: string
  emptyDescription?: string
}

export function DatasetTable({
  datasets,
  role,
  loading = false,
  onAction,
  detailHref,
  emptyTitle = "No datasets found",
  emptyDescription = "There are no datasets matching the current filters.",
}: DatasetTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  if (datasets.length === 0) {
    return (
      <div className="rounded-lg border">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead>Chart Title</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Chart Type</TableHead>
            {role === "super-admin" ? (
              <TableHead>Added By</TableHead>
            ) : (
              <TableHead>
                <span className="flex items-center gap-1">Status</span>
              </TableHead>
            )}
            <TableHead>Approval</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datasets.map((dataset) => (
            <TableRow key={dataset.id}>
              <TableCell className="max-w-52">
                <Link
                  to={detailHref ? detailHref(dataset) : "#"}
                  className="line-clamp-1 font-medium text-foreground hover:text-primary hover:underline"
                >
                  {dataset.title}
                </Link>
              </TableCell>
              <TableCell>
                <span className="capitalize">{domainLabels[dataset.domain]}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">{chartTypeLabels[dataset.chartType]}</TableCell>
              {role === "super-admin" ? (
                <TableCell className="text-muted-foreground">{dataset.uploadedBy}</TableCell>
              ) : (
                <TableCell>
                  {dataset.activeStatus ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-xs font-medium",
                        dataset.activeStatus === DATASET_ACTIVE_STATUS.ACTIVE ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                      )}
                    >
                      <span className={cn("size-1.5 rounded-full", dataset.activeStatus === DATASET_ACTIVE_STATUS.ACTIVE ? "bg-emerald-500" : "bg-muted-foreground")} />
                      {dataset.activeStatus === DATASET_ACTIVE_STATUS.ACTIVE ? "Active" : "Inactive"}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
              )}
              <TableCell>
                <DatasetStatusBadge status={dataset.status} />
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(dataset.createdAt)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />} aria-label={`Actions for ${dataset.title}`}>
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => onAction?.("view", dataset)}
                      render={
                        detailHref ? (
                          <Link to={detailHref(dataset)} className="flex items-center gap-1.5" />
                        ) : undefined
                      }
                    >
                      <Eye className="size-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction?.("edit", dataset)}>
                      <Pencil className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    {role === "super-admin" && (
                      <>
                        <DropdownMenuSeparator />
                        {dataset.status !== APPROVAL_STATUS.APPROVED && (
                          <DropdownMenuItem onClick={() => onAction?.("approve", dataset)}>
                            <CheckCircle2 className="size-4" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {dataset.status !== APPROVAL_STATUS.REJECTED && (
                          <DropdownMenuItem onClick={() => onAction?.("reject", dataset)} variant="destructive">
                            <XCircle className="size-4" />
                            Reject
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onAction?.("delete", dataset)} variant="destructive">
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}