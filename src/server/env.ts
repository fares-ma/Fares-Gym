import { z } from "zod";

/**
 * Strict runtime environment variable validation.
 * This module ensures all required env vars are present and correctly typed
 * at startup rather than failing silently at runtime.
 *
 * Usage: import { env } from "@/server/env";
 */

const envSchema = z.object({
  // Database — Neon Serverless PostgreSQL (sole source of truth)
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .url("DATABASE_URL must be a valid URL"),

  // Authentication — Session cookie signing secret
  SESSION_SECRET: z
    .string()
    .min(16, "SESSION_SECRET must be at least 16 characters")
    .default("default_secret_fares_hub_min32chars_for_ci_and_dev"),

  // Admin user credentials
  ADMIN_USERNAME: z.string().default("fares"),
  ADMIN_PASSWORD_HASH: z.string().min(1, "ADMIN_PASSWORD_HASH is required").optional(),

  // Timezone — Defaults to Africa/Cairo per AGENTS.md
  APP_TIMEZONE: z.string().default("Africa/Cairo"),

  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  ✗ ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    console.error(
      "\n❌ Invalid environment variables:\n" + formatted + "\n"
    );

    // In production, fail hard. In dev, warn but don't crash to allow partial startup.
    if (process.env.NODE_ENV === "production") {
      throw new Error("Missing or invalid environment variables. See logs above.");
    }
  }

  return parsed.success ? parsed.data : (process.env as unknown as z.infer<typeof envSchema>);
}

export const env = validateEnv();
