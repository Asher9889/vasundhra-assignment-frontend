import { useEffect } from "react"
import { createBrowserRouter, Outlet, useLocation } from "react-router-dom"
import ProtectedRoute from "@/ProtectedRoute"
import PublicRoute from "@/PublicRoute"
import { RouteErrorBoundary } from "@/components/errors/RouteErrorBoundary"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { AdminShell } from "@/components/layout/AdminShell"
import NotFoundPage from "@/pages/NotFound"

import LoginPage from "@/pages/Login"
import ForgotPasswordPage from "@/pages/ForgotPassword"
import ResetPasswordPage from "@/pages/ResetPassword"
import HomePage from "@/pages/Home"
import ClimatePage from "@/pages/Climate"
import EnergyPage from "@/pages/Energy"
import PowerPage from "@/pages/Power"
import AboutPage from "@/pages/About"

import AdminDashboardPage from "@/pages/Admin/Dashboard"
import AddDatasetPage from "@/pages/Admin/AddDataset"
import AdminProfilePage from "@/pages/Admin/Profile"

import SuperAdminDashboardPage from "@/pages/SuperAdmin/Dashboard"
import SuperAdminDatasetsPage from "@/pages/SuperAdmin/Datasets"
import SuperAdminUsersPage from "@/pages/SuperAdmin/Users"
import SuperAdminSettingsPage from "@/pages/SuperAdmin/Settings"

import DatasetDetailPage from "@/pages/DatasetDetail"
import { USER_ROLE } from "./constants/user/user.constant"


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
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/forgot-password", element: <ForgotPasswordPage /> },
          { path: "/reset-password", element: <ResetPasswordPage /> },
        ],
      },

      // {
      //   path: "/unauthorized",
      //   element: <UnauthorizedPage />,
      // },

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
        element: <ProtectedRoute allowedRoles={[USER_ROLE.ADMIN]} />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            path: "admin",
            element: <AdminShell />,
            children: [
              { index: true, element: <AdminDashboardPage /> },
              { path: "datasets/new", element: <AddDatasetPage /> },
              { path: "datasets/:id", element: <DatasetDetailPage /> },
              { path: "profile", element: <AdminProfilePage /> },
              { path: "*", element: <NotFoundPage /> },
            ],
          },
        ],
      },

      {
        element: <ProtectedRoute allowedRoles={[USER_ROLE.SUPER_ADMIN]} />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            path: "super-admin",
            element: <AdminShell />,
            children: [
              { index: true, element: <SuperAdminDashboardPage /> },
              { path: "datasets", element: <SuperAdminDatasetsPage /> },
              { path: "datasets/:id", element: <DatasetDetailPage /> },
              { path: "users", element: <SuperAdminUsersPage /> },
              { path: "settings", element: <SuperAdminSettingsPage /> },
              { path: "profile", element: <AdminProfilePage /> },
              { path: "*", element: <NotFoundPage /> },
            ],
          },
        ],
      },

      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
])
