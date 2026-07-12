import { NextResponse } from "next/server";
import {
  authenticateAdmin,
  createSessionToken,
  getSessionCookieName,
  getSessionMaxAgeSeconds,
} from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: "База данных не настроена." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as LoginPayload;
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { ok: false, error: "Введите email и пароль." },
      { status: 400 },
    );
  }

  try {
    const session = await authenticateAdmin(email, password);

    if (!session) {
      return NextResponse.json(
        { ok: false, error: "Неверный email или пароль." },
        { status: 401 },
      );
    }

    const token = await createSessionToken(session);
    const response = NextResponse.json({ ok: true });

    response.cookies.set(getSessionCookieName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: getSessionMaxAgeSeconds(),
    });

    return response;
  } catch (error) {
    console.error("Admin login failed", error);

    return NextResponse.json(
      { ok: false, error: "Не удалось выполнить вход." },
      { status: 500 },
    );
  }
}
