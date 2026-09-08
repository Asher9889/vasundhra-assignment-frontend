import { useState } from "react"
import { useLocation } from "react-router-dom"
import { AdminSidebar, type SidebarRole } from "@/components/layout/AdminSidebar"
import { AdminHeader } from "@/components/layout/AdminHeader"
import type { ReactNode } from "react"

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/datasets": "Dataset Management",
  "/admin/datasets/new": "Add Dataset",
  "/admin/users": "Admin Management",
  "/admin/settings": "Settings",
  "/admin/dashboard": "Dashboard",
  "/admin/profile": "Profile",
}

interface AdminShellProps {
  role: SidebarRole
  children: ReactNode
  currentUser?: { name?: string; email?: string }
}

export function AdminShell({ role, children, currentUser }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const title =
    pageTitles[location.pathname] ?? (location.pathname.startsWith("/admin/datasets/") ? "Dataset Review" : "Console")

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        role={role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={{
          name: currentUser?.name,
          email: currentUser?.email,
          roleLabel: role === "super-admin" ? "Super Admin" : "Admin",
        }}
      />
      <div className="flex flex-col lg:pl-60">
        <AdminHeader
          title={title}
          roleLabel={role === "super-admin" ? "Super Admin" : "Admin"}
          currentUser={currentUser}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}