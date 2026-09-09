import { useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AdminSidebar, type SidebarRole } from "@/components/layout/AdminSidebar"
import { AdminHeader } from "@/components/layout/AdminHeader"
import { USER_ROLE } from "@/constants/user/user.constant"
import { useAuth } from "@/hooks/useAuth"

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/datasets": "My Datasets",
  "/admin/datasets/new": "Add Dataset",
  "/admin/profile": "Profile",
  "/super-admin": "Dashboard",
  "/super-admin/datasets": "Dataset Management",
  "/super-admin/users": "Admin Management",
  "/super-admin/settings": "Settings",
  "/super-admin/profile": "Profile",
}

function sidebarRoleFrom(user: { role: typeof USER_ROLE[keyof typeof USER_ROLE] } | null): SidebarRole {
  return user?.role === USER_ROLE.SUPER_ADMIN ? "super-admin" : "admin"
}

export function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()
  const role = sidebarRoleFrom(user)

  const isDatasetDetail = location.pathname.includes("/datasets/") && location.pathname !== "/admin/datasets/new" && location.pathname !== "/super-admin/datasets/new"

  const title =
    pageTitles[location.pathname] ?? (isDatasetDetail ? "Dataset Review" : "Console")

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        role={role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentUser={{
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
