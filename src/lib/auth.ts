import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import {
  createSessionToken,
  getSessionCookieName,
  getSessionMaxAgeSeconds,
  verifySessionToken,
  type AdminSession,
} from "@/lib/auth-session";
import { ensureDatabaseReady, getPool, isDatabaseConfigured } from "@/lib/db";

export type { AdminSession };

export {
  createSessionToken,
  getSessionCookieName,
  getSessionMaxAgeSeconds,
  verifySessionToken,
};

export async function authenticateAdmin(email: string, password: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database is not configured");
  }

  await ensureDatabaseReady();

  const normalizedEmail = email.trim().toLowerCase();
  const pool = getPool();
  const result = await pool.query<{
    id: number;
    email: string;
    password_hash: string;
  }>("SELECT id, email, password_hash FROM admins WHERE email = $1 LIMIT 1", [
    normalizedEmail,
  ]);

  const admin = result.rows[0];

  if (!admin) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.password_hash);

  if (!isValid) {
    return null;
  }

  return {
    adminId: admin.id,
    email: admin.email,
  } satisfies AdminSession;
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getSessionCookieName())?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}
