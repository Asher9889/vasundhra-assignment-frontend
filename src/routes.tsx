import { useEffect } from "react"
import { createBrowserRouter, Outlet, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Database,
  Settings,
  Users,
  FilePlus2,
  UserRound,
  SlidersHorizontal,
} from "lucide-react"
import { USER_ROLE } from "@/constants/user/user.constant"
import ProtectedRoute from "@/ProtectedRoute"
import PublicRoute from "@/PublicRoute"
import { RoleGuard } from "@/components/common/RoleGuard"
import { RouteErrorBoundary } from "@/components/errors/RouteErrorBoundary"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { AdminShell } from "@/components/layout/AdminShell"
import NotFoundPage from "@/pages/NotFound"

import LoginPage from "@/pages/Login"
import HomePage from "@/pages/Home"
import ClimatePage from "@/pages/Climate"
import EnergyPage from "@/pages/Energy"
import PowerPage from "@/pages/Power"
import AboutPage from "@/pages/About"

import SuperAdminDashboardPage from "@/pages/SuperAdmin/Dashboard"
import SuperAdminDatasetsPage from "@/pages/SuperAdmin/Datasets"
import SuperAdminUsersPage from "@/pages/SuperAdmin/Users"
import SuperAdminSettingsPage from "@/pages/SuperAdmin/Settings"
import DatasetDetailPage from "@/pages/DatasetDetail"
import AdminDashboardPage from "@/pages/Admin/Dashboard"
import AddDatasetPage from "@/pages/Admin/AddDataset"
import AdminProfilePage from "@/pages/Admin/Profile"

import type { AppRoutes, ChildRoute, UserRole } from "@/types/route.type"

export const APP_ROUTES: AppRoutes = {
  superAdminDashboard: {
    title: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    element: SuperAdminDashboardPage,
    showInSidebar: true,
    group: "Super Admin",
    roles: [USER_ROLE.SUPER_ADMIN],
  },

  datasetManagement: {
    title: "Datasets",
    path: "/admin/datasets",
    icon: Database,
    element: SuperAdminDatasetsPage,
    showInSidebar: true,
    group: "Super Admin",
    roles: [USER_ROLE.SUPER_ADMIN],
  },

  adminManagement: {
    title: "Admins",
    path: "/admin/users",
    icon: Users,
    element: SuperAdminUsersPage,
    showInSidebar: true,
    group: "Super Admin",
    roles: [USER_ROLE.SUPER_ADMIN],
  },

  settings: {
    title: "Settings",
    path: "/admin/settings",
    icon: Settings,
    element: SuperAdminSettingsPage,
    showInSidebar: true,
    group: "Super Admin",
    roles: [USER_ROLE.SUPER_ADMIN],
  },

  adminDashboard: {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
    element: AdminDashboardPage,
    showInSidebar: true,
    group: "Admin",
    roles: [USER_ROLE.ADMIN],
  },

  addDataset: {
    title: "Add Dataset",
    path: "/admin/datasets/new",
    icon: FilePlus2,
    element: AddDatasetPage,
    showInSidebar: true,
    group: "Admin",
    roles: [USER_ROLE.ADMIN],
  },

  datasetReview: {
    title: "Dataset Review",
    path: "/admin/datasets/:id",
    icon: SlidersHorizontal,
    element: DatasetDetailPage,
    showInSidebar: false,
    group: "Shared",
    roles: [USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN],
  },

  profile: {
    title: "Profile",
    path: "/admin/profile",
    icon: UserRound,
    element: AdminProfilePage,
    showInSidebar: true,
    group: "Admin",
    roles: [USER_ROLE.ADMIN],
  },
}

const buildChildRoutes = (children: ChildRoute[], parentRoles: UserRole[]) => {
  return children.map((child) => {
    const element = (
      <RoleGuard roles={child.roles ?? parentRoles}>
        <child.element />
      </RoleGuard>
    )

    if (child.path === undefined) {
      return {
        index: true as const,
        element,
      }
    }
    return {
      path: child.path,
      element,
    }
  })
}

const protectedChildren = Object.values(APP_ROUTES).map((route) => ({
  path: route.path.replace("/", ""),
  element: (
    <RoleGuard roles={route.roles}>
      <route.element />
    </RoleGuard>
  ),
  children: route.children && route.children.length > 0 ? buildChildRoutes(route.children, route.roles) : undefined,
}))

function ScrollToTopLayout() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return <Outlet />
}

export const router = createBrowserRouter([
  {
    element: <ScrollToTopLayout />,
    children: [
      {
        element: <PublicRoute />,
        children: [{ path: "/login", element: <LoginPage /> }],
      },

      {
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            path: "/",
            element: <PublicLayout />,
            children: [
              { index: true, element: <HomePage /> },
              { path: "climate", element: <ClimatePage /> },
              { path: "energy", element: <EnergyPage /> },
              { path: "power", element: <PowerPage /> },
              { path: "about", element: <AboutPage /> },
            ],
          },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminShell />,
            errorElement: <RouteErrorBoundary />,
            children: [...protectedChildren, { path: "*", element: <NotFoundPage /> }],
          },
        ],
      },
    ],
  },
])