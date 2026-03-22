import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * Hashes a plain-text string using bcrypt with a configurable salt.
 */
export async function generateHash(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plain, salt);
}

/**
 * Compares a plain-text string against a bcrypt hash.
 * Returns true if they match, false otherwise.
 */
export async function compareHash(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
