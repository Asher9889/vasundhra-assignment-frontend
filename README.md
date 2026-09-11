# Vasudha Foundation Data Platform — Frontend

React single-page application for the Vasudha Foundation data platform: a public site where anyone can browse approved Climate, Energy and Power datasets as interactive charts and maps, plus Admin and Super Admin consoles for submitting CSV datasets and reviewing them for publication.

- **Deployed:** [https://vasudha.saurabhkushwaha.in](https://vasudha.saurabhkushwaha.in)
- **Frontend repo:** [Asher9889/vasudha-assignment-frontend](https://github.com/Asher9889/vasudha-assignment-frontend)
- **Backend repo:** [Asher9889/vasudha-assignment-backend](https://github.com/Asher9889/vasudha-assignment-backend)

## Features

- Public site (no login): landing page showing all approved visualizations in recency order, plus dedicated `/climate`, `/energy`, `/power` domain pages and `/about`
- Interactive visualizations: line, bar, and area charts (Recharts); an India map with zoom, pan, and clickable lat/long data points; a state-level choropleth heatmap with labels and hover tooltips
- Admin console: dashboard, multi-step CSV dataset submission (upload → schema detection → visualization config → data/visual preview → submit), dataset detail, profile
- Super Admin console: dashboard and dataset list with approve/reject (with rejection reasons), Admin user management (create, enable/disable), settings, profile
- Cookie-based authentication with login, logout, and forgot/reset password flows
- Approved-only visibility: pending/rejected datasets never appear on the public site

## Requirements Coverage

| Requirement | Status |
| --- | --- |
| Normal users access published charts/maps without login | ✅ Public routes fetch only approved datasets from `GET /datasets/public` |
| Landing page shows approved visualizations in publication/recency order | ✅ Sorted by `createdAt desc` (most recently published first) |
| Same visualization also appears on its domain page | ✅ Domain pages filter by `domain` via the same public API |
| Domain routes `/climate`, `/energy`, `/power` | ✅ |
| Admin dashboard: own datasets in tabular form (title, domain, chart type, status, approval, added-by) | ✅ |
| Add Dataset: `.csv` upload with schema validation and error messaging | ✅ Multi-step form surfaces detected schema + per-row errors |
| Domain + Chart Type selection (India map / heatmap / line / bar / area) | ✅ Template + chart-type + column-mapping pickers |
| Chart Title input | ✅ Title/domain step |
| New datasets default to `PENDING`, hidden until approved | ✅ Submit shows "pending" state; public API only returns approved |
| Admin sees rejected/pending status | ✅ Status badges + rejection-reason panel |
| Super Admin approves/rejects and sees which Admin added each | ✅ In dashboards/detail via `PATCH /datasets/:id/status` |
| Super Admin edits / deletes datasets | ⚠️ Not implemented (Edit/Delete show demo notifications; backend has no routes) |
| Interact with charts and maps (zoom, pan, point info) | ✅ India map zoom/pan/click; heatmap hover; chart tooltips |
| Forgot / Reset password | ✅ Bonus — implemented end-to-end |
| Responsive layout (desktop/tablet/mobile) | ⚠️ Tailwind-based responsive layout; not device-tested as a separate milestone |

## Tech Stack

| Area | Technology |
| --- | --- |
| Core | React 19, TypeScript, Vite 8 |
| Routing | React Router 7 (`createBrowserRouter`) |
| Data fetching | TanStack Query 5, Axios |
| Forms | react-hook-form + Zod (login, forgot/reset, dataset submit) |
| Charts | Recharts 3 (line, bar, area) |
| Maps | Hand-rolled SVG on `@svg-maps/india` paths (lat/long map + state heatmap) |
| Styling | Tailwind CSS 4, Base UI (`@base-ui/react`), shadcn-style components |
| UI extras | lucide-react icons, sonner toasts |

## Application Structure

```
src/
├── routes.tsx                 # route table (public, admin, super-admin, auth)
├── ProtectedRoute.tsx         # auth + role guard (checking → redirect → render)
├── PublicRoute.tsx            # redirects authenticated users away from auth pages
├── config/                    # axios client, apiEndPoints, envConfig, queryClient
├── hooks/                     # auth queries/mutations (me, login, logout, forgot/reset)
├── pages/                     # route pages (public, admin, super-admin, auth, detail)
├── features/
│   ├── add-dataset/           # multi-step submission flow (steps, csv helpers, chart builder)
│   └── datasets/              # public cards, detail queries, status mutation, chart builder
├── components/
│   ├── ui/                    # shadcn-style primitives (button, input, dialog, table, …)
│   ├── visualization/         # Line/Bar/Area charts, IndiaMap, StateHeatmap, renderer, card
│   └── layout/                # PublicLayout, AdminShell, headers, sidebar
├── constants/                 # roles, domains, chart types, approval status enums
├── mock/                      # demo data (admin stats, rejection reasons)
└── types/                     # shared types (API envelope, user)
```

API calls flow through `src/config/axios.ts`: `withCredentials: true`, response envelope unwrapping, and automatic single retry via `POST /auth/refresh` on 401. All endpoint paths are centralized in `src/config/apiEndPoints.ts`.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | public | Landing page: hero, all approved visualizations (recency order), workflow section |
| `/climate` `/energy` `/power` | public | Domain pages with approved, domain-filtered visualizations |
| `/about` | public | About / how the platform works |
| `/login` | public* | Sign in |
| `/forgot-password` | public* | Request a password-reset email |
| `/reset-password?token=…` | public* | Set a new password via emailed link |
| `/admin` | admin | Dashboard with own datasets and summary stats |
| `/admin/datasets/new` | admin | Multi-step CSV dataset submission |
| `/admin/datasets/:id` | admin | Dataset detail |
| `/admin/profile` | admin | Profile (demo) |
| `/super-admin` | super-admin | Dashboard with all datasets + moderation |
| `/super-admin/datasets` | super-admin | Searchable/paginated dataset list + moderation |
| `/super-admin/datasets/:id` | super-admin | Dataset detail + moderation |
| `/super-admin/users` | super-admin | Create / enable / disable Admin accounts |
| `/super-admin/settings` | super-admin | Settings (demo) |
| `/super-admin/profile` | super-admin | Profile (demo) |
| `/admin/*` `/super-admin/*` `*` | — | Not-found page |

\* Authenticated users visiting login/forgot/reset pages are redirected to their role dashboard.

## Authentication

- Cookie-based sessions; no tokens are stored in `localStorage`. `useAuth` polls `GET /auth/me` and reports `CHECKING` / `AUTHENTICATED` / `UNAUTHENTICATED`.
- `ProtectedRoute` shows a splash while checking, redirects unauthenticated users to `/login`, and sends role mismatches to `/unauthorized` (which currently falls through to the not-found page).
- Login, logout, forgot-password, and reset-password use TanStack Query mutations + sonner toasts. The reset page reads `?token=`, validates password + confirm, and treats a `400` response as an invalid/expired link so users can request a fresh one.

## Dataset & Visualization Flow

- **Submission (Admin, `/admin/datasets/new`):** a stepped form uploads a `.csv` (`POST /datasets/upload`), displays the server-detected schema and invalid-row messages, then collects visualization configuration — template (`LAT_LONG` / `STATE_WISE` / `TIME_SERIES`), chart type for time-series (line/bar/area), and column mappings (lat-long/value, state/value, x/value) with heuristic column suggestions (regex for date/year, numeric, state, coordinates). It previews the data and renders a live chart before submitting `POST /datasets` with the `fileKey`, schema, and visualization config. New datasets are created as `PENDING`.
- **Moderation (Super Admin):** dashboards, the dataset list, and detail pages offer Approve/Reject (with required reason on rejection) via `PATCH /datasets/:id/status`. Approval publishes automatically on the public site.
- **Public display:** `PublishedVisualizationCard` fetches an approved dataset via `GET /datasets/public/:id`, builds a generic `ChartData` model, and renders it through `VisualizationRenderer`, which dispatches on chart type — `LINE`/`BAR`/`AREA` to Recharts, `INDIA_MAP` to the zoomable/clickable map, `STATE_HEATMAP` to the state choropleth. The same renderer is reused for the admin chart preview, so nothing is hardcoded to sample datasets.

## Interaction Details

- **India map:** zoom in/out and pan, colored data points (grouped by category), click a point to see its dataset row information in a tooltip.
- **State heatmap:** state short-name labels, color scale on values, hover tooltips showing state + value; legend overlaid.
- **Charts:** shared Recharts tooltip formatting, axis labels from the visualization config.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `VITE_BASE_URL` | Backend API base URL including `/api/v1` (e.g. `http://localhost:4508/api/v1` or the deployed API URL) |

Set it in `.env` (`.env.sample` documents the key). It is baked into the client at dev/build time.

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

The backend must be running (see the backend README) and `VITE_BASE_URL` must point at its `/api/v1` base.

## Deployment

Deployed at [https://vasudha.saurabhkushwaha.in](https://vasudha.saurabhkushwaha.in). No static-host config (Netlify/Vercel) or Docker is committed; the production build is produced with `npm run build` and served from `dist/`. Point `VITE_BASE_URL` at the deployed API's `/api/v1` URL before building (the backend CORS allowlist includes this domain).

## Approach & What's Different

- **Generic visualization pipeline, not hardcoded:** datasets drive the renderer through `chartType`/`visualizationConfig`; the same `ChartData` builder powers both the admin's live preview and the public pages, so any CSV matching a template renders without new components.
- **Custom maps over a charting library:** the India map and state heatmap are hand-rolled SVG on `@svg-maps/india` paths — full control over labels, choropleth coloring, hover, pan, and zoom without a heavyweight map dependency.
- **Column-suggestion heuristics** auto-map CSV columns to lat/long, state, date, and value roles, reducing upload friction while keeping the admin in control.
- **Server-side validation surfaced in the UI:** the upload step reports the detected schema and the rows that failed validation up front, so the admin never submits a silently-broken dataset.
- **One shared card + renderer for public and admin** keeps preview identical to what gets published.
- **Cookie-based auth with transparent refresh** in the API client; no auth state in `localStorage`.