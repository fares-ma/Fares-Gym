"use server";

import crypto from "crypto";
import { headers } from "next/headers";
import { db, initializeDatabase } from "../data/db";
import { loginAttempts } from "../data/schema";
import { eq, and, gt, desc } from "drizzle-orm";
import { verifyPassword } from "./hash";
import { createSession, destroySession } from "./session";
import { loginSchema, type LoginInput } from "../lib/validations";
import { ar } from "../i18n/ar";

const MAX_FAILED_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    return headerList.get("x-real-ip") || "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

async function isRateLimited(ip: string): Promise<boolean> {
  await initializeDatabase();
  const now = new Date();
  const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW_MS);

  const attempts = await db
    .select()
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.ipAddress, ip),
        eq(loginAttempts.success, false),
        gt(loginAttempts.attemptedAt, windowStart)
      )
    )
    .orderBy(desc(loginAttempts.attemptedAt));

  return attempts.length >= MAX_FAILED_ATTEMPTS;
}

async function recordAttempt(ip: string, success: boolean): Promise<void> {
  await initializeDatabase();
  await db.insert(loginAttempts).values({
    id: crypto.randomUUID(),
    ipAddress: ip,
    attemptedAt: new Date(),
    success: success,
  });
}

export type AuthResult = {
  success: boolean;
  error?: string;
};

export async function loginAction(input: LoginInput): Promise<AuthResult> {
  const parseResult = loginSchema.safeParse(input);
  if (!parseResult.success) {
    return { success: false, error: ar.auth.invalidCredentials };
  }

  const ip = await getClientIp();

  if (await isRateLimited(ip)) {
    return { success: false, error: ar.auth.rateLimitExceeded };
  }

  const expectedUsername = process.env.ADMIN_USERNAME || "fares";
  const expectedPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";

  if (input.username !== expectedUsername) {
    await recordAttempt(ip, false);
    return { success: false, error: ar.auth.invalidCredentials };
  }

  const isValid = await verifyPassword(input.password, expectedPasswordHash);
  if (!isValid) {
    await recordAttempt(ip, false);
    return { success: false, error: ar.auth.invalidCredentials };
  }

  // Success
  await recordAttempt(ip, true);
  await createSession();

  return { success: true };
}

export async function logoutAction(): Promise<void> {
  await destroySession();
}
