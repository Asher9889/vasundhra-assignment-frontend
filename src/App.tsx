import { useEffect } from "react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { AdminShell } from "@/components/layout/AdminShell"
import type { SidebarRole } from "@/components/layout/AdminSidebar"
import HomePage from "@/pages/Home"
import ClimatePage from "@/pages/Climate"
import EnergyPage from "@/pages/Energy"
import PowerPage from "@/pages/Power"
import AboutPage from "@/pages/About"
import LoginPage from "@/pages/Login"
import SuperAdminDashboard from "@/pages/SuperAdmin/Dashboard"
import SuperAdminDatasetsPage from "@/pages/SuperAdmin/Datasets"
import SuperAdminUsersPage from "@/pages/SuperAdmin/Users"
import SuperAdminSettingsPage from "@/pages/SuperAdmin/Settings"
import DatasetDetailPage from "@/pages/DatasetDetail"
import AdminDashboardPage from "@/pages/Admin/Dashboard"
import AddDatasetPage from "@/pages/Admin/AddDataset"
import AdminProfilePage from "@/pages/Admin/Profile"

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

function NotFoundPage() {
  return <Navigate to="/" replace />
}

function AdminRouteShell({ role, children }: { role: SidebarRole; children: React.ReactNode }) {
  return <AdminShell role={role}>{children}</AdminShell>
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/climate" element={<ClimatePage />} />
          <Route path="/energy" element={<EnergyPage />} />
          <Route path="/power" element={<PowerPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        {/* Super Admin console */}
        <Route
          path="/admin"
          element={
            <AdminRouteShell role="super-admin">
              <SuperAdminDashboard />
            </AdminRouteShell>
          }
        />
        <Route
          path="/admin/datasets"
          element={
            <AdminRouteShell role="super-admin">
              <SuperAdminDatasetsPage />
            </AdminRouteShell>
          }
        />
        <Route
          path="/admin/datasets/:id"
          element={
            <AdminRouteShell role="super-admin">
              <DatasetDetailPage />
            </AdminRouteShell>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRouteShell role="super-admin">
              <SuperAdminUsersPage />
            </AdminRouteShell>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRouteShell role="super-admin">
              <SuperAdminSettingsPage />
            </AdminRouteShell>
          }
        />

        {/* Admin console */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRouteShell role="admin">
              <AdminDashboardPage />
            </AdminRouteShell>
          }
        />
        <Route
          path="/admin/datasets/new"
          element={
            <AdminRouteShell role="admin">
              <AddDatasetPage />
            </AdminRouteShell>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRouteShell role="admin">
              <AdminProfilePage />
            </AdminRouteShell>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}