import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await getSessionFromCookies();

  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { session, response: null };
}
