import { ACCOUNT_STATUS } from "@/constants/user/user.constant"
import type { AdminUser } from "@/constants/user/user.types"

export const mockAdmins: AdminUser[] = [
  {
    id: "adm-001",
    email: "admin@vasudha.org",
    name: "Vasudha Admin",
    role: "ADMIN",
    status: ACCOUNT_STATUS.ACTIVE,
    createdAt: "2026-03-12T08:00:00Z",
    lastLogin: "2026-09-09T01:30:00Z",
  },
  {
    id: "adm-002",
    email: "operations@vasudha.org",
    name: "Operations Desk",
    role: "ADMIN",
    status: ACCOUNT_STATUS.ACTIVE,
    createdAt: "2026-04-02T11:20:00Z",
    lastLogin: "2026-09-08T18:45:00Z",
  },
  {
    id: "adm-003",
    email: "research@vasudha.org",
    name: "Research Cell",
    role: "ADMIN",
    status: ACCOUNT_STATUS.ACTIVE,
    createdAt: "2026-05-21T10:15:00Z",
    lastLogin: "2026-09-05T07:10:00Z",
  },
  {
    id: "adm-004",
    email: "analytics@vasudha.org",
    name: "Analytics Team",
    role: "ADMIN",
    status: ACCOUNT_STATUS.INACTIVE,
    createdAt: "2026-06-14T09:40:00Z",
    lastLogin: "2026-08-01T03:25:00Z",
  },
  {
    id: "adm-005",
    email: "sharma.ankit@vasudha.org",
    name: "Ankit Sharma",
    role: "ADMIN",
    status: ACCOUNT_STATUS.ACTIVE,
    createdAt: "2026-07-30T14:00:00Z",
    lastLogin: "2026-09-07T12:50:00Z",
  },
  {
    id: "adm-006",
    email: "priya.nair@vasudha.org",
    name: "Priya Nair",
    role: "ADMIN",
    status: ACCOUNT_STATUS.INACTIVE,
    createdAt: "2026-08-18T16:30:00Z",
    lastLogin: undefined,
  },
]