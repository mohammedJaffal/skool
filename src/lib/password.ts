import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, encoded: string) {
  const [salt, stored] = encoded.split(":");

  if (!salt || !stored) {
    return false;
  }

  const hashedBuffer = scryptSync(password, salt, KEY_LENGTH);
  const storedBuffer = Buffer.from(stored, "hex");

  if (storedBuffer.length !== hashedBuffer.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, hashedBuffer);
}
