import { NextResponse } from "next/server";
import { getSessionCookieName } from "@/lib/auth";
import { getSessionCookieBaseOptions } from "@/lib/cookie-options";

export async function POST(request: Request) {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(getSessionCookieName(), "", {
    ...getSessionCookieBaseOptions(request),
    maxAge: 0,
  });

  return response;
}
