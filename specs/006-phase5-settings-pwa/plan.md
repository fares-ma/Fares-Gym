# Implementation Plan: Phase 5 — Settings, Export & PWA

**Parent Feature**: `specs/006-phase5-settings-pwa/spec.md`  
**Target Architecture**: Next.js 15 App Router + Server Actions + PWA Web Manifest + Neon Postgres

---

## Architecture & Layers

1. **Server Layer (`src/server/`)**:
   - `settings-actions.ts`:
     - `exportAllDataAction()`: Queries all Neon DB tables and bundles them into an encrypted/safe JSON backup object.
     - `updateAppSettingAction(key: string, value: string)`: Updates app settings in `app_settings` table.
     - `confirmUnitTagAction(unitTag: string, meaning: string)`: Updates unit confirmation in `app_settings`.
   - `settings-queries.ts`:
     - `getAppSettingsSummary()`: Returns all current settings, last backup date, unit confirmations, and DB health.

2. **Localization (`src/i18n/ar.ts`)**:
   - Add `settings` section covering backup, export, weight notation, PWA instructions, and system stats.

3. **PWA Assets & Configuration (`public/`)**:
   - `public/manifest.json`: Web app manifest with standard icons and metadata.
   - `app/layout.tsx`: Updated metadata with `manifest: "/manifest.json"`, apple touch icons, theme-color, and mobile viewport tokens.

4. **UI Layer (`src/ui/settings/` & `app/(app)/settings/page.tsx`)**:
   - `BackupExportCard.tsx`: One-click JSON backup download button with status and size indicator.
   - `WeightNotationCard.tsx`: Notation confirmation table for `K` and `B` tags.
   - `SystemInfoCard.tsx`: Database, session, and version diagnostics.
   - `SettingsView.tsx`: Client coordinator.
   - `app/(app)/settings/page.tsx`: Server page passing live settings and export capability.
