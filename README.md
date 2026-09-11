# Vasudha Foundation Data Platform — Frontend

React single-page application for the Vasudha Foundation data platform: a public site for browsing climate, energy and power datasets as charts and maps, plus admin and super-admin consoles for submitting CSV datasets and reviewing them for publication.

## Features

- Public site with domain pages (Climate, Energy, Power) showing approved visualizations, plus Home and About pages
- Chart and map rendering: line, bar, and area charts (Recharts), an India map with latitude/longitude points, and a state-level heatmap
- Admin console: dashboard, multi-step CSV dataset submission, dataset detail, profile
- Super-admin console: dashboard, dataset review with approve/reject (and rejection reasons), admin user management, settings
- Cookie-based authentication with login, logout, and forgot/reset password flows

## Tech Stack

| Area | Technology |
| --- | --- |
| Core | React 19, TypeScript, Vite |
| Routing | React Router 7 |
| Data fetching | TanStack Query, Axios |
| Forms | react-hook-form + Zod |
| Charts / maps | Recharts, `@svg-maps/india`, custom SVG |
| Styling | Tailwind CSS 4, Base UI (Base UI React), shadcn-style components |
| UX | lucide-react icons, sonner toasts |

## Application Structure

```
src/
├── routes.tsx                 # route table (createBrowserRouter)
├── ProtectedRoute.tsx         # auth + role guard wrapper
├── PublicRoute.tsx            # redirects authenticated users away from public auth pages
├── config/                    # axios client, apiEndPoints, envConfig, queryClient
├── hooks/                     # auth queries/mutations (me, login, logout, forgot/reset)
├── pages/                     # route pages (public, admin, super-admin, auth)
├── features/                  # add-dataset flow, public dataset cards, chart-builder
├── components/
│   ├── ui/                    # shadcn-style primitives (button, input, dialog, table, …)
│   ├── visualization/         # LineChart, BarChart, AreaChart, IndiaMap, StateHeatmap, renderer, card
│   └── layout/                # public layout, admin shell, headers, sidebar
├── constants/                 # roles, domains, chart types, approval status enums
├── mock/                      # demo data (admin stats, rejection reasons)
└── types/                     # shared types
```

API calls go through `src/config/axios.ts`, which sets `withCredentials: true`, unwraps the response envelope, and transparently calls `POST /auth/refresh` once on a 401 before retrying. `src/config/apiEndPoints.ts` centralizes all endpoint paths.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | public | Home: hero, published visualizations, workflow section |
| `/climate` `/energy` `/power` | public | Domain pages with approved, domain-filtered visualizations |
| `/about` | public | About |
| `/login` | public* | Sign in |
| `/forgot-password` | public* | Request a password reset link |
| `/reset-password?token=…` | public* | Set a new password |
| `/admin` | admin | Dashboard with own datasets and stats |
| `/admin/datasets/new` | admin | Multi-step CSV dataset submission |
| `/admin/datasets/:id` | admin | Dataset detail |
| `/admin/profile` | admin | Profile (demo) |
| `/super-admin` | super-admin | Dashboard with all datasets, approve/reject |
| `/super-admin/datasets` | super-admin | Searchable/paginated dataset list with moderation |
| `/super-admin/datasets/:id` | super-admin | Dataset detail with moderation |
| `/super-admin/users` | super-admin | Manage admin accounts (create, enable/disable) |
| `/super-admin/settings` | super-admin | Settings (demo) |
| `/admin/*` `/super-admin/*` `*` | — | Not found |

\* Authenticated users visiting login/forgot/reset pages are redirected to their role dashboard.

## Authentication

- Cookie-based sessions; no tokens are stored in `localStorage`. `useAuth` queries `GET /auth/me` and reports `CHECKING` / `AUTHENTICATED` / `UNAUTHENTICATED`.
- `ProtectedRoute` shows a splash screen while checking, redirects unauthenticated users to `/login`, and redirects role mismatches to `/unauthorized` (which currently falls through to the not-found page).
- Login, logout, forgot-password and reset-password flows use TanStack Query mutations; reset-password treats a `400` response as an invalid/expired link and shows the corresponding state.

## Dataset & Visualization Flow

- **Submission (admin, `/admin/datasets/new`)**: a stepped form uploads a CSV (`POST /datasets/upload`), shows the detected schema and invalid-row summary, then collects visualization configuration — template (`LAT_LONG` / `STATE_WISE` / `TIME_SERIES`), chart type (time-series only: line/bar/area), and column mappings (lat-long/value, state/value, x/value) with heuristic column suggestions. It previews the data and renders a live chart before submitting `POST /datasets` with the `fileKey`, schema, and visualization config. New datasets are created as `PENDING`.
- **Moderation (super-admin)**: dataset tables and detail views offer Approve/Reject actions (with an optional rejection reason). Approving calls `PATCH /datasets/:id/status`; approved datasets appear on the public site.
- **Public display**: `PublishedVisualizationCard` fetches an approved dataset via `GET /datasets/public/:id`, builds chart data, and renders it through `VisualizationRenderer`, which dispatches on chart type — `LINE`/`BAR`/`AREA` to Recharts components, `INDIA_MAP` to the custom map with location points, and `STATE_HEATMAP` to the state choropleth.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `VITE_BASE_URL` | Backend API base URL, including `/api/v1` (e.g. `http://localhost:4508/api/v1`) |

Set it in `.env` at build/dev time. `.env.sample` documents the key.

## Local Development

```bash
npm install
npm run dev       # Vite dev server (default http://localhost:5173)
```

```bash
npm run build     # tsc -b && vite build → dist/
npm run preview   # serve the built app
npm run lint      # ESLint
```
