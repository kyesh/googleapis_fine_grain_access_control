# AGENTS.md

## Cursor Cloud specific instructions

### Project Overview

SecureAgent is a Next.js 16 (App Router, Turbopack) application that provides fine-grained access control proxy for AI agents using Google APIs (Gmail, Drive, Calendar). It uses Clerk for authentication/OAuth, Neon Serverless Postgres via Drizzle ORM, and Tailwind CSS v4.

### Running the App

- **Package manager**: npm (lockfile: `package-lock.json`)
- **Dev server**: `npm run dev` — starts on `http://localhost:3000`
- **Build**: `npm run build`
- **Lint**: `npm run lint` (ESLint with next/core-web-vitals + typescript configs)

### Required Environment Variables

The app requires a `.env.local` file with:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (starts with `pk_test_` or `pk_live_`) |
| `CLERK_SECRET_KEY` | Clerk secret key (starts with `sk_test_` or `sk_live_`) |
| `DATABASE_URL` | Neon Postgres connection string (also checked as `neon__POSTGRES_URL` or `POSTGRES_URL`) |

Without valid Clerk keys, the middleware (`src/proxy.ts`, which Next.js 16 picks up as Proxy middleware) will reject all HTTP requests with a 500 error. The dev server starts but no pages will render.

### Key Caveats

- **Middleware file**: Next.js 16 uses `src/proxy.ts` (not `middleware.ts`) as the middleware entry point. The build output labels it "Proxy (Middleware)."
- **Database**: The `db` module (`src/db/index.ts`) logs a warning but does not crash if `DATABASE_URL` is missing. However, dashboard and proxy routes will fail at runtime when they attempt DB queries.
- **Schema management**: See `.agent/rules/database.md` for the branching workflow. Run `npm run db:branch` before schema changes to create an isolated Neon branch, then `npm run db:push` to apply schema.
- **No automated tests**: The project currently has no test suite — only lint and build serve as CI checks.
