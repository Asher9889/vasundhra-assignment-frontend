import { CheckCircle2, Clock, XCircle, CircleOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  APPROVAL_STATUS,
  DATASET_ACTIVE_STATUS,
} from "@/constants/dataset/dataset.constants"
import type { ApprovalStatus, DatasetActiveStatus } from "@/constants/dataset/dataset.types"
import { approvalLabels } from "@/lib/format"

const approvalVariant: Record<ApprovalStatus, "secondary" | "default" | "destructive" | "outline"> = {
  [APPROVAL_STATUS.PENDING]: "secondary",
  [APPROVAL_STATUS.APPROVED]: "default",
  [APPROVAL_STATUS.REJECTED]: "destructive",
}

const approvalIcon: Record<ApprovalStatus, React.ComponentType<{ className?: string }>> = {
  [APPROVAL_STATUS.PENDING]: Clock,
  [APPROVAL_STATUS.APPROVED]: CheckCircle2,
  [APPROVAL_STATUS.REJECTED]: XCircle,
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
    <Badge
      variant={status === DATASET_ACTIVE_STATUS.ACTIVE ? "outline" : "ghost"}
      className="gap-1"
    >
      <CircleOff className={status === DATASET_ACTIVE_STATUS.ACTIVE ? "text-emerald-600" : ""} />
      {status === DATASET_ACTIVE_STATUS.ACTIVE ? "Active" : "Inactive"}
    </Badge>
  )
}