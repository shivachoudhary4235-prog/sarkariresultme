# Sarkari Result — Production Full-Stack Monorepo

A production-grade government jobs & recruitment portal.
Migrated from Vite + localStorage prototype to a full multi-user CMS architecture.

## Architecture

```
INTERNET
    │
    ▼
Cloudflare / WAF
    │
    ├── sarkariresult.com          → apps/web      (Next.js, ISR)
    ├── admin.sarkariresult.com    → apps/admin    (Next.js, SSR, protected)
    └── api.sarkariresult.com      → services/api  (Node.js + Express)
                                          │
                    ┌─────────────────────┼──────────────────────┐
                    ▼                     ▼                       ▼
               Supabase Auth       Supabase PostgreSQL    Supabase Storage
                                   (+ RLS)                (Media files)
                                         │
                                         ▼
                                     Audit Logs
```

## Monorepo Structure

```
sarkari-result/
├── apps/
│   ├── web/                    # Next.js 15 public website (port 3000)
│   └── admin/                  # Next.js 15 admin CMS (port 3001)
├── services/
│   └── api/                    # Node.js + Express API (port 4000)
├── packages/
│   └── shared-types/           # Shared TypeScript types
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── config.toml
├── .env.example
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Prerequisites

- Node.js >= 20
- pnpm >= 9 (`npm install -g pnpm`)
- A Supabase project (free tier works)

## Setup

### 1. Clone and install

```bash
git clone <repo>
cd sarkari-result
pnpm install
```

### 2. Environment variables

```bash
cp .env.example .env
# Fill in your Supabase URL, keys, and other values
```

### 3. Set up the database

Run the migration in your Supabase SQL editor:
```
supabase/migrations/001_initial_schema.sql
```

Or use the Supabase CLI:
```bash
supabase db push
```

### 4. Migrate seed data (one-time)

```bash
# From the repo root
pnpm db:seed
```

This reads the original `seedData.ts` and populates Supabase.
**Do not delete seedData.ts until you have verified the seed.**

### 5. Create your first admin user

1. Create a user in Supabase Auth dashboard (Authentication → Users)
2. In the SQL editor, grant them admin role:
```sql
INSERT INTO public.admin_roles (user_id, role)
VALUES ('<user-id-from-supabase>', 'SUPER_ADMIN');

INSERT INTO public.profiles (id, display_name, is_active)
VALUES ('<user-id-from-supabase>', 'Admin Name', true);
```

### 6. Run the development environment

```bash
pnpm dev
# Starts all apps in parallel via Turborepo
```

Or individually:
```bash
# Public website
pnpm --filter @sarkari/web dev

# Admin CMS
pnpm --filter @sarkari/admin dev

# API
pnpm --filter @sarkari/api dev
```

## Access Points (Development)

| App | URL |
|-----|-----|
| Public Website | http://localhost:3000 |
| Admin CMS | http://localhost:3001/admin |
| API | http://localhost:4000 |
| API Health | http://localhost:4000/health |

## Security

- ✅ Supabase Auth (no manual password hashing)
- ✅ Cookie-based SSR sessions (no plaintext localStorage sessions)
- ✅ Row Level Security on all Supabase tables
- ✅ Server-side role verification on every admin route
- ✅ Generic auth error messages (no user enumeration)
- ✅ Rate limiting (5 attempts / 15 min on auth endpoints)
- ✅ Server-only secrets (never in browser bundle)
- ✅ Audit logs for all admin mutations
- ✅ Input validation via Zod
- ✅ Security headers via Helmet
- ✅ CORS configured to specific origins only

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Public Frontend | Next.js 15 (App Router, ISR) |
| Admin Frontend | Next.js 15 (App Router, SSR) |
| API Backend | Node.js + Express |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Authorization | PostgreSQL RLS + Role middleware |
| Validation | Zod |
| Logging | Winston |
| Security | Helmet, express-rate-limit |
| Monorepo | pnpm workspaces + Turborepo |
| Types | TypeScript 5 (shared via @sarkari/shared-types) |
| AI | Google Gemini (server-side only) |

## Environment Variables

See `.env.example` for all required variables.

**Critical rules:**
- `SUPABASE_SECRET_KEY` — SERVER ONLY. Never in `NEXT_PUBLIC_*`
- `GEMINI_API_KEY` — SERVER ONLY. Never in browser code
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — safe for browser (RLS enforced)

## API Endpoints

### Public (no auth)
- `GET /api/public/notifications` — list published notifications
- `GET /api/public/notifications/:slug` — get by slug
- `GET /api/public/search` — full-text search
- `GET /api/public/ticker` — active ticker items
- `GET /api/public/featured` — active featured tiles
- `GET /api/public/categories` — category counts

### Admin (requires auth + admin role)
- `GET/POST /api/admin/notifications`
- `GET/PATCH/DELETE /api/admin/notifications/:id`
- `PATCH /api/admin/notifications/:id/publish`
- `GET/POST /api/admin/ticker`
- `GET/PATCH /api/admin/featured`
- `GET/POST/DELETE /api/admin/media`
- `GET /api/admin/audit-logs`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/role`

## Component Migration Map

| Original | Migrated To |
|----------|------------|
| `src/components/Header.tsx` | `apps/web/src/components/Header.tsx` |
| `src/components/Footer.tsx` | `apps/web/src/components/Footer.tsx` |
| `src/components/Ticker.tsx` | `apps/web/src/components/Ticker.tsx` |
| `src/components/DirectoryMatrix.tsx` | `apps/web/src/components/DirectoryMatrix.tsx` |
| `src/components/DetailView.tsx` | `apps/web/src/components/DetailViewClient.tsx` |
| `src/components/SearchView.tsx` | `apps/web/src/components/SearchView.tsx` |
| `src/components/AdminCMS.tsx` | `apps/admin/src/components/` (refactored) |
| `src/types/index.ts` | `packages/shared-types/src/index.ts` |
| `src/data/seedData.ts` | Migration source → Supabase PostgreSQL |
| `src/context/PortalContext.tsx` | Replaced by API + server components |
| `src/utils/dateUtils.ts` | `apps/web/src/lib/dateUtils.ts` |
