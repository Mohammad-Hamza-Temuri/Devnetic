# Devnetic — Developer Handoff Document

> **Purpose:** This document exists so that anyone (the original author or another developer) can clone this repository and fully understand **how the app is built, how to run it, and how it works** — without having to reverse-engineer the code.
>
> **Last verified against:** commit `59338fb` on branch `main`.
>
> **Stack at a glance:** React 19 (Vite) frontend + Express 5 / Mongoose 9 (MongoDB Atlas) backend.

## 1. What Is Devnetic?

Devnetic is a **developer collaboration platform**. It lets developers:

- Create an account and a public developer profile (headline, bio, skills, links, availability).
- Browse a directory of fellow developers, filtering by skill and availability.
- Create and discover side-projects.
- View project details, send project invitations to other developers, and accept/reject invitations sent to themselves.
- Manage their own projects (edit / delete) and view a personal dashboard.

It is a single-page application: an authenticated, sidebar-driven "dashboard area" plus a marketing-style landing page.

## 2. Repository Layout

This is a **monorepo** with two self-contained Node.js projects (each with its own `package.json` and dependencies):

```
Devnetic/
├── README.md                 # Minimal (just "# Devnetic"). See HANDOFF.md instead.
├── HANDOFF.md                # <-- This document.
│
├── client/                   # React frontend (Vite)
│   ├── package.json          # deps: react 19, react-router-dom 7, tailwindcss 4,
│   │                         #       lucide-react, react-hot-toast
│   ├── vite.config.js        # plugins: @vitejs/plugin-react, @tailwindcss/vite
│   ├── eslint.config.js      # flat config (js.recommended, react-hooks, react-refresh)
│   ├── index.html            # root HTML; boots /src/main.jsx
│   ├── README.md            # Default Vite starter README (not app-specific; see HANDOFF.md instead).
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg         # inline <symbol> SVG icons (github, discord, x, ...)
│   └── src/
│       ├── main.jsx          # createRoot(...) under <StrictMode>
│       ├── App.jsx           # <BrowserRouter> + <Routes> (the entire app's routing)
│       ├── App.css           # app-specific CSS vars & layout helpers
│       ├── index.css         # Tailwind base + @theme (primary color, fonts)
│       ├── assets/           # .webp hero/illustration images + logo PNGs
│       ├── components/       # Shared, reusable UI pieces
│       └── pages/            # One component per route
│
└── server/                   # Express backend API
    ├── package.json          # deps: express 5, mongoose 9, bcryptjs, jsonwebtoken,
    │                         #       cors, dotenv
    ├── .env                  # PORT, MONGO_URI (MongoDB Atlas), JWT_SECRET
    └── src/
        ├── server.js         # ENTRY: load dotenv -> connectDB() -> app.listen(PORT)
        ├── app.js            # Express app: cors, express.json, routers, errorHandler
        ├── config/
        │   └── db.js         # mongoose.connect(process.env.MONGO_URI)
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
2. **Controllers** (`src/controllers/*.controller.js`) — extract `req.params`/`req.body`/`req.userId`, shape the payload, call a service, send the JSON response. Each handler is wrapped in `try { ... } catch (error) { next(error); }`. Controllers contain **almost no logic**.
3. **Services** (`src/services/*.service.js`) — where **all** database access, authorization checks (e.g. "is the requester the project owner?"), and business rules live.

**Error flow:** service throws `AppError(message, statusCode)` -> controller `catch` does `next(error)` -> the final `errorHandler` middleware (registered last in `app.js`) responds with `res.status(err.statusCode || 500).json({ message: err.message })`.

## 3. Quick Start (Running Locally)

### Prerequisites
- Node.js (>= 20; tested on v24).
- npm (tested on v11).
- A MongoDB Atlas cluster (or a local MongoDB) and its connection URI.
- The repo ships `.env` and (usually) `node_modules` for both layers.

### 3.1 Start the Backend Server

```bash
cd server
npm install            # only if node_modules is missing
npm run dev
# -> node --watch src/server.js
# Server starts on http://localhost:3000
```

Environment variables used (see `server/.env`):

| Variable      | Example / Purpose |
|---------------|-------------------|
| `PORT`        | `3000`            |
| `MONGO_URI`   | MongoDB Atlas connection string (includes `?ssl=true&replicaSet=...`). |
| `JWT_SECRET`  | Secret used to sign/verify JWTs. **Change in production!** |

> ⚠️ `JWT_SECRET` is currently a placeholder (`pick_any_long_random_string_here`). Rotate it before any real deployment.

### 3.2 Start the Frontend Dev Server

```bash
cd client
npm install            # only if node_modules is missing
npm run dev
# -> http://localhost:5173  (default Vite port)
```

### 3.3 Linting (Frontend)

```bash
cd client
npm run lint           # eslint .
```

## 4. Authentication & Authorization

### Backend
- `/auth/signup` — creates a `User` (`{ name, email, password }`). Password is **bcrypt-hashed (cost 10)** via a Mongoose `pre("save")` hook on the `User` schema. Duplicate emails (MongoDB error code `11000`) -> `"Email already in use"` (400).
- `/auth/login` — looks up the user by email, `bcrypt.compare`s the password, and returns `{ token, user: { id, name, email } }`. The JWT is signed with `{ id: user._id }` and **expires in 7 days** (`{ expiresIn: "7d" }`).
- `protect` middleware (`src/middleware/auth.js`) reads the `Authorization: Bearer <token>` header, verifies it against `JWT_SECRET`, and sets `req.userId = decoded.id`. Missing/invalid token -> `AppError("Not authorized...", 401)`.

### Frontend
- Tokens are stored in **`localStorage`** under keys `token`, `userId`, and `userName`.
- `ProtectedRoute.jsx` (a wrapper component, **not** a route) checks `localStorage.getItem("token")` and redirects to `/login` if absent. It wraps every dashboard-area layout.
- The stored token string is attached to fetch requests as `Authorization: Bearer ${token}`.
- The "Logout" button (Sidebar) removes the token from localStorage and navigates to `/login`.

## 5. Backend API Reference

All routes are mounted in `src/app.js`. Base URL: `http://localhost:3000`.

### 5.1 Auth — `/auth` (public)

| Method | Path | Body | Success -> | Errors |
|--------|------|------|------------|--------|
| POST | `/auth/signup` | `{ name, email, password }` | `201 { id, name, email }` | 400 missing fields; 400 email in use |
| POST | `/auth/login` | `{ email, password }` | `200 { token, user { id, name, email } }` | 400 missing fields; 401 invalid credentials |

### 5.2 Profile — `/profile`

| Method | Path | Auth | Query / Body | Success -> |
|--------|------|------|--------------|------------|
| POST | `/profile` | yes | `{ headline, bio, location, yearsOfExperience, skills[], githubUrl, portfolioUrl, linkedInUrl, availability }` (owner = `req.userId`) | `201 { devProfile }` |
| GET | `/profile` | no | `?search` (regex on headline), `?skills` (string|array), `?availability`, `?page` (1), `?limit` (10) | `200 [ profiles ]` |
| GET | `/profile/:id` | no | path param `id` = user id | `200 { profile }` |
| PUT | `/profile` | yes | Same fields as POST; `req.userId` identifies the profile. Throws 404 if no profile exists yet. | `200 { updated profile }` |

> The Developers directory page (`Developers.jsx`) calls `GET /profile` with `search`, `skills` (repeated), and `availability` query params, debounced 500ms.

### 5.3 Projects — `/projects`

| Method | Path | Auth | Body (summary) | Success -> | Ownership |
|--------|------|------|----------------|------------|-----------|
| POST | `/projects` | yes | `{ title, description, category, requiredSkills[], techStack[], startDate, endDate, repositoryUrl }` (owner = `req.userId`) | `201 { project }` | — (create) |
| GET | `/projects` | no | — | `200 [ projects ]` (sorted newest-first, owner populated) |
| GET | `/projects/:id` | no | path param `id` | `200 { project }` (owner populated) |
| PUT | `/projects/:id` | yes | Same fields as POST | `200 { project }` | must be owner (403) |
| DELETE | `/projects/:id` | yes | — | `204` | must be owner (403) |
| GET | `/projects/:id/members` | no | path param `id` | `200 [ members ]` (user populated, password excluded) |

- On project creation, a matching `ProjectMember` record (`role: "owner"`) is **automatically created**.
- `GET /projects` sorts by `createdAt: -1`.

### 5.4 Invitations — `/invitations` (all protected)

| Method | Path | Body | Behavior |
|--------|------|------|----------|
| POST | `/invitations/:id` | `{ invitedUserId }` (`:id` = projectId) | Project owner (`project.owner === req.userId`) creates an invitation with `status: "pending"`; else 403. |
| PUT | `/invitations/:id/respond` | `{ status }` ("accepted"\|"rejected") | The **invited user** (`invitation.invitedUser === req.userId`) responds. On "accepted", a `ProjectMember` (`role: "contributor"`) is created. |
| GET | `/invitations/me` | — | Returns only invitations where `status === "pending"`. |

### 5.5 Comments — `/comments`

| Method | Path | Auth | Body | Behavior |
|--------|------|------|------|----------|
| POST | `/comments/:id` | yes | `{ text }` (`:id` = projectId) | Creates a comment on the project. |
| GET | `/comments/:id` | no | — | Lists comments for the project (user populated, password excluded). |
| DELETE | `/comments/:commentId` | yes | — | Only the **comment author** can delete it. |

### 5.6 Tasks — `/tasks` (all protected)

| Method | Path | Body | Notes |
|--------|------|------|-------|
| GET | `/tasks` | — | Returns all tasks. |
| GET | `/tasks/:id` | — | Returns one task. |
| POST | `/tasks` | `{ title, description }` | Both fields required. |
| PUT | `/tasks/:id` | `{ title, description }` | Both required. |
| DELETE | `/tasks/:id` | — | — |

> 💡 Tasks are a standalone resource — **not** linked to projects in the model, nor surfaced in the frontend UI.

## 6. Data Models (Mongoose)

| Model | File | Fields |
|-------|------|--------|
| **User** | `server/src/models/User.js` | `name: String (req)`, `email: String (req, unique)`, `password: String (req, hashed)`. Has a `pre("save")` hook that bcrypt-hashes the password if modified. |
| **DeveloperProfile** | `server/src/models/DeveloperProfile.js` | `user: ObjectId -> User (req)`, `headline`, `bio`, `location`, `yearsOfExperience: Number`, `skills: [String]`, `githubUrl`, `portfolioUrl`, `linkedInUrl`, `availability`. One per user. |
| **Project** | `server/src/models/Project.js` | `owner: ObjectId -> User (req)`, `title (req)`, `description (req)`, `category (req)`, `requiredSkills: [String]`, `techStack: [String]`, `startDate/endDate: Date`, `repositoryUrl`, `status: ["active","completed","archived"] (def "active")`, `visibility: ["public","private"] (def "public")`. **Has `timestamps` -> `createdAt`/`updatedAt`.** |
| **ProjectMember** | `server/src/models/ProjectMember.js` | `project: ObjectId -> Project (req)`, `user: ObjectId -> User (req)`, `role: ["owner","contributor"] (def "contributor")`. Project membership join table. |
| **ProjectInvitation** | `server/src/models/ProjectInvitation.js` | `project: ObjectId -> Project (req)`, `invitedUser: ObjectId -> User (req)`, `invitedBy: ObjectId -> User (req)`, `status: ["pending","accepted","rejected"] (def "pending")`. |
| **Comment** | `server/src/models/Comment.js` | `project: ObjectId -> Project (req)`, `user: ObjectId -> User (req)`, `text: String (req)`. Project-scoped. |
| **Task** | `server/src/models/Task.js` | `title: String (req)`, `description: String (req)`. Simple standalone task. |

### Population strategy (for predictable responses)
- `Profile` docs populate `user` with `"name email"`.
- `Project` docs populate `owner` with `"name email"`.
- `ProjectMember` & `Comment` docs populate `user` with `"-password"` (strips the hash).
- `getMyInvitationService` returns raw invitation docs (project/invitedUser **not** populated -> frontend shows the raw ObjectId).

## 7. Frontend Deep Dive

### 7.1 Routing (`src/App.jsx`)

Routing is centralised in one `<Routes>` tree. Unauthenticated pages (`/`, `/login`, `/signup`) render directly. Everything else is wrapped in:

```jsx
<Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
  ...dashboard-area child routes...
</Route>
```

`ProtectedRoute` checks `localStorage.token` (redirect to `/login` if missing).
`DashboardLayout` renders the fixed `Sidebar` + a `<main>` with an `<Outlet />`.

| Route | Page | Auth | Purpose |
|-------|------|------|---------|
| `/` | `Landing` | public | Marketing page (Hero, How It Works, etc.) |
| `/login` | `Login` | public | Sign in; supports `?redirect=/...` for post-login navigation |
| `/signup` | `Signup` | public | Register -> navigate to `/login` |
| `/dashboard` | `Dashboard` | auth | Summary: profile card, invitations count, recent 4 projects |
| `/profile` | `Profile` | auth | Edit your developer profile |
| `/projects` | `Projects` | auth | Grid list of all projects |
| `/projects/:id` | `SingleProject` | auth | Project detail (status, owner actions) |
| `/projects/new` | `CreateProject` | auth | Create form |
| `/projects/:id/edit` | `EditProject` | auth | Edit form (owner only, enforced server-side) |
| `/invitations` | `Invitations` | auth | List + Accept/Reject invitations |
| `/developers` | `Developers` | auth | Directory with skill + availability filters |
| `/developers/:userId` | `DeveloperProfile` | auth | Public view of a developer |

### 7.2 Shared Components (`src/components/`)

| Component | File | Responsibility |
|-----------|------|----------------|
| `ProtectedRoute` | `ProtectedRoute.jsx` | Auth-gate wrapper for routes. |
| `DashboardLayout` | `DashboardLayout.jsx` | Mobile top bar (hamburger menu button, fixed `z-30`, `lg:hidden`) hosting the slide-in `Sidebar`; responsive `<main>` (`lg:ml-64 pt-14 lg:pt-0`) wrapping `<Outlet />`. |
| `Sidebar` | `Sidebar.jsx` | Off-canvas slide-in sidebar driven by `isOpen`/`onClose` props: backdrop overlay + X close button on mobile (`lg:hidden`), always-anchored on desktop (`lg:translate-x-0`). Active-link highlighting via `useLocation`, logo image (`Devnetic Logo.png`), nav links (Dashboard, My Profile, Projects, Developers, Invitations) + Logout. `bg-[#00000B]` dark theme. |
| `Header` | `Header.jsx` | Landing-page top nav (logo, How It Works, Login, Sign Up). |
| `Footer` | `Footer.jsx` | Landing-page footer with links. |
| `Hero` | `Hero.jsx` | Hero section w/ CTA buttons. |
| `HowItWorks` | `HowItWorks.jsx` | 3-step process. |
| `WhatIsDevnetic` | `WhatIsDevnetic.jsx` | About section w/ illustration. |
| `FinalCTA` | `FinalCTA.jsx` | Final call-to-action. |
| `Collaboration` | `Collaboration.jsx` | "Don't build alone" community visual. |
| `InviteModal` | `InviteModal.jsx` | Overlay modal: debounced (500ms) search of profiles by headline, then invite. |
| `SkillMultiSelect` | `SkillMultiSelect.jsx` | Reusable multi-select dropdown (hardcoded 10 skills; click-outside closes). Used by the Developers filter. |

### 7.3 Styling & Tooling
- **Tailwind CSS v4** — configured purely via `index.css` (`@import "tailwindcss"; @theme { --color-primary: #3C5CF6; ... }`). No separate `tailwind.config.js`. The custom `primary` color (`#3C5CF6` -> `#4F41F5`) is used for buttons, links, badges, and ring focus.
- **Fonts**: Lato (regular + bold) via Google Fonts, imported in `index.html`.
- **Icons**: `lucide-react` (imported as components). Static SVG social icons live in `public/icons.svg` as `<symbol>`s.
- **Toasts**: `react-hot-toast`; a single `<Toaster position="top-right" />` is declared in `App.jsx`.
- **Build**: Vite 8. `npm run dev` -> Vite dev server (HMR). `npm run build` -> production bundle. `npm run lint` -> ESLint flat config.
- **No state manager**: state is plain `useState`/`useEffect`; there is no Redux/Zustand/Context beyond router. **The API base URL `http://localhost:3000` is hardcoded in every fetch call** (no shared axios/client wrapper).

### 7.4 Frontend <- > Backend Data Flow (key pages)
- **Dashboard** — `GET /profile/:userId` (from `localStorage.userId`) -> profile card (headline, skills badges, availability) with an "Edit Profile" link; `GET /projects` -> newest 4 projects as cards (title, category, owner avatar initial + "Posted by {name}") linking to `/projects/:id`; `GET /invitations/me` -> pending-invitation count with a "View All" link to `/invitations`.
- **Profile (edit)** — `GET /profile/:userId` to pre-fill; `PUT /profile` to save. *(caveat: uses a plain text input for skills, not `SkillMultiSelect`; throws "Profile not found" (404) if no profile row exists yet.)*
- **Developers** — `GET /profile?search=...&skills=...&availability=...` debounced 500ms; the `SkillMultiSelect` controls the `skills` array. Desktop shows a sticky right-side filter panel (`lg:sticky`); mobile toggles a slide-up `FilterModal` (backdrop + handle-bar, "Apply Filters" button). Filters support free-text search, multi-skill selection, and **both** "Available" and "Unavailable" availability checkboxes plus a "Clear All" button. Result cards display developer name, headline, location, experience, an availability badge, up-to-5 skills (+ "N more"), and social links (GitHub / Portfolio / LinkedIn); empty state "No developers found matching your criteria."
- **Projects / Create / Edit** — `GET /projects` grid list (title, category, owner avatar initial + "Posted by {name}", **tech-stack tags**); empty state "No projects yet." `CreateProject`/`EditProject` split comma-separated `requiredSkills`/`techStack` into arrays client-side; `EditProject` enforces a 1500-char description limit and flashes `react-hot-toast` success/error feedback.
- **Invitations** — `GET /invitations/me` lists pending; Accept/Reject -> `PUT /invitations/:id/respond`, then optimistically removes the item from the list.
- **SingleProject (/projects/:id)** — full project detail page: loading spinner; graceful "Project not found" fallback (with a Back-to-Projects link); back button; color-coded status badge (`active`/`completed`/`archived` with emoji icons); owner-only desktop actions (Invite / Edit / Delete buttons) plus a mobile-only `MoreVertical` kebab dropdown with the same actions; title, creation date, category badge, "Posted by" owner (avatar + name); description panel; tech-stack tags; required-skills tags; repository link button (opens in new tab); and a full comment UI (see below).
- **SingleProject -> Comments** — `GET /comments/:projectId` list (author avatar initial, name, formatted date, text); post via `POST /comments/:projectId` with `{ text }` (Bearer token; `react-hot-toast` feedback); delete via `DELETE /comments/:commentId` (author-only, confirm dialog, optimistic removal).
- **SingleProject -> InviteModal** — modal calls `GET /profile?search=...` (debounced 500ms) and `POST /invitations/:projectId` with `{ invitedUserId }`; shows a `react-hot-toast` on success and closes the modal.

## 8. Gotchas & Known Limitations

| Area | Detail |
|------|--------|
| Hardcoded API URL | `http://localhost:3000` is pasted into every client `fetch()` call. No shared API client/env-based base. |
| `Profile` edit form | Uses a plain text input for skills instead of `SkillMultiSelect`; PUTs even when no profile exists yet (404). |
| Invitations list | `/invitations/me` returns non-populated docs, so `Invitations.jsx` displays `Project {invitation.project}` (raw ObjectId), not the project title. |
| Comments | Backend CRUD for comments exists (`/comments`) and is **now fully wired into the frontend**: `SingleProject.jsx` renders a comment list (`GET /comments/:projectId`), a post form (`POST /comments/:projectId` with `{ text }`), and author-only delete (`DELETE /comments/:commentId`), with `react-hot-toast` feedback on every action. |
| Tasks | Backend CRUD for tasks exists (`/tasks`) but **no task UI**, and tasks aren't linked to projects in the model. |
| Auth storage | JWT lives in `localStorage` (no refresh-token flow, no httpOnly cookie, no server re-validation per protected fetch). Fine for an MVP. |
| Missing error UI | `/developers/:nonexistent` renders nothing (`DeveloperProfile.jsx` has no fallback when the profile fetch fails); `/projects/:nonexistent` does NOT hit `SingleProject`'s "Project not found" fallback because the 404 JSON body is stored directly as `project` (no `res.ok` check in `fetchProject`), so a broken detail page renders instead. No global error boundaries. |
| `.env` secrets committed | `server/.env` (MongoDB Atlas URI + placeholder JWT secret) is committed. Rotate `JWT_SECRET` before deploying; avoid committing real secrets going forward. |
| Minor lint dust | `project.service.js` has stray `;;` after `getProjectByIdService` and inside `findById(...)`. Cosmetic only. |

## 9. Development Checklist (on clone / first run)

```bash
# 1. Server
cd server
npm install            # if node_modules is missing
# Ensure server/.env exists (it ships in the repo).
npm run dev            # -> http://localhost:3000

# 2. Client
cd ../client
npm install            # if node_modules is missing
npm run dev            # -> http://localhost:5173
```

Useful sanity checks after starting both servers:

```bash
curl http://localhost:3000/projects          # -> JSON array (possibly empty)
# Then open http://localhost:5173 in a browser.
```

A full manual smoke test:
1. `/signup` with a new email, then `/login` -> token stored.
2. Visit `/dashboard` -> shows the new (empty) profile + "No pending invitations."
3. `/profile` -> fill headline/skills/availability -> Save -> re-fetch shows updates.
4. `/projects/new` -> create a project -> verify on `/projects` and `/projects/:id`.
5. `/developers` -> search/filter the directory.
6. (As project owner) open project -> **Invite Developer** -> pick someone -> `/invitations` on their side shows the invite -> Accept -> project membership created.
7. (On a project detail page, as any logged-in user) post a comment via the "Write a comment..." box -> verify it appears in the list; delete your own comment (Trash icon) -> verify it's removed.

## 10. File Manifest (every source file)

### Client
- `client/package.json`, `client/vite.config.js`, `client/eslint.config.js`, `client/index.html`, `client/README.md`
- `client/src/main.jsx`, `client/src/App.jsx`, `client/src/App.css`, `client/src/index.css`
- `client/src/components/` — `ProtectedRoute.jsx`, `DashboardLayout.jsx`, `Sidebar.jsx`, `Header.jsx`, `Footer.jsx`, `Hero.jsx`, `HowItWorks.jsx`, `WhatIsDevnetic.jsx`, `FinalCTA.jsx`, `Collaboration.jsx`, `InviteModal.jsx`, `SkillMultiSelect.jsx`
- `client/src/pages/` — `Dashboard.jsx`, `Profile.jsx`, `Projects.jsx`, `SingleProject.jsx`, `CreateProject.jsx`, `EditProject.jsx`, `Invitations.jsx`, `Developers.jsx`, `DeveloperProfile.jsx`, `Landing.jsx`, `Login.jsx`, `Signup.jsx`
- `client/src/assets/` — `Devnetic Logo.png`, `Devnetic-Logo-Transparent.png`, `Devnetic-login-signup-page.webp`, `Hero-design-1.webp`, `Hero-design-2.webp`, `about devnetic.webp`
- `client/public/` — `favicon.svg`, `icons.svg`

### Server
- `server/package.json`, `server/.env`
- `server/src/server.js`, `server/src/app.js`
- `server/src/config/db.js`
- `server/src/middleware/` — `auth.js`, `errorHandler.js`
- `server/src/utils/` — `AppError.js`
- `server/src/models/` — `User.js`, `DeveloperProfile.js`, `Project.js`, `ProjectMember.js`, `ProjectInvitation.js`, `Comment.js`, `Task.js`
- `server/src/controllers/` — `auth.controller.js`, `profile.controller.js`, `project.controller.js`, `invitation.controller.js`, `comment.controller.js`, `task.controller.js`
- `server/src/services/` — `login.service.js`, `signup.service.js`, `profile.service.js`, `project.service.js`, `invitation.service.js`, `comment.service.js`, `task.service.js`
- `server/src/routes/` — `auth.routes.js`, `profile.routes.js`, `project.routes.js`, `invitation.routes.js`, `comment.routes.js`, `task.routes.js`

## 11. Summary

Devnetic is a complete, runnable **MVP of a developer collaboration platform** built on a standard, well-organized stack: **React 19 + Vite + Tailwind CSS** on the frontend and **Express 5 + Mongoose 9 + MongoDB Atlas** on the backend. The backend enforces a clean routes -> controllers -> services split with centralised error handling and JWT auth; the frontend is a single `react-router-dom` v7 tree with a protected dashboard area, responsive Tailwind styling, debounced search/filtering, optimistic UI updates, and toast notifications. It supports the full project lifecycle (create / view / edit / delete), developer profiles, an invite/respond collaboration flow, and a comment system now fully exposed on the project detail page (list / post / author-only delete via the `/comments` API, with `react-hot-toast` feedback). A standalone `/tasks` API also exists but remains unexposed in the UI.
