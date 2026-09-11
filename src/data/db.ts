import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const dbUrl = process.env.DATABASE_URL || "file:fares-hub.db";

export const client = createClient({
  url: dbUrl,
});

export const db = drizzle(client, { schema });

/**
 * Initializes foundational tables if they don't exist yet.
 * Ensures the database file and initial tables are ready on startup.
 */
export async function initializeDatabase(): Promise<void> {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      token_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id TEXT PRIMARY KEY,
      ip_address TEXT NOT NULL,
      attempted_at INTEGER NOT NULL,
      success INTEGER NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS user_profile (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
}
