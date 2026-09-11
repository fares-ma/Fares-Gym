# Feature Specification: Phase 0 — Foundation

**Feature Branch**: `001-phase0-foundation`

**Created**: 2026-09-11

**Status**: Draft

**Input**: User description: "Phase 0 from PRD — project foundation: scaffolding, auth, layout, RTL, design system, database setup"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Login (Priority: P1)

Fares opens the app URL from any device on his Tailscale network and sees a
login screen. He enters his username and password. If credentials are correct,
he is redirected to the home page. If wrong, he sees a clear Arabic error
message. After logging in, he can close the tab and reopen it — the session
persists without re-login for up to two weeks.

**Why this priority**: Without authentication, no other feature can safely
expose personal data. This is the gate to everything else.

**Independent Test**: Can be fully tested by navigating to the app URL,
attempting login with correct and incorrect credentials, and verifying session
persistence after closing/reopening the tab.

**Acceptance Scenarios**:

1. **Given** Fares is not logged in, **When** he visits any app page,
   **Then** he is redirected to the login page.
2. **Given** Fares is on the login page, **When** he enters the correct
   username and password, **Then** he is redirected to the home page and
   a session cookie is set.
3. **Given** Fares is on the login page, **When** he enters wrong credentials,
   **Then** he sees an error message in Egyptian Arabic and remains on the
   login page.
4. **Given** Fares has failed login 5 times within 15 minutes, **When** he
   tries again, **Then** the system temporarily blocks further attempts and
   shows a rate-limit message.
5. **Given** Fares is logged in, **When** he closes the tab and reopens it
   within 14 days, **Then** his session is still active and he sees the
   home page directly.
6. **Given** Fares is logged in, **When** his session cookie expires after
   14 days of inactivity, **Then** he is redirected to the login page.

---

### User Story 2 - App Shell with RTL Layout (Priority: P1)

After logging in, Fares sees a clean, premium dark-themed layout. On
desktop/tablet, a sidebar shows navigation links (currently placeholder since
no features exist yet). On mobile, a bottom navigation bar appears instead.
The entire interface is right-to-left (RTL) with Egyptian Arabic text. A
theme toggle lets him switch between dark and light modes, and the preference
persists across sessions.

**Why this priority**: The layout shell is the container for every future
feature. RTL and the design system must be correct from day one to avoid
costly rework.

**Independent Test**: Can be tested by logging in, verifying the layout
renders correctly in RTL on both desktop and mobile viewports, toggling the
theme, and confirming the preference persists after page refresh.

**Acceptance Scenarios**:

1. **Given** Fares is logged in on a desktop browser, **When** the home page
   loads, **Then** he sees a sidebar navigation on the right side (RTL) with
   placeholder links.
2. **Given** Fares is logged in on a mobile browser (< 768px), **When** the
   home page loads, **Then** he sees a bottom navigation bar instead of a
   sidebar.
3. **Given** the theme is set to dark (default), **When** Fares taps the
   theme toggle, **Then** the entire UI switches to light mode instantly.
4. **Given** Fares has switched to light mode, **When** he refreshes the page
   or revisits later, **Then** the light theme is still active.
5. **Given** Fares views any screen, **When** he checks text alignment and
   element positioning, **Then** all content flows right-to-left with logical
   properties (`start`/`end`), no `left`/`right` hardcoding visible.
6. **Given** Fares views any screen, **When** he checks the language, **Then**
   all UI text is in Egyptian Arabic (colloquial), sourced from a centralized
   translation file — no hardcoded strings in components.

---

### User Story 3 - Database Initialization & Health (Priority: P1)

The system initializes an SQLite database on first run with the foundational
tables needed for auth and settings. Fares does not interact with this
directly, but the system must be operational for any feature to work.

**Why this priority**: Every subsequent feature depends on the database being
correctly initialized with migrations applied.

**Independent Test**: Can be verified by starting the app for the first time,
confirming the database file is created, and checking that login works
(proving the sessions table exists and functions).

**Acceptance Scenarios**:

1. **Given** the app starts for the first time (no database file exists),
   **When** the server process begins, **Then** the database file is created
   and all foundational tables are present.
2. **Given** the database already exists with an older schema, **When** the
   app starts, **Then** pending migrations run automatically without data
   loss.
3. **Given** the database is operational, **When** Fares logs in, **Then**
   the session record is correctly stored and retrievable.

---

### User Story 4 - Home Page Placeholder (Priority: P2)

After login, Fares lands on a home page that shows a greeting message
(time-aware: "صباح الخير" / "مساء الخير") and placeholder cards indicating
where future features (gym, nutrition, activities) will appear. This gives
him confidence the app is working and establishes the visual language.

**Why this priority**: Provides visual confirmation that the foundation works
and sets design expectations, but is not functionally critical.

**Independent Test**: Can be tested by logging in at different times of day
and verifying the greeting changes and placeholder cards render correctly in
RTL.

**Acceptance Scenarios**:

1. **Given** Fares is logged in in the morning, **When** the home page loads,
   **Then** the greeting says "صباح الخير يا فارس" (or similar).
2. **Given** Fares is logged in in the evening, **When** the home page loads,
   **Then** the greeting says "مساء الخير يا فارس" (or similar).
3. **Given** Fares views the home page, **When** he scrolls, **Then** he sees
   clearly labeled placeholder sections for gym, nutrition, and activities.

---

### Edge Cases

- What happens when the session secret environment variable is missing at
  startup? → The app MUST refuse to start and log a clear error.
- What happens when the database file is corrupted or inaccessible? → The app
  MUST log a clear error and refuse to serve requests rather than silently
  creating a new empty database.
- What happens when Fares accesses the app from a device not on the Tailscale
  network? → The connection will be refused at the network level (not the
  app's responsibility, but the app should not assume public internet access).
- What happens when JavaScript is disabled? → The login form should still
  render with basic HTML. Full interactivity requires JS (acceptable for a
  single-user PWA).
- What happens when multiple tabs are open simultaneously? → Session state
  must be consistent across tabs (cookie-based auth handles this naturally).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present a login form requiring username and password.
- **FR-002**: System MUST validate credentials against a securely stored
  password hash that cannot be reversed.
- **FR-003**: System MUST issue a secure session token upon successful login
  that persists for up to 14 days and is not accessible to client-side scripts.
- **FR-004**: System MUST automatically extend the session expiration upon
  each authenticated request (sliding window).
- **FR-005**: System MUST enforce a rate limit of 5 failed login attempts per
  15-minute window, with a clear message when the limit is reached.
- **FR-006**: System MUST redirect all unauthenticated requests to protected
  routes to the login page.
- **FR-007**: System MUST provide a logout action that invalidates the current
  session.
- **FR-008**: System MUST render the entire UI in right-to-left (RTL)
  direction using logical CSS properties (`start`/`end`), never physical
  (`left`/`right`).
- **FR-009**: System MUST display all user-facing text in Egyptian Arabic
  (colloquial), loaded from a centralized i18n file — no hardcoded strings in
  UI components.
- **FR-010**: System MUST provide a dark/light theme toggle that persists the
  user's preference across sessions.
- **FR-011**: System MUST display a responsive layout: sidebar navigation on
  desktop (≥ 768px) and bottom navigation on mobile (< 768px).
- **FR-012**: System MUST initialize the database and run pending migrations
  automatically on startup.
- **FR-013**: System MUST refuse to start if required environment variables
  (session secret, admin credentials, database path) are missing, logging a
  clear error.
- **FR-014**: System MUST display a time-aware greeting on the home page
  (morning/afternoon/evening).
- **FR-015**: System MUST store all secrets exclusively in environment
  variables — none in source code or version control.

### Key Entities

- **AppSettings**: Key-value store for application configuration (theme
  preference, general settings). Each entry has a unique key, a value, and a
  last-updated timestamp.
- **Session**: Represents an authenticated login session. Contains a token
  hash, creation timestamp, and expiration timestamp. Used to validate
  incoming requests against active sessions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Fares can complete the login flow (open URL → enter credentials
  → see home page) in under 5 seconds on a local network.
- **SC-002**: Session persists correctly: closing and reopening the browser
  tab within 14 days requires no re-login (verified manually).
- **SC-003**: Rate limiting activates after exactly 5 failed attempts within
  15 minutes and blocks further attempts with a clear message.
- **SC-004**: Theme toggle switches between dark and light mode, and the
  preference survives page refresh and new sessions (verified manually).
- **SC-005**: All visible UI text is in Egyptian Arabic with correct RTL
  layout — no English UI strings, no left-aligned text, no physical
  `left`/`right` CSS (verified by visual inspection on mobile and desktop).
- **SC-006**: The app builds without errors and starts successfully on a
  clean environment with only the required environment variables set.
- **SC-007**: The database file is created automatically on first startup
  with all required tables present.

## Assumptions

- **Single user**: The entire system serves exactly one user (Fares). There
  is no user registration flow, no multi-user support, and no role-based
  access control.
- **Network access**: The app is accessed exclusively via Tailscale (private
  network). Public internet access is not required or expected in Phase 0.
- **Credentials**: The admin username and password hash are pre-configured in
  environment variables. There is no self-service password reset or change
  flow in Phase 0.
- **Database location**: The SQLite database file path is specified via an
  environment variable and resides on the same machine running the app.
- **No feature content yet**: The home page shows placeholder content only.
  Actual gym/nutrition/activity features are deferred to later phases.
- **Dark theme default**: The app defaults to dark mode on first visit. The
  user can switch to light mode, and the preference is stored locally.
- **Egyptian Arabic only**: There is no language switcher in Phase 0. The UI
  is exclusively in Egyptian Arabic. An English option may be added in a
  future phase.
