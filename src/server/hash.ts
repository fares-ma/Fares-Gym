import bcrypt from "bcryptjs";

/**
 * Verifies a plain text password against a bcrypt hash.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!password || !storedHash) return false;

  try {
    if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") || storedHash.startsWith("$2y$")) {
      return await bcrypt.compare(password, storedHash);
    }
    return false;
  } catch (err) {
    console.error("Password verification error:", err);
    return false;
  }
}

/**
 * Hashes a password using bcrypt (cost factor 12).
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}
