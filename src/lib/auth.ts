import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { ensureDatabaseReady, getPool, isDatabaseConfigured } from "@/lib/db";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL = "7d";

export type AdminSession = {
  adminId: number;
  email: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  return new TextEncoder().encode(secret);
}

export async function authenticateAdmin(email: string, password: string) {
  if (!isDatabaseConfigured()) {
    throw new Error("Database is not configured");
  }

  await ensureDatabaseReady();

  const normalizedEmail = email.trim().toLowerCase();
  const pool = getPool();
  const result = await pool.query<{ id: number; email: string; password_hash: string }>(
    "SELECT id, email, password_hash FROM admins WHERE email = $1 LIMIT 1",
    [normalizedEmail],
  );

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

export async function createSessionToken(session: AdminSession) {
  return new SignJWT({
    adminId: session.adminId,
    email: session.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_TTL)
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    if (
      typeof payload.adminId !== "number" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }

    return {
      adminId: payload.adminId,
      email: payload.email,
    } satisfies AdminSession;
  } catch {
    return null;
  }
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getSessionMaxAgeSeconds() {
  return 60 * 60 * 24 * 7;
}
