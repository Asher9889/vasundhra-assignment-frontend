import { useState } from "react"
import { toast } from "sonner"
import { BadgeCheck, Eye, Plus, Search } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { EmptyState } from "@/components/common/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ACCOUNT_STATUS, USER_ROLE } from "@/constants/user/user.constant"
import type { IUser } from "@/constants/user/user.types"
import { formatDate, initials } from "@/lib/format"
import { AddAdminDialog } from "./components/AddAdminDialog"
import { useUpdateUserStatusMutation } from "./hooks/useUsers"
import { useUsersQuery } from "./hooks/useUsersQuery"

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "email:asc", label: "Email A-Z" },
  { value: "email:desc", label: "Email Z-A" },
]

export default function SuperAdminUsersPage() {
  const {
    users,
    pagination,
    isPending,
    isError,
    refetch,
    page,
    role,
    accountStatus,
    sort,
    searchInput,
    setSearchInput,
    updateParams,
  } = useUsersQuery()

  const updateStatus = useUpdateUserStatusMutation()

  const [addOpen, setAddOpen] = useState(false)

  function toggleStatus(user: IUser) {
    updateStatus.mutate({
      id: user.id,
      accountStatus: user.accountStatus === ACCOUNT_STATUS.ACTIVE ? ACCOUNT_STATUS.INACTIVE : ACCOUNT_STATUS.ACTIVE,
    })
  }

  const start = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0
  const end = pagination ? Math.min(pagination.page * pagination.limit, pagination.total) : 0

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Management" description="Create and manage administrator accounts for dataset submission.">
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="size-4" />
          Add Admin
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-2">
        {pagination && (
          <span className="text-sm text-muted-foreground">
            {pagination.total > 0 ? `${pagination.total} account${pagination.total === 1 ? "" : "s"}` : "No accounts"}
          </span>
        )}

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by email…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-8"
              aria-label="Search admins"
            />
          </div>

          <Select value={role} onValueChange={(value) => updateParams({ role: value })}>
            <SelectTrigger className="h-8" aria-label="Filter by role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value={USER_ROLE.ADMIN}>Administrators</SelectItem>
              <SelectItem value={USER_ROLE.SUPER_ADMIN}>Super admins</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={accountStatus ?? "ALL"}
            onValueChange={(value) => updateParams({ accountStatus: value === "ALL" ? null : value })}
          >
            <SelectTrigger className="h-8" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value={ACCOUNT_STATUS.ACTIVE}>Active</SelectItem>
              <SelectItem value={ACCOUNT_STATUS.INACTIVE}>Inactive</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(value) => updateParams({ sort: value })}>
            <SelectTrigger className="h-8" aria-label="Sort accounts">
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

      <div className="rounded-lg border">
        {isPending ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : isError ? (
          <>
            <EmptyState title="Couldn't load accounts" description="The server may be unreachable. Try again." />
            <div className="flex justify-center pb-6">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </>
        ) : users.length === 0 ? (
          <EmptyState title="No accounts found" description="No accounts match the current filters." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Account Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isActive = user.accountStatus === ACCOUNT_STATUS.ACTIVE
                  const isToggling = updateStatus.isPending && updateStatus.variables?.id === user.id

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="size-8">
                            <AvatarFallback className="bg-muted text-xs">{initials(user.email)}</AvatarFallback>
                          </Avatar>
                          <span className="min-w-0 font-medium text-foreground">{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === USER_ROLE.SUPER_ADMIN ? "outline" : "secondary"}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isActive ? "outline" : "ghost"}
                          className={isActive ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400" : ""}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(user.updatedAt)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />} aria-label={`Actions for ${user.email}`}>
                            <Eye className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            </DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() =>
                                toast.info(`${user.email} · ${user.role} · created ${formatDate(user.createdAt)} · updated ${formatDate(user.updatedAt)}`)
                              }
                            >
                              <Eye className="size-4" />
                              View details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.role === USER_ROLE.ADMIN ? (
                              <DropdownMenuItem onClick={() => toggleStatus(user)} disabled={isToggling}>
                                <BadgeCheck className="size-4" />
                                {isActive ? "Disable" : "Enable"}
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem disabled>
                                <BadgeCheck className="size-4" />
                                Protected
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>

            {pagination && (
              <div className="flex items-center justify-between gap-4 border-t px-4 py-3">
                <span className="text-sm text-muted-foreground">
                  {pagination.total === 0 ? "No accounts" : `Showing ${start}–${end} of ${pagination.total}`}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => updateParams({ page: String(page - 1) })}
                  >
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
      </div>

      <AddAdminDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}