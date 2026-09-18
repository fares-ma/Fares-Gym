# Specification: Phase 5 — Settings, Data Export & PWA Polish ⚙️📱

## Overview
Phase 5 finishes Fares Hub by establishing comprehensive system settings, full sovereign data backup & export, and PWA (Progressive Web App) installation capabilities for mobile and desktop standalone usage.

## Core Features & Requirements
1. **Full Sovereign Data Export (JSON Backup)**:
   - Complete export of all tables (exercises, programs, sessions, performed sets, meals, nutrition targets, schedule blocks, reminders, notes, body metrics, app settings).
   - Direct browser download as a formatted `.json` file (`fares-hub-backup-YYYY-MM-DD.json`).
   - Displays timestamp of last export in Settings.
2. **Weight Notation Management**:
   - Transparent inspection of `K` and `B` unit tags.
   - Ability to confirm/customize unit notes per tag with permanent rule adherence (no auto-conversion to kg/lbs).
3. **PWA & Standalone Installation**:
   - `manifest.json` configured for RTL Egyptian Arabic, theme colors, icons, and standalone display.
   - App Router metadata and Apple touch icons for home-screen installation on iOS and Android.
4. **Settings Hub UI**:
   - Theme toggle (Dark Comic default).
   - Database connection status (Neon Serverless PostgreSQL).
   - Session management & logout CTA.
