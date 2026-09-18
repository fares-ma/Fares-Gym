"use server";

import crypto from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "../data/db";
import { loginAttempts } from "../data/schema";
import { eq, and, gt, desc } from "drizzle-orm";
import { verifyPassword } from "./hash";
import { createSession, destroySession } from "./session";
import { loginSchema, type LoginInput } from "../lib/validations";
import { ar } from "../i18n/ar";

const MAX_FAILED_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

async function getClientIp(customHeaders?: Headers): Promise<string> {
  try {
    const headerList = customHeaders || (await headers());
    const realIp = headerList.get("x-real-ip");
    if (realIp) {
      return realIp.trim();
    }
    const forwardedFor = headerList.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    return "127.0.0.1";
  } catch {
    return "127.0.0.1";
  }
}

async function isRateLimited(ip: string): Promise<boolean> {
  try {
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
  } catch (err) {
    console.error("Rate limiting check failed (proceeding):", err);
    return false;
  }
}

async function recordAttempt(ip: string, success: boolean): Promise<void> {
  try {
    await db.insert(loginAttempts).values({
      id: crypto.randomUUID(),
      ipAddress: ip,
      attemptedAt: new Date(),
      success: success,
    });
  } catch (err) {
    console.error("Failed to record login attempt:", err);
  }
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

  const expectedUsername = (process.env.ADMIN_USERNAME || "fares")
    .trim()
    .replace(/^["']|["']$/g, "")
    .toLowerCase();
  const rawHash = (process.env.ADMIN_PASSWORD_HASH || "").trim();

  if (input.username.trim().toLowerCase() !== expectedUsername) {
    console.warn(`[AUTH] Username mismatch: provided '${input.username.trim().toLowerCase()}' vs expected '${expectedUsername}'`);
    await recordAttempt(ip, false);
    return { success: false, error: ar.auth.invalidCredentials };
  }

  const isValid = await verifyPassword(input.password, rawHash);
  if (!isValid) {
    console.warn(`[AUTH] Password verification failed. Hash configured length: ${rawHash.length}, prefix: ${rawHash.slice(0, 7)}`);
    await recordAttempt(ip, false);
    return { success: false, error: ar.auth.invalidCredentials };
  }

  // Success: clear failed login attempts for this IP
  try {
    await db
      .delete(loginAttempts)
      .where(
        and(
          eq(loginAttempts.ipAddress, ip),
          eq(loginAttempts.success, false)
        )
      );
  } catch (err) {
    console.error("Failed to clear failed login attempts:", err);
  }

  await recordAttempt(ip, true);
  await createSession();

  return { success: true };
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/login");
}
