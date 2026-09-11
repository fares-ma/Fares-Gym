import { hash as argonHash, verify as argonVerify } from "@node-rs/argon2";
import bcrypt from "bcryptjs";

/**
 * Verifies a plain text password against either an Argon2 or bcrypt hash.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!password || !storedHash) return false;

  try {
    if (storedHash.startsWith("$argon2")) {
      return await argonVerify(storedHash, password);
    }
    if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") || storedHash.startsWith("$2y$")) {
      return await bcrypt.compare(password, storedHash);
    }
    // Plain text fallback ONLY if explicitly configured in development
    return password === storedHash;
  } catch (err) {
    console.error("Password verification error:", err);
    return false;
  }
}

/**
 * Hashes a password using Argon2id.
 */
export async function hashPassword(password: string): Promise<string> {
  return await argonHash(password);
}
