import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AdminSidebar, type SidebarRole } from "@/components/layout/AdminSidebar"
import { AdminHeader } from "@/components/layout/AdminHeader"
import { USER_ROLE } from "@/constants/user/user.constant"
import { useAuthUser } from "@/lib/auth-store"

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/datasets": "Dataset Management",
  "/admin/datasets/new": "Add Dataset",
  "/admin/users": "Admin Management",
  "/admin/settings": "Settings",
  "/admin/dashboard": "Dashboard",
  "/admin/profile": "Profile",
}

function sidebarRoleFrom(user: { role: typeof USER_ROLE[keyof typeof USER_ROLE] } | null): SidebarRole {
  return user?.role === USER_ROLE.SUPER_ADMIN ? "super-admin" : "admin"
}

export function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const user = useAuthUser()
  const role = sidebarRoleFrom(user)

  const title =
    pageTitles[location.pathname] ?? (location.pathname.startsWith("/admin/datasets/") ? "Dataset Review" : "Console")

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        role={role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={{
          name: user?.name,
          email: user?.email,
          roleLabel: role === "super-admin" ? "Super Admin" : "Admin",
        }}
      />
      <div className="flex flex-col lg:pl-60">
        <AdminHeader
          title={title}
          roleLabel={role === "super-admin" ? "Super Admin" : "Admin"}
          currentUser={user ?? undefined}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}