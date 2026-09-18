import crypto from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { db } from "../data/db";
import { sessions } from "../data/schema";
import { eq, and, gt } from "drizzle-orm";

const COOKIE_NAME = "fares_hub_session";
const SESSION_DURATION_DAYS = 14;
const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

function hashToken(token: string): string {
  if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be set in production");
  }
  const secret = process.env.SESSION_SECRET || "default_dev_secret_fares_hub_min32chars";
  return crypto.createHmac("sha256", secret).update(token).digest("hex");
}

/**
 * Creates a new session in DB and sets an HTTP-only cookie.
 */
export async function createSession(): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHashed = hashToken(rawToken);
  const sessionId = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

  await db.insert(sessions).values({
    id: sessionId,
    tokenHash: tokenHashed,
    createdAt: now,
    expiresAt: expiresAt,
  });

  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, `${sessionId}:${rawToken}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });
  } catch {
    // In standalone test environments, cookies() is not available
  }

  return sessionId;
}

/**
 * Validates the session from the cookie and implements sliding window renewal.
 * Memoized per request using React cache().
 */
export const validateSession = cache(async function validateSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;

  if (!sessionCookie || !sessionCookie.includes(":")) {
    return false;
  }

  const [sessionId, rawToken] = sessionCookie.split(":");
  if (!sessionId || !rawToken) return false;

  const tokenHashed = hashToken(rawToken);
  const now = new Date();

  // Look up session in DB where id matches and expiresAt > now
  const existing = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, sessionId), gt(sessions.expiresAt, now)))
    .limit(1);

  if (existing.length === 0) {
    return false;
  }

  const session = existing[0];
  const hashA = Buffer.from(session.tokenHash, "hex");
  const hashB = Buffer.from(tokenHashed, "hex");
  if (hashA.length !== hashB.length || !crypto.timingSafeEqual(hashA, hashB)) {
    return false;
  }

  // Sliding window: only extend expiration if less than 7 days remaining
  const remainingLifetimeMs = session.expiresAt.getTime() - now.getTime();
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  if (remainingLifetimeMs < SEVEN_DAYS_MS) {
    const newExpiresAt = new Date(now.getTime() + SESSION_DURATION_MS);
    await db
      .update(sessions)
      .set({ expiresAt: newExpiresAt })
      .where(eq(sessions.id, sessionId));

    // Update cookie expiry if in a context allowing cookie mutation (Server Action / Route Handler)
    try {
      cookieStore.set(COOKIE_NAME, sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: newExpiresAt,
      });
    } catch {
      // Read-only context (Server Component layout/page); DB session expiry was already extended
    }
  }

  return true;
});

/**
 * Destroys the current session from DB and deletes the cookie.
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;

  if (sessionCookie && sessionCookie.includes(":")) {
    const [sessionId] = sessionCookie.split(":");
    if (sessionId) {
      await db.delete(sessions).where(eq(sessions.id, sessionId)).catch(() => {});
    }
  }

  cookieStore.delete(COOKIE_NAME);
}
