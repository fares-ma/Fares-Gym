# Specification: Phase 4 — Progress & Analytics 📈

## Overview
Fares Hub needs a comprehensive, motivating Progress & Analytics dashboard that quantifies training performance, consistency, and body metrics without prescribing automated goals or violating data integrity rules.

## Core Invariants & Rules
1. **Weight Tag Separation**:
   - Personal Records (PRs) and volume trends must strictly evaluate weights within the same opaque unit tag (`K` or `B` or standard tags).
   - Weights with different tags for the same exercise are NEVER aggregated or directly compared.
2. **Objective Comparison Only**:
   - Descriptive statements only (e.g. "50K × 7 vs 45K × 8 on Sep 12"). No subjective or automated judgment.
   - If fewer than 2 data points exist for an exercise, display "مفيش بيانات كفاية لسه".
3. **Personal Best Definition**:
   - Only completed working sets count towards personal records (heating/warmup sets are excluded).
   - Higher numeric weight wins. Ties are broken by actual reps.
4. **Body Weight Tracking**:
   - Single daily body weight entry in `body_metrics` table (`date`, `weightKg`, `notes`).
5. **Session Volume**:
   - Volume for each completed workout session calculated as sum of (weight * reps) for working sets.

## Key Screens & Features
1. **Consistency Overview**:
   - Total completed sessions count.
   - 30-day activity rate (percentage of active days).
   - Current weekly streak.
   - Mini Fares motivational badge.
2. **Body Weight Tracker**:
   - Visual trend line / scatter chart showing weight over time (last 30/90 days).
   - Quick "سجل وزن اليوم" inline action modal.
3. **Exercise Personal Records (PRs)**:
   - Searchable / filterable cards by exercise.
   - Shows all-time highest working weight & reps, date achieved, and previous best comparison.
4. **Workout Volume Trends**:
   - Session-by-session volume bar/line chart.
