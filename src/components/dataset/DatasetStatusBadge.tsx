import { CheckCircle2, Clock, XCircle, CircleOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { ApprovalStatus, DatasetActiveStatus } from "@/types"
import { approvalLabels } from "@/lib/format"

const approvalVariant: Record<ApprovalStatus, "secondary" | "default" | "destructive" | "outline"> = {
  pending: "secondary",
  approved: "default",
  rejected: "destructive",
}

const approvalIcon: Record<ApprovalStatus, React.ComponentType<{ className?: string }>> = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
}

interface DatasetStatusBadgeProps {
  status: ApprovalStatus
}

export function DatasetStatusBadge({ status }: DatasetStatusBadgeProps) {
  const Icon = approvalIcon[status]
  return (
    <Badge variant={approvalVariant[status]} className="gap-1">
      <Icon className="size-3" />
      {approvalLabels[status]}
    </Badge>
  )
}

export function ActiveStatusBadge({ status }: { status: DatasetActiveStatus }) {
  return (
    <Badge variant={status === "active" ? "outline" : "ghost"} className="gap-1">
      <CircleOff className={status === "active" ? "text-emerald-600" : ""} />
      {status === "active" ? "Active" : "Inactive"}
    </Badge>
  )
}