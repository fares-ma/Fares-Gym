# Data Model: Phase 0

This phase introduces the foundational database schema required for authentication and application settings.

## 1. `sessions`

Stores active login sessions. Since the system is single-user and credentials come from environment variables, this table does not need to relate to a `users` table.

| Field | Type | Attributes | Description |
|-------|------|------------|-------------|
| `id` | TEXT | Primary Key | Unique session identifier (secure random string) |
| `created_at` | INTEGER | Not Null | Unix timestamp of when the session was created |
| `expires_at` | INTEGER | Not Null | Unix timestamp of when the session expires |

**Validation Rules**:
- `expires_at` must be in the future when a session is active.
- Expired sessions will be periodically pruned or rejected upon validation.

---

## 2. `app_settings`

A simple key-value store for global application configuration (e.g., theme preferences).

| Field | Type | Attributes | Description |
|-------|------|------------|-------------|
| `key` | TEXT | Primary Key | Unique setting identifier (e.g., `theme`) |
| `value` | TEXT | Not Null | JSON-serialized or plain text value |
| `updated_at` | INTEGER | Not Null | Unix timestamp of last update |

**Validation Rules**:
- `key` must be a valid predefined string.
- `value` must be a valid string (can be parsed to JSON if needed by the application layer).
