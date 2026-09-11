# Quickstart & Validation Guide: Phase 0

This guide outlines how to run and validate the foundational setup for Fares Hub locally.

## Prerequisites

1. **Node.js**: v20 or higher.
2. **Environment Variables**: Create a `.env` file in the root directory.

```bash
# .env example
ADMIN_USERNAME=fares
ADMIN_PASSWORD_HASH=$argon2id$v=19$m=65536,t=3,p=4$somehash... # (Use a real argon2 hash for testing)
SESSION_SECRET=super_secret_session_key_min_32_chars!
DATABASE_URL=file:./local.db
```

## Setup & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run database migrations**:
   ```bash
   npm run db:push
   ```
   *Expected Outcome*: A `local.db` file is created in the root directory.

3. **Start the development server**:
   ```bash
   npm run dev
   ```

## Validation Scenarios

### 1. Secure Login & Auth Flow
- **Action**: Open `http://localhost:3000` in your browser.
- **Expected Outcome**: You are redirected to `http://localhost:3000/login`.
- **Action**: Enter wrong credentials.
- **Expected Outcome**: An Arabic error message appears.
- **Action**: Enter the correct credentials defined in your `.env`.
- **Expected Outcome**: You are redirected to the home page (`/`), and a session cookie is set.

### 2. RTL App Shell & Theming
- **Action**: View the home page after login.
- **Expected Outcome**: The layout is Right-to-Left (RTL). A sidebar (desktop) or bottom nav (mobile) is visible.
- **Action**: Click the theme toggle button.
- **Expected Outcome**: The UI switches between dark and light modes. Refreshing the page retains the selected theme.

### 3. Localization
- **Action**: Inspect the UI text on the login and home pages.
- **Expected Outcome**: All text is in Egyptian Arabic.

### 4. Database Persistence
- **Action**: Check the `local.db` file using an SQLite viewer or CLI.
- **Expected Outcome**: The `sessions` and `app_settings` tables exist. The `sessions` table contains an entry for your current login.
