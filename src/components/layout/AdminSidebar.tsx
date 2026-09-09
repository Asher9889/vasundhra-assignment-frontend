import { NavLink, Link } from "react-router-dom"
import {
  LayoutDashboard,
  Database,
  Users,
  Settings,
  LogOut,
  FolderOpen,
  FilePlus2,
  UserCircle,
  X,
} from "lucide-react"
import { Logo } from "@/components/common/Logo"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLogoutMutation } from "@/hooks/useLogoutMutation"

export type SidebarRole = "super-admin" | "admin"

interface NavItem {
  label: string
  to: string
  icon: React.ComponentType<{ className?: string }>
  end?: boolean
}

const superAdminNav: NavItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Datasets", to: "/admin/datasets", icon: Database },
  { label: "Admins", to: "/admin/users", icon: Users },
  { label: "Settings", to: "/admin/settings", icon: Settings },
]

const adminNav: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard, end: true },
  { label: "My Datasets", to: "/admin/dashboard#datasets", icon: FolderOpen },
  { label: "Add Dataset", to: "/admin/datasets/new", icon: FilePlus2 },
  { label: "Profile", to: "/admin/profile", icon: UserCircle },
]

interface AdminSidebarProps {
  role: SidebarRole
  open: boolean
  onClose: () => void
  currentUser?: { email?: string; roleLabel: string }
}

export function AdminSidebar({ role, open, onClose, currentUser }: AdminSidebarProps) {
  const logoutMutation = useLogoutMutation()
  const nav = role === "super-admin" ? superAdminNav : adminNav

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
        <Link to={role === "super-admin" ? "/admin" : "/admin/dashboard"} aria-label="Vasudha console home">
          <Logo compact />
        </Link>
        <Button variant="ghost" size="icon-sm" className="lg:hidden" onClick={onClose} aria-label="Close sidebar">
          <X />
        </Button>
      </div>

      <div className="border-b px-4 py-3 text-xs text-muted-foreground">
        {role === "super-admin" ? "Super Admin Console" : "Admin Console"}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2" aria-label="Console navigation">
        {nav.map((item) => (
          <NavLink
            key={`${item.to}-${item.label}`}
            to={item.to}
            onClick={onClose}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-2">
        <div className="mb-2 flex items-center gap-2.5 rounded-md px-2 py-1.5">
          {currentUser ? (
            <>
              <span className="flex size-7 items-center justify-center rounded-full bg-muted text-[11px] font-semibold">
                {(currentUser.email ?? "?").charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-xs font-medium text-foreground">{currentUser.email}</p>
                <p className="text-[10px] text-muted-foreground">{currentUser.roleLabel}</p>
              </div>
            </>
          ) : null}
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="size-4" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r bg-background lg:block">{content}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={onClose} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-64 border-r bg-background shadow-lg">{content}</aside>
        </div>
      )}
    </>
  )
}
