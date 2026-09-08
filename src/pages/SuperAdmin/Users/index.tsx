import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Plus, Mail, Search, Eye, BadgeCheck } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge as StatusBadge } from "@/components/ui/badge"
import { EmptyState } from "@/components/common/EmptyState"
import { mockAdmins } from "@/mock/admins"
import type { AdminUser } from "@/types"
import type { AdminUserErrors, AdminUserFormStatus } from "@/types/super-admin"
import { formatDate, initials } from "@/lib/format"

export default function SuperAdminUsersPage() {
  const [admins, setAdmins] = useState<AdminUser[]>(mockAdmins)
  const [search, setSearch] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<AdminUserErrors>({})
  const [formStatus, setFormStatus] = useState<AdminUserFormStatus>("idle")

  const rows = admins.filter(
    (a) => a.email.toLowerCase().includes(search.toLowerCase()) || (a.name ?? "").toLowerCase().includes(search.toLowerCase())
  )

  const roleCounts = useMemo(
    () => ({
      active: admins.filter((a) => a.status === "active").length,
      inactive: admins.filter((a) => a.status === "inactive").length,
    }),
    [admins]
  )

  function toggleStatus(user: AdminUser) {
    const action = user.status === "active" ? "disabled" : "enabled"
    setAdmins((cur) => cur.map((a) => (a.id === user.id ? { ...a, status: action === "enabled" ? "active" : "inactive" } : a)))
    toast.success(`${user.email} ${action === "enabled" ? "enabled" : "disabled"}.`)
  }

  function deleteUser(user: AdminUser) {
    setAdmins((cur) => cur.filter((a) => a.id !== user.id))
    toast.success(`Account ${user.email} deleted.`)
  }

  function submitAddAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const found: AdminUserErrors = {}
    if (!email.trim()) found.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) found.email = "Enter a valid email address"
    if (!password) found.password = "Password is required"
    else if (password.length < 6) found.password = "Password must be at least 6 characters"
    setErrors(found)
    if (Object.keys(found).length > 0) {
      setFormStatus("error")
      return
    }

    setFormStatus("submitting")
    window.setTimeout(() => {
      const newAdmin: AdminUser = {
        id: `adm-${Date.now()}`,
        email: email.trim().toLowerCase(),
        role: "ADMIN",
        status: "active",
        createdAt: new Date().toISOString(),
        lastLogin: undefined,
      }
      setAdmins((cur) => [newAdmin, ...cur])
      setFormStatus("success")
      setAddOpen(false)
      setEmail("")
      setPassword("")
      setErrors({})
      toast.success(`Admin account created. Invitation email sent to ${newAdmin.email}.`)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Management"
        description="Create and manage administrator accounts for dataset submission."
      >
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="size-4" />
          Add Admin
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-3 text-sm text-muted-foreground">
          <span>
            {roleCounts.active} <span className="font-medium text-foreground">active</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {roleCounts.inactive} <span className="font-medium text-foreground">inactive</span>
          </span>
        </div>
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by email or name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
            aria-label="Search admins"
          />
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-lg border">
          <EmptyState title="No admins found" description="Try a different search term." />
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Email</TableHead>
                <TableHead>Account Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-muted text-xs">{initials(admin.name ?? admin.email)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{admin.email}</p>
                        {admin.name && <p className="text-xs text-muted-foreground">{admin.name}</p>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      variant={admin.status === "active" ? "outline" : "ghost"}
                      className={admin.status === "active" ? "border-emerald-500/50 text-emerald-600 dark:text-emerald-400" : ""}
                    >
                      {admin.status === "active" ? "Active" : "Inactive"}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(admin.createdAt)}</TableCell>
                  <TableCell className="text-muted-foreground">{admin.lastLogin ? formatDate(admin.lastLogin) : "Never"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />} aria-label={`Actions for ${admin.email}`}>
                        <Eye className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => toast.info(`${admin.email} · role ADMIN · created ${formatDate(admin.createdAt)}`)}>
                          <Eye className="size-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info("Edit is not available in this demo.")}>
                          <Mail className="size-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {admin.status === "active" ? (
                          <DropdownMenuItem onClick={() => toggleStatus(admin)}>
                            <BadgeCheck className="size-4" />
                            Disable
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => toggleStatus(admin)}>
                            <BadgeCheck className="size-4" />
                            Enable
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive" onClick={() => deleteUser(admin)}>
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
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add admin</DialogTitle>
            <DialogDescription>Create a new administrator account. Credentials and role are configured below.</DialogDescription>
          </DialogHeader>
          <form id="add-admin-form" onSubmit={submitAddAdmin} noValidate className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="naya.admin@vasudha.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                disabled={formStatus === "submitting"}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(errors.password)}
                disabled={formStatus === "submitting"}
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Role</Label>
                <div className="pointer-events-none">
                  <Badge variant="secondary" className="h-8 w-full justify-center rounded-lg">
                    ADMIN
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">Fixed to ADMIN</p>
              </div>
              <div className="space-y-1.5">
                <Label>Account status</Label>
                <div className="pointer-events-none">
                  <Badge variant="outline" className="h-8 w-full justify-center rounded-lg border-emerald-500/50 text-emerald-600 dark:text-emerald-400">
                    ACTIVE
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground">Default on creation</p>
              </div>
            </div>

            <div className="rounded-lg border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
              An account creation email with a sign-in link will be sent to the email above once the account is created.
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={formStatus === "submitting"}>
              Cancel
            </Button>
            <Button type="submit" form="add-admin-form" disabled={formStatus === "submitting"}>
              {formStatus === "submitting" ? "Creating…" : "Create Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}