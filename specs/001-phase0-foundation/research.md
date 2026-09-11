# Research & Technical Decisions: Phase 0

## Decisions

### 1. Authentication System
- **Decision**: Custom cookie-based authentication using Argon2 for hashing.
- **Rationale**: The constitution strictly mandates a single-user system (Fares only). NextAuth or third-party OAuth providers introduce unnecessary complexity, require external network calls, and violate the offline-first/single-user principles. A simple HTTP-only signed cookie with argon2 is the most secure and lightweight approach for this specific use case.
- **Alternatives considered**: NextAuth (rejected due to bloat and multi-user focus).

### 2. Database Stack
- **Decision**: SQLite (via `better-sqlite3`) + Drizzle ORM.
- **Rationale**: The app will run on a single home server without Docker. SQLite is a zero-configuration, single-file database that perfectly fits a single-user personal app. It makes backups trivial (copying the file). Drizzle ORM provides type-safe SQL without the heavy abstraction overhead of Prisma.
- **Alternatives considered**: PostgreSQL (rejected due to administration overhead and overkill for single-user data). Prisma (rejected in favor of Drizzle's closer-to-SQL approach and smaller footprint).

### 3. RTL & Localization Strategy
- **Decision**: Use logical CSS properties (`padding-inline-start`, `margin-inline-end`, etc.) mapped via Tailwind v4 utilities (`ps-`, `me-`). All strings will be extracted to a centralized JSON/TS object.
- **Rationale**: Ensures the UI naturally adapts to the right-to-left layout without needing conditional CSS classes or dual layouts. 
- **Alternatives considered**: Hardcoding RTL CSS (rejected due to inflexibility).

### 4. Application Framework
- **Decision**: Next.js 15 (App Router).
- **Rationale**: Mandated by the project spec. Allows seamless integration of Server Actions for DB writes (e.g., login, saving settings) without needing a separate backend API layer.
