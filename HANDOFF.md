# Devnetic — Developer Handoff Document

> **Purpose:** This document exists so that anyone (the original author or another developer) can clone this repository and fully understand **how the app is built, how to run it, how to deploy it, and how it works** — without having to reverse-engineer the code.
>
> **Last verified against:** `main` = `development` @ `edddb11` (2026-09-28), deployed on Vercel and Render.
>
> **Stack at a glance:** React 19 (Vite 8) frontend + Express 5 / Mongoose 9 (MongoDB Atlas) backend. Frontend is set up for **Vercel**; backend ships a **Dockerfile**.

## 1. What Is Devnetic?

Devnetic is a **developer collaboration platform**. It lets developers:

- Create an account and a public developer profile (headline, bio, skills, links, availability).
- Browse a directory of fellow developers, filtering by skill and availability.
- Create and discover side-projects.
- View project details, comment on projects, send project invitations to other developers, and accept/reject invitations sent to themselves.
- Manage their own projects (edit / delete) and view a personal dashboard.

It is a single-page application: an authenticated, sidebar-driven "dashboard area" plus a marketing-style landing page whose header is auth-aware.

## 2. Repository Layout

This is a **monorepo** with two self-contained Node.js projects (each with its own `package.json` and dependencies):

```
Devnetic/
├── README.md                 # Minimal (just "# Devnetic"). See HANDOFF.md instead.
├── HANDOFF.md                # <-- This document.
├── .gitignore                # Root ignore: node_modules, .env / .env.* (except .env.example),
│                             #   dist/build, .vercel, .render, .docker, logs, OS/IDE files
│
├── client/                   # React frontend (Vite)
│   ├── package.json          # deps: react 19, react-router-dom 7, tailwindcss 4,
│   │                         #       lucide-react, react-hot-toast
│   ├── .env.example          # VITE_API_URL=http://localhost:3000
│   ├── vercel.json           # SPA rewrite: every path -> /index.html
│   ├── vite.config.js        # plugins: @vitejs/plugin-react, @tailwindcss/vite
│   ├── eslint.config.js      # flat config (js.recommended, react-hooks, react-refresh)
│   ├── index.html            # root HTML; favicon = /src/assets/Devnetic-favicon.jpeg; boots /src/main.jsx
│   ├── README.md             # Default Vite starter README (not app-specific; see HANDOFF.md instead).
│   ├── public/
│   │   └── icons.svg         # inline <symbol> SVG icons (github, discord, x, ...)
│   └── src/
│       ├── main.jsx          # createRoot(...) under <StrictMode>
│       ├── App.jsx           # <BrowserRouter> + <Routes> (the entire app's routing)
│       ├── App.css           # app-specific CSS vars & layout helpers
│       ├── index.css         # Tailwind base + @theme (primary color, fonts)
│       ├── config/
│       │   ├── api.js        # API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
│       │   └── availability.js # AVAILABILITY_OPTIONS + normalize/lookup helpers (see §8.5)
│       ├── assets/           # .webp hero/illustration images, logo PNGs, favicon JPEG
│       ├── components/       # Shared, reusable UI pieces
│       └── pages/            # One component per route
│
└── server/                   # Express backend API
    ├── package.json          # deps: express 5, mongoose 9, bcryptjs, jsonwebtoken,
    │                         #       cors, dotenv. Scripts: start, dev
    ├── .env.example          # PORT, MONGO_URI, JWT_SECRET, optional CLIENT_URL (template — copy to .env)
    ├── Dockerfile            # node:22-alpine, npm ci --omit=dev, CMD node src/server.js
    ├── .dockerignore         # excludes node_modules, .env*, .git, Dockerfile
    └── src/
        ├── server.js         # ENTRY: load dotenv -> connectDB() -> app.listen(PORT)
        ├── app.js            # Express app: cors (CLIENT_URL allow-list), express.json, routers, errorHandler
        ├── config/
        │   └── db.js         # mongoose.connect(process.env.MONGO_URI); exits(1) on failure
        ├── middleware/
        │   ├── auth.js       # JWT `protect` guard -> sets req.userId
        │   └── errorHandler.js# final ({ message }) error handler
        ├── utils/
        │   └── AppError.js   # class AppError extends Error { statusCode }
        ├── models/           # Mongoose schemas
        ├── controllers/      # Thin request handlers -> delegate to services
        ├── services/         # Business logic + DB access
        └── routes/           # Express routers
```

### Backend Architecture: Three Clean Layers

The server follows a deliberate separation so logic never lives in the route files:

1. **Routes** (`src/routes/*.routes.js`) — define the URL path, attach `protect` where auth is required, and call the matching controller. Routes contain **no** logic.
2. **Controllers** (`src/controllers/*.controller.js`) — extract `req.params`/`req.body`/`req.userId`, shape the payload, call a service, send the JSON response. Each handler is wrapped in `try { ... } catch (error) { next(error); }`. Controllers contain **almost no logic** (auth controllers also validate required fields).
3. **Services** (`src/services/*.service.js`) — where **all** database access, authorization checks (e.g. "is the requester the project owner?"), and business rules live.

**Error flow:** service throws `AppError(message, statusCode)` -> controller `catch` does `next(error)` -> the final `errorHandler` middleware (registered last in `app.js`) responds with `res.status(err.statusCode || 500).json({ message: err.message })`.

## 3. Quick Start (Running Locally)

### Prerequisites
- Node.js (>= 20; tested on v24. The Docker image uses Node 22).
- npm (tested on v11).
- A MongoDB Atlas cluster (or a local MongoDB) and its connection URI.
- `.env` files and `node_modules` are **not** in the repo — you create/install them (see below).

### 3.1 Start the Backend Server

```bash
cd server
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm install
npm run dev
# -> node --watch src/server.js
# Server starts on http://localhost:3000
```

`npm start` runs `node src/server.js` without file watching (used in production / Docker).

Environment variables (`server/.env`, template in `server/.env.example`):

| Variable      | Example / Purpose |
|---------------|-------------------|
| `PORT`        | `3000` (falls back to 3000 if unset) |
| `MONGO_URI`   | MongoDB Atlas connection string. If the connection fails the process exits with code 1. |
| `JWT_SECRET`  | Long random string used to sign/verify JWTs. |
| `CLIENT_URL`  | *Optional.* Comma-separated frontend origins allowed by CORS (trailing slashes are stripped). **Leave unset locally** — then every origin is allowed. Set on Render to `https://devnetic.vercel.app`. |

> The local `server/.env` currently points at the same `devnetic` Atlas database that production uses, so anything created or deleted while testing locally changes live data.

### 3.2 Start the Frontend Dev Server

```bash
cd client
cp .env.example .env   # optional — defaults to http://localhost:3000 if unset
npm install
npm run dev
# -> http://localhost:5173  (default Vite port)
```

Environment variables (`client/.env`, template in `client/.env.example`):

| Variable       | Purpose |
|----------------|---------|
| `VITE_API_URL` | Backend base URL. Read once in `src/config/api.js`; falls back to `http://localhost:3000`. Baked in at **build time** (Vite `import.meta.env`). |

### 3.3 Linting / Building (Frontend)

```bash
cd client
npm run lint           # eslint .
npm run build          # production bundle -> client/dist
npm run preview        # serve the built bundle locally
```

## 4. Deployment

Split deployment: static frontend on **Vercel**, backend as a **Docker** web service on **Render**.

**Branch workflow:** `main` is the deployed branch (Vercel + Render build from it). Do day-to-day work on `development`, test locally, then merge into `main` to release.

### 4.1 Frontend (Vercel)
- Production URL: `https://devnetic.vercel.app`. `VITE_API_URL` on Vercel (Production + Preview) = `https://devnetic.onrender.com`.
- Project root: `client/`. Build command `npm run build`, output `dist`.
- `client/vercel.json` rewrites every path (`/(.*)`) to `/index.html` so deep links like `/projects/123` work with client-side routing.
- Set `VITE_API_URL` in the Vercel project's environment variables to the deployed backend URL **before building** (it is inlined at build time).

### 4.2 Backend (Render, Docker)

Render service settings (as configured on 2026-09-28):

| Setting | Value |
|---------|-------|
| Service | `Devnetic` web service, Docker runtime, Free instance, Oregon (US West) |
| URL | `https://devnetic.onrender.com` |
| Source / branch | `Mohammad-Hamza-Temuri/Devnetic`, branch `main` |
| Root Directory | `server` (Dockerfile `server/Dockerfile`, build context `server/`) |
| Auto-Deploy | On Commit — but **only commits that change files under `server/`** trigger a deploy (a Root Directory rule). Client-only or docs-only commits don't redeploy the backend. |
| Environment | `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL=https://devnetic.vercel.app` (`PORT` is provided by Render — the log shows 10000) |
| Health Check Path | not set |

If a backend change doesn't deploy by itself after merging to `main`, use **Manual Deploy → Deploy latest commit**. Render's GitHub App access to the repo was only granted on 2026-09-28 (earlier deploy logs warned "we don't have access to your repo"), and automatic deploys haven't been confirmed yet. The next `server/` change will show whether they work.

To build and run the same image locally:

```bash
cd server
docker build -t devnetic-server .
docker run -p 3000:3000 \
  -e MONGO_URI="..." -e JWT_SECRET="..." -e PORT=3000 \
  devnetic-server
```
- The image is `node:22-alpine`, installs production deps only (`npm ci --omit=dev`), exposes port 3000, and runs `node src/server.js`.
- `.dockerignore` excludes `.env*`, so secrets must be passed as runtime environment variables, not baked into the image.
- **CORS:** `CLIENT_URL=https://devnetic.vercel.app` is set in Render's environment. Without it the API accepts requests from any origin. With it, only the listed origins get CORS headers — Vercel **preview** deployments (`*.vercel.app` per-branch URLs) are then blocked unless you add their URLs to the comma-separated list.

## 5. Authentication & Authorization

### Backend
- `/auth/signup` — creates a `User` (`{ name, email, password }`). Password is **bcrypt-hashed (cost 10)** via a Mongoose `pre("save")` hook on the `User` schema. Duplicate emails (MongoDB error code `11000`) -> `"Email already in use"` (400).
- `/auth/login` — looks up the user by email, `bcrypt.compare`s the password, and returns `{ token, user: { id, name, email } }`. The JWT is signed with `{ id: user._id }` and **expires in 7 days** (`{ expiresIn: "7d" }`).
- `protect` middleware (`src/middleware/auth.js`) reads the `Authorization: Bearer <token>` header, verifies it against `JWT_SECRET`, and sets `req.userId = decoded.id`. Missing/invalid token -> `AppError("Not authorized...", 401)`.

### Frontend
- On login, `Login.jsx` stores **`token`**, **`userId`**, and **`userName`** in `localStorage`, then navigates to `?redirect=` (if present) or `/dashboard`.
- `ProtectedRoute.jsx` (a wrapper component, **not** a route) checks `localStorage.getItem("token")` and redirects to `/login` if absent. It wraps the dashboard-area layout.
- The stored token string is attached to fetch requests as `Authorization: Bearer ${token}`.
- Logout exists in two places — the dashboard `Sidebar` and the landing-page `Header` user menu. Both remove **all three** keys (`token`, `userId`, `userName`) and navigate to `/login`.
- The landing `Header` treats the user as logged in when both `token` and `userName` exist in `localStorage` (no server check).

## 6. Backend API Reference

All routes are mounted in `src/app.js`. Base URL (local): `http://localhost:3000`.

### 6.1 Auth — `/auth` (public)

| Method | Path | Body | Success -> | Errors |
|--------|------|------|------------|--------|
| POST | `/auth/signup` | `{ name, email, password }` | `201 { id, name, email }` | 400 missing fields; 400 email in use |
| POST | `/auth/login` | `{ email, password }` | `200 { token, user { id, name, email } }` | 400 missing fields; 401 invalid credentials |

### 6.2 Profile — `/profile`

| Method | Path | Auth | Query / Body | Success -> |
|--------|------|------|--------------|------------|
| POST | `/profile` | yes | `{ headline, bio, location, yearsOfExperience, skills[], githubUrl, portfolioUrl, linkedInUrl, availability }` (owner = `req.userId`) | `201 { devProfile }`; `409` if the user already has a profile |
| GET | `/profile` | no | `?search` (case-insensitive regex on headline), `?skills` (string\|array, `$in` match), `?availability` (case-insensitive; `not-available` also matches legacy `unavailable`), `?page` (1), `?limit` (10) | `200 [ profiles ]` |
| GET | `/profile/:id` | no | path param `id` = **user** id | `200 { profile }`; `404 "Profile not found"` if the user has no profile yet |
| PUT | `/profile` | yes | Same fields as POST; `req.userId` identifies the profile. | `200 { updated profile }`; 404 if no profile exists yet |

> The frontend picks POST vs PUT automatically (see §8.4 Profile).
>
> **Availability** is normalized on create/update (trimmed, lower-cased, `unavailable` -> `not-available`). Canonical values: `available`, `busy`, `not-available`. The model itself has no enum, because older documents still hold `Available` / `unavailable`.

### 6.3 Projects — `/projects`

| Method | Path | Auth | Body (summary) | Success -> | Ownership |
|--------|------|------|----------------|------------|-----------|
| POST | `/projects` | yes | `{ title, description, category, requiredSkills[], techStack[], startDate, endDate, repositoryUrl }` (owner = `req.userId`) | `201 { project }` | — (create) |
| GET | `/projects` | no | — | `200 [ projects ]` (sorted newest-first, owner populated) | |
| GET | `/projects/:id` | no | path param `id` | `200 { project }` (owner populated); 404 if missing; 500 for a malformed id (Mongoose CastError) | |
| PUT | `/projects/:id` | yes | Same fields as POST | `200 { project }` | must be owner (403) |
| DELETE | `/projects/:id` | yes | — | `204`; also deletes the project's members, invitations and comments | must be owner (403) |
| GET | `/projects/:id/members` | no | path param `id` | `200 [ members ]` (user populated, password excluded) | |

- On project creation, a matching `ProjectMember` record (`role: "owner"`) is **automatically created**.
- `GET /projects` sorts by `createdAt: -1`.
- `status` and `visibility` exist on the model but are **not** settable through the API (always defaults).

### 6.4 Invitations — `/invitations` (all protected)

| Method | Path | Body | Behavior |
|--------|------|------|----------|
| POST | `/invitations/:id` | `{ invitedUserId }` (string user id; `:id` = projectId) | Project owner (`project.owner === req.userId`) creates an invitation with `status: "pending"`. Errors: 400 missing/invalid `invitedUserId`; 404 project; 403 not owner; 400 inviting yourself; 409 already a member; 409 pending invitation already exists. |
| PUT | `/invitations/:id/respond` | `{ status }` ("accepted"\|"rejected") | The **invited user** (`invitation.invitedUser === req.userId`) responds. Errors: 400 invalid status; 404; 403 wrong user; 409 already responded. On "accepted", a `ProjectMember` (`role: "contributor"`) is created unless one already exists. |
| GET | `/invitations/me` | — | Returns the caller's `pending` invitations with `project` populated (`title category`) and `invitedBy` populated (`name`). |

### 6.5 Comments — `/comments`

| Method | Path | Auth | Body | Behavior |
|--------|------|------|------|----------|
| POST | `/comments/:id` | yes | `{ text }` (`:id` = projectId) | Creates a comment on the project (404 if project missing). `201 { comment }` |
| GET | `/comments/:id` | no | — | Lists comments for the project (user populated, password excluded). |
| DELETE | `/comments/:commentId` | yes | — | Only the **comment author** can delete it (403 otherwise). `204` |

### 6.6 Tasks — `/tasks` (all protected)

| Method | Path | Body | Notes |
|--------|------|------|-------|
| GET | `/tasks` | — | Returns all tasks. |
| GET | `/tasks/:id` | — | Returns one task. |
| POST | `/tasks` | `{ title, description }` | Both fields required. |
| PUT | `/tasks/:id` | `{ title, description }` | Both required. |
| DELETE | `/tasks/:id` | — | `204` |

> 💡 Tasks are a standalone resource — **not** linked to projects or users in the model, nor surfaced in the frontend UI.

## 7. Data Models (Mongoose)

| Model | File | Fields |
|-------|------|--------|
| **User** | `server/src/models/User.js` | `name: String (req)`, `email: String (req, unique)`, `password: String (req, hashed)`. Has a `pre("save")` hook that bcrypt-hashes the password if modified. |
| **DeveloperProfile** | `server/src/models/DeveloperProfile.js` | `user: ObjectId -> User (req)`, `headline`, `bio`, `location`, `yearsOfExperience: Number`, `skills: [String]`, `githubUrl`, `portfolioUrl`, `linkedInUrl`, `availability: String` (no enum; normalized by the service). One per user — enforced in `createProfileService`, not by a unique index. |
| **Project** | `server/src/models/Project.js` | `owner: ObjectId -> User (req)`, `title (req)`, `description (req)`, `category (req)`, `requiredSkills: [String]`, `techStack: [String]`, `startDate/endDate: Date`, `repositoryUrl`, `status: ["active","completed","archived"] (def "active")`, `visibility: ["public","private"] (def "public")`. **Has `timestamps` -> `createdAt`/`updatedAt`.** |
| **ProjectMember** | `server/src/models/ProjectMember.js` | `project: ObjectId -> Project (req)`, `user: ObjectId -> User (req)`, `role: ["owner","contributor"] (def "contributor")`. Project membership join table. |
| **ProjectInvitation** | `server/src/models/ProjectInvitation.js` | Model name `Invitation`. `project: ObjectId -> Project (req)`, `invitedUser: ObjectId -> User (req)`, `invitedBy: ObjectId -> User (req)`, `status: ["pending","accepted","rejected"] (def "pending")`. |
| **Comment** | `server/src/models/Comment.js` | Model name `Comments`. `project: ObjectId -> Project (req)`, `user: ObjectId -> User (req)`, `text: String (req)`. No timestamps. |
| **Task** | `server/src/models/Task.js` | `title: String (req)`, `description: String (req)`. Simple standalone task. |

### Population strategy (for predictable responses)
- `Profile` docs populate `user` with `"name email"`.
- `Project` docs populate `owner` with `"name email"`.
- `ProjectMember` & `Comment` docs populate `user` with `"-password"` (strips the hash).
- `getMyInvitationService` populates `project` with `"title category"` and `invitedBy` with `"name"`.

## 8. Frontend Deep Dive

### 8.1 Routing (`src/App.jsx`)

Routing is centralised in one `<Routes>` tree. Unauthenticated pages (`/`, `/login`, `/signup`) render directly. Everything else is wrapped in:

```jsx
<Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
  ...dashboard-area child routes...
</Route>
```

`ProtectedRoute` checks `localStorage.token` (redirect to `/login` if missing).
`DashboardLayout` renders the `Sidebar` + a `<main>` with an `<Outlet />`.

| Route | Page | Auth | Purpose |
|-------|------|------|---------|
| `/` | `Landing` | public | Marketing page (Header, Hero, WhatIsDevnetic, HowItWorks, Collaboration, FinalCTA, Footer) |
| `/login` | `Login` | public | Sign in; supports `?redirect=/...` for post-login navigation |
| `/signup` | `Signup` | public | Register -> navigate to `/login` |
| `/dashboard` | `Dashboard` | auth | Summary: profile card (or "Create Profile" CTA), invitations count, recent 4 projects |
| `/profile` | `Profile` | auth | Create **or** edit your developer profile |
| `/projects` | `Projects` | auth | Grid list of all projects |
| `/projects/:id` | `SingleProject` | auth | Project detail (status, owner actions, comments) |
| `/projects/new` | `CreateProject` | auth | Create form |
| `/projects/:id/edit` | `EditProject` | auth | Edit form (owner only, enforced server-side) |
| `/invitations` | `Invitations` | auth | List + Accept/Reject invitations |
| `/developers` | `Developers` | auth | Directory with search, skill + availability filters |
| `/developers/:userId` | `DeveloperProfile` | auth | Public view of a developer ("Developer profile not found" fallback) |
| `*` | `NotFound` | public | 404 page with "Back to Home" (+ "Go to Dashboard" when logged in) |

### 8.2 API Base URL (`src/config/api.js`)

```js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export default API_URL;
```

Every page/component that talks to the backend imports this and builds URLs as `` `${API_URL}/projects` ``. There is still no shared fetch wrapper — each call sets its own headers/token and parses JSON itself.

### 8.3 Shared Components (`src/components/`)

| Component | File | Responsibility |
|-----------|------|----------------|
| `ProtectedRoute` | `ProtectedRoute.jsx` | Auth-gate wrapper for routes. |
| `DashboardLayout` | `DashboardLayout.jsx` | Mobile top bar (hamburger menu button, fixed `z-30`, `lg:hidden`) hosting the slide-in `Sidebar`; responsive `<main>` (`lg:ml-64 pt-14 lg:pt-0`) wrapping `<Outlet />`. |
| `Sidebar` | `Sidebar.jsx` | Off-canvas slide-in sidebar driven by `isOpen`/`onClose` props: backdrop overlay + X close button on mobile (`lg:hidden`), always-anchored on desktop (`lg:translate-x-0`). Active-link highlighting via `useLocation`, logo image (`Devnetic Logo.png`), nav links (Dashboard, My Profile, Projects, Developers, Invitations). Bottom section: **"Back to Home"** link (`/`) + Logout (clears `token`, `userId`, `userName`). `bg-[#00000B]` dark theme. |
| `Header` | `Header.jsx` | **Auth-aware** landing-page nav (logo `Devnetic-Logo-Transparent.png`). Logged out: How It Works, Explore Projects (`/login?redirect=/projects`), Login, Sign Up. Logged in (desktop): avatar-initial + name pill opening a dropdown (Dashboard, My Profile, Projects, Logout) that closes on outside click. Mobile: hamburger opens a right-side slide-in drawer with backdrop — shows a user card + dashboard links + Logout when logged in, or a "Get started" Login/Sign Up block when logged out. Drawer auto-closes when resized to ≥1024px. |
| `Footer` | `Footer.jsx` | Landing-page footer with links (Explore Projects / Developers go through `/login?redirect=...`). |
| `Hero` | `Hero.jsx` | Hero section w/ CTA buttons. |
| `HowItWorks` | `HowItWorks.jsx` | 3-step process (anchor `#how-it-works`). |
| `WhatIsDevnetic` | `WhatIsDevnetic.jsx` | About section w/ illustration. |
| `FinalCTA` | `FinalCTA.jsx` | Final call-to-action. |
| `Collaboration` | `Collaboration.jsx` | "Don't build alone" community visual. |
| `InviteModal` | `InviteModal.jsx` | Overlay modal: debounced (500ms) search of profiles by headline; results show name, headline, availability label; clicking sends `profile.user._id` as `invitedUserId`. Server errors (already a member, pending invite, etc.) show as toasts. |
| `SkillMultiSelect` | `SkillMultiSelect.jsx` | Reusable multi-select dropdown (hardcoded `SKILL_OPTIONS`; click-outside closes). Used by the Developers filter. |

### 8.4 Frontend <-> Backend Data Flow (key pages)
- **Dashboard** — "Welcome back, {userName}". `GET /profile/:userId` (from `localStorage.userId`): on success shows a profile card (headline, skill badges, availability, "Edit Profile" link); on any non-OK response (e.g. 404 for a brand-new user) shows a **"You haven't created your developer profile yet" card with a "Create Profile" button** linking to `/profile`. `GET /projects` -> newest 4 projects as cards (title, category, owner avatar initial + "Posted by {name}") linking to `/projects/:id`, plus a "+ Create Project" button. `GET /invitations/me` -> pending-invitation count with a "View All" link. All three fetches are wrapped in try/catch and check `res.ok`, so the page never crashes on missing data.
- **Profile (create/edit)** — On load, `GET /profile/:userId`. A **404 means "no profile yet"**: the form stays empty, the button reads **"Create Profile"**, and submit sends **`POST /profile`**. If a profile exists, fields are pre-filled, the button reads "Save Changes", and submit sends **`PUT /profile`**. After a successful create the page flips into edit mode. Shows a "Loading profile..." state and `react-hot-toast` success/error feedback. Skills are a comma-separated text input (split into an array client-side); availability is a `<select>` built from `AVAILABILITY_OPTIONS`, and legacy stored values are normalized when the form loads.
- **Developers** — `GET /profile?search=...&skills=...&availability=...` debounced 500ms; the `SkillMultiSelect` controls the `skills` array. Desktop shows a sticky right-side filter panel (`lg:sticky`); mobile toggles a slide-up `FilterModal` (backdrop + handle-bar, "Apply Filters" button). Filters: free-text search, multi-skill selection, Available / Busy / Not Available checkboxes (single choice, rendered by an `AvailabilityCheckboxes` helper shared by desktop and mobile), and "Clear All". Result cards display developer name, headline, location, experience, a color-coded availability badge (green / amber / red), up-to-5 skills (+ "N more"), and social links (GitHub / Portfolio / LinkedIn); empty state "No developers found matching your criteria."
- **Projects / Create / Edit** — `GET /projects` grid list (title, category, owner avatar initial + "Posted by {name}", tech-stack tags); empty state "No projects yet." `CreateProject`/`EditProject` split comma-separated `requiredSkills`/`techStack` into arrays client-side; `EditProject` enforces a 1500-char description limit (live counter) and flashes `react-hot-toast` success/error feedback.
- **Invitations** — `GET /invitations/me` lists pending invitations showing the project title (linked to `/projects/:id`), "Invited by {name}", or "Project no longer exists"; load errors show a toast. Accept/Reject -> `PUT /invitations/:id/respond`, then removes the item from the list.
- **DeveloperProfile (/developers/:userId)** — `GET /profile/:userId`; loading state, and a "Developer profile not found" card with a link back to `/developers` on any non-OK response.
- **SingleProject (/projects/:id)** — full project detail page: loading spinner; "Project not found" fallback for any non-OK response (404 or malformed id); back button; color-coded status badge (`active`/`completed`/`archived` with emoji icons); owner-only (`project.owner._id === localStorage.userId`) desktop actions (Invite / Edit / Delete buttons) plus a mobile-only `MoreVertical` kebab dropdown with the same actions; title, creation date, category badge, "Posted by" owner (avatar + name); description panel; tech-stack tags; required-skills tags; repository link button (opens in new tab); and a full comment UI.
- **SingleProject -> Comments** — `GET /comments/:projectId` list (author avatar initial, name, date, text); post via `POST /comments/:projectId` with `{ text }` (Bearer token; toast feedback; list is re-fetched afterwards to get populated user data); delete via `DELETE /comments/:commentId` (author-only, confirm dialog, optimistic removal).
- **SingleProject -> InviteModal** — modal calls `GET /profile?search=...` (debounced 500ms) and `POST /invitations/:projectId` with `{ invitedUserId }`; shows a toast on success and closes the modal.

### 8.5 Availability Values (`src/config/availability.js`)

| Value | Label | Badge |
|-------|-------|-------|
| `available` | Available | green |
| `busy` | Busy | amber |
| `not-available` | Not Available | red |

`normalizeAvailability()` lower-cases/trims and maps legacy `unavailable` -> `not-available`; `getAvailabilityOption()` returns the option (label + badge class) for any stored value. Used by `Profile`, `Developers`, `DeveloperProfile`, `Dashboard` and `InviteModal`. The server mirrors the same normalization in `profile.service.js` — keep the two in sync.

### 8.6 Styling & Tooling
- **Tailwind CSS v4** — configured purely via `index.css` (`@import "tailwindcss"; @theme { --color-primary: #3C5CF6; --color-primary-dark: #4F41F5; ... }`). No separate `tailwind.config.js`. `primary` / `primary-dark` are used for buttons, links, badges, and focus rings (the Profile form still uses stock `blue-600` classes).
- **Fonts**: Lato (regular + bold) via Google Fonts, imported in `index.html`.
- **Favicon**: `src/assets/Devnetic-favicon.jpeg`, referenced from `index.html` (Vite processes it at build time).
- **Icons**: `lucide-react` (imported as components). Static SVG social icons live in `public/icons.svg` as `<symbol>`s.
- **Toasts**: `react-hot-toast`; a single `<Toaster position="top-right" />` is declared in `App.jsx`.
- **Build**: Vite 8. `npm run dev` -> Vite dev server (HMR). `npm run build` -> production bundle. `npm run lint` -> ESLint flat config.
- **No state manager**: state is plain `useState`/`useEffect`; there is no Redux/Zustand/Context beyond the router. Auth state is read straight from `localStorage`.

## 9. Gotchas & Known Limitations

| Area | Detail |
|------|--------|
| Legacy data (as of 2026-09-28) | Live data still holds older availability values (`Available`, `unavailable`); the code normalizes them, so no migration is required, but a one-time update to canonical values would allow adding a model enum. The `projectmembers` collection also has 1 duplicate (same project + user) and 1 row pointing at an already-deleted project — created before the duplicate guard / cascade delete existed. Clean up by hand if desired. |
| No unique indexes | Duplicate profiles, pending invitations and members are prevented in the service layer, not by MongoDB unique indexes, so two simultaneous requests could still race. Add indexes (e.g. `{ user: 1 }` on profiles, `{ project: 1, user: 1 }` on members) after cleaning up the duplicate above. |
| Malformed ids | A malformed ObjectId in a URL (e.g. `/projects/abc`) raises a Mongoose CastError -> `500` instead of `400`/`404`. The frontend treats it as "not found". |
| Tasks | Backend CRUD for tasks exists (`/tasks`) but **no task UI**, and tasks aren't linked to projects or users. |
| Auth storage | JWT lives in `localStorage` (no refresh-token flow, no httpOnly cookie). The client never re-validates the token; an expired token keeps the UI "logged in" until a protected API call returns 401. There's no shared fetch wrapper to handle 401s globally. |
| CORS | Controlled by `CLIENT_URL` (see §4.2), currently set to `https://devnetic.vercel.app`. Vercel preview URLs must be added explicitly if you want previews to reach the API. |
| Render free instance | Free Render services sleep when idle, so the first request after a quiet period can take ~a minute while the backend wakes up. |
| Test accounts in live DB | Local testing on 2026-09-28 used the production database and left two test users with profiles ("Test Owner" and "Test Invitee"). There's no API to delete users/profiles; remove them directly in MongoDB Atlas if unwanted. |
| Env vars at build time | `VITE_API_URL` is inlined when the client is built — changing it on Vercel requires a redeploy. |
| Secrets | `.env` files are git-ignored (root, `server/.gitignore`, and `.dockerignore`). Use the `.env.example` templates; pass real values via the host's env settings. |
| Deprecated icons | `lucide-react`'s `Github` / `Linkedin` brand icons are deprecated (editor warnings only; they still render). |

## 10. Development Checklist (on clone / first run)

```bash
# 1. Server
cd server
cp .env.example .env   # fill in MONGO_URI + JWT_SECRET
npm install
npm run dev            # -> http://localhost:3000

# 2. Client
cd ../client
cp .env.example .env   # optional; defaults to http://localhost:3000
npm install
npm run dev            # -> http://localhost:5173
```

Useful sanity checks after starting both servers:

```bash
curl http://localhost:3000/projects          # -> JSON array (possibly empty)
# Then open http://localhost:5173 in a browser.
```

A full manual smoke test:
1. `/signup` with a new email, then `/login` -> `token`, `userId`, `userName` stored.
2. Visit `/dashboard` -> shows the "You haven't created your developer profile yet" card + "No pending invitations."
3. Click **Create Profile** -> fill headline/skills/availability -> **Create Profile** -> toast "Profile created successfully!"; button switches to "Save Changes". Edit and save again -> "Profile updated successfully!".
4. `/projects/new` -> create a project -> verify on `/projects` and `/projects/:id`.
5. `/developers` -> search/filter the directory; each of Available / Busy / Not Available returns matching profiles with a green / amber / red badge.
6. (As project owner) open project -> **Invite Developer** -> pick someone -> `/invitations` on their side shows the project title and "Invited by {you}" -> Accept -> project membership created. Inviting the same person again -> "already a member" toast.
7. On a project detail page, post a comment -> verify it appears; delete your own comment (Trash icon) -> verify it's removed.
8. Click **Back to Home** in the sidebar -> landing header shows your avatar/name menu instead of Login/Sign Up; Logout from there -> header reverts.
9. Visit `/projects/000000000000000000000000`, `/developers/000000000000000000000000` and `/does-not-exist` -> "Project not found", "Developer profile not found" and the 404 page respectively.
10. (As owner) delete a project that has comments/invitations -> they no longer appear anywhere.

## 11. File Manifest (every source file)

### Root
- `.gitignore`, `README.md`, `HANDOFF.md`

### Client
- `client/package.json`, `client/.env.example`, `client/.gitignore`, `client/vercel.json`, `client/vite.config.js`, `client/eslint.config.js`, `client/index.html`, `client/README.md`
- `client/src/main.jsx`, `client/src/App.jsx`, `client/src/App.css`, `client/src/index.css`
- `client/src/config/` — `api.js`, `availability.js`
- `client/src/components/` — `ProtectedRoute.jsx`, `DashboardLayout.jsx`, `Sidebar.jsx`, `Header.jsx`, `Footer.jsx`, `Hero.jsx`, `HowItWorks.jsx`, `WhatIsDevnetic.jsx`, `FinalCTA.jsx`, `Collaboration.jsx`, `InviteModal.jsx`, `SkillMultiSelect.jsx`
- `client/src/pages/` — `Dashboard.jsx`, `Profile.jsx`, `Projects.jsx`, `SingleProject.jsx`, `CreateProject.jsx`, `EditProject.jsx`, `Invitations.jsx`, `Developers.jsx`, `DeveloperProfile.jsx`, `Landing.jsx`, `Login.jsx`, `Signup.jsx`, `NotFound.jsx`
- `client/src/assets/` — `Devnetic Logo.png`, `Devnetic-Logo-Transparent.png`, `Devnetic-favicon.jpeg`, `Devnetic-login-signup-page.webp`, `Hero-design-1.webp`, `Hero-design-2.webp`, `about devnetic.webp`
- `client/public/` — `icons.svg`

### Server
- `server/package.json`, `server/.env.example`, `server/.gitignore`, `server/Dockerfile`, `server/.dockerignore`
- `server/src/server.js`, `server/src/app.js`
- `server/src/config/db.js`
- `server/src/middleware/` — `auth.js`, `errorHandler.js`
- `server/src/utils/` — `AppError.js`
- `server/src/models/` — `User.js`, `DeveloperProfile.js`, `Project.js`, `ProjectMember.js`, `ProjectInvitation.js`, `Comment.js`, `Task.js`
- `server/src/controllers/` — `auth.controller.js`, `profile.controller.js`, `project.controller.js`, `invitation.controller.js`, `comment.controller.js`, `task.controller.js`
- `server/src/services/` — `login.service.js`, `signup.service.js`, `profile.service.js`, `project.service.js`, `invitation.service.js`, `comment.service.js`, `task.service.js`
- `server/src/routes/` — `auth.routes.js`, `profile.routes.js`, `project.routes.js`, `invitation.routes.js`, `comment.routes.js`, `task.routes.js`

## 12. Change Log (since previous handoff revision at `59338fb`)

| Commit | Change |
|--------|--------|
| `f08a51c` | Auth-aware landing `Header` (user dropdown, mobile drawer); "Back to Home" link in `Sidebar`; logout now clears `userId`/`userName` too. |
| `a7d3bf8` | Root `.gitignore` (ignores all `.env*` except `.env.example`). |
| `d5ae2ed` | Centralized API URL in `client/src/config/api.js` driven by `VITE_API_URL`; removed every hardcoded `http://localhost:3000`. |
| `5849db4`, `217397c` | `client/.env.example` and `server/.env.example`. |
| `1a032ce` | `server/Dockerfile` + `server/.dockerignore`. |
| `2f20707` | `client/vercel.json` SPA rewrite. |
| `a29cb58` | New users can create a profile: `Profile.jsx` POSTs when none exists, PUTs otherwise; `Dashboard.jsx` shows a "Create Profile" card instead of breaking when no profile exists. |
| `6138641` | Devnetic favicon (`Devnetic-favicon.jpeg`). |

### Fixes merged on 2026-09-28 (`1298266`…`c010d0b`, plus empty commit `edddb11`)

| Area | Change |
|------|--------|
| Availability | Shared `client/src/config/availability.js` (`available` / `busy` / `not-available`); Developers filter gains "Busy"; color-coded badges everywhere; server normalizes on write and filters case-insensitively, treating legacy `unavailable` as `not-available`. |
| Error handling | `SingleProject` checks `res.ok` (no more crash on bad ids); `DeveloperProfile` gets loading + "not found" states; new `NotFound` page on a `*` route. |
| Invitations | `/invitations/me` populates project title + inviter; `Invitations.jsx` shows them. Invites validate `invitedUserId`, block self-invites, existing members and duplicate pending invites; responding validates status and rejects already-answered invites; accepting never duplicates a member. `InviteModal` sends the user id (was the whole user object) and shows names. |
| Data integrity | `POST /profile` returns 409 if a profile exists; deleting a project also deletes its members, invitations and comments. |
| CORS | `CLIENT_URL` allow-list in `app.js` (all origins allowed when unset); documented in `server/.env.example`. |
| Cleanup | Removed stray `;;` in `project.service.js` and the unused `client/public/favicon.svg`. |

## 13. Summary

Devnetic is a complete, runnable **MVP of a developer collaboration platform** built on **React 19 + Vite + Tailwind CSS** on the frontend and **Express 5 + Mongoose 9 + MongoDB Atlas** on the backend. The backend enforces a clean routes -> controllers -> services split with centralised error handling and JWT auth; the frontend is a single `react-router-dom` v7 tree with a protected dashboard area, an auth-aware landing page, responsive Tailwind styling, debounced search/filtering, optimistic UI updates, and toast notifications. It supports the full project lifecycle (create / view / edit / delete), developer profiles (including first-time profile creation), an invite/respond collaboration flow, and project comments. The API base URL is now environment-driven, and the repo is deployment-ready: static client on Vercel (SPA rewrites) and a Dockerized API server, with secrets kept out of git via `.env.example` templates. A standalone `/tasks` API exists but isn't exposed in the UI. The remaining open issues are listed in §9: mainly the lack of unique indexes, a little legacy data cleanup, and the lack of token-expiry handling on the client.
