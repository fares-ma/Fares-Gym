# Implementation Plan: Phase 0 — Foundation

**Branch**: `001-phase0-foundation` | **Date**: 2026-09-11 | **Spec**: [spec.md](file:///c:/Users/Fares/Desktop/Gym/specs/001-phase0-foundation/spec.md)

**Input**: Feature specification from `/specs/001-phase0-foundation/spec.md`

## Summary

Build the foundational infrastructure for Fares Hub: scaffolding a Next.js 15 app, configuring Tailwind v4 + shadcn/ui, setting up a local SQLite database with Drizzle ORM, and implementing a custom cookie-based authentication system. This phase delivers the secure, RTL-first app shell that all future features will plug into.

## Technical Context

**Language/Version**: TypeScript (strict mode)

**Primary Dependencies**: Next.js 15 (App Router), Tailwind CSS v4, shadcn/ui, Tremor, lucide-react, Zod, argon2

**Storage**: SQLite (via better-sqlite3) with Drizzle ORM and drizzle-kit for migrations

**Testing**: Jest or Vitest for domain logic unit testing (to be set up later for specific domain functions)

**Target Platform**: Web application (PWA) served via Tailscale on a local Ubuntu server

**Project Type**: Single-user personal full-stack web application

**Performance Goals**: Fast local network responses (< 5 seconds for auth flow)

**Constraints**: Must run on home server using PM2 (no Docker). Must support offline read (PWA) in later phases, so UI must be resilient.

**Scale/Scope**: Single user, small local SQLite file, ~10 main screens.

## Constitution Check

*GATE: Passed*

- **Single User & SQLite Source of Truth**: The plan uses a local SQLite file via `better-sqlite3` and custom auth for a single admin user. No third-party auth providers.
- **Secrets in Env Only**: Auth secrets and DB path will be strictly loaded from `.env`.
- **RTL & Egyptian Arabic**: The layout will use logical properties (`start`/`end`) and localized strings from day one.
- **No Docker**: The app is structured as a standard Node.js app to be run via PM2.

## Project Structure

### Documentation (this feature)

```text
specs/001-phase0-foundation/
├── plan.md              # This file
├── research.md          # Research findings
├── data-model.md        # DB schemas and entities
└── quickstart.md        # End-to-end validation guide
```

### Source Code (repository root)

```text
fares-hub/
├── app/
│   ├── (auth)/login/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx         # App shell (Sidebar/Bottom nav)
│   │   └── page.tsx           # Home placeholder
├── src/
│   ├── ui/                    # shadcn components
│   ├── server/                # Auth middleware, session handling
│   ├── data/
│   │   ├── schema.ts          # Drizzle schema
│   │   └── db.ts              # DB connection
│   ├── lib/                   # Utils, Zod schemas
│   └── i18n/                  # Localization files
├── public/
├── drizzle.config.ts
├── .env.example
└── package.json
```

**Structure Decision**: A standard Next.js App Router structure with `src/` directory separating core logic from routes. This matches the project's specified Clean Architecture-lite approach.

## Complexity Tracking

No violations of the constitution. Custom auth is chosen over NextAuth to strictly follow the single-user, no-OAuth constraints and reduce unnecessary bloat.
