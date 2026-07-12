function parseSecureEnv(value: string | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "true") {
    return true;
  }
  if (normalized === "false") {
    return false;
  }

  return null;
}

export function shouldUseSecureCookies(request?: Request) {
  const fromEnv = parseSecureEnv(process.env.COOKIE_SECURE);
  if (fromEnv !== null) {
    return fromEnv;
  }

  const forwardedProto = request?.headers.get("x-forwarded-proto");
  if (forwardedProto) {
    return forwardedProto.split(",")[0]?.trim() === "https";
  }

  // Без HTTPS не ставим Secure — иначе cookie не сохранится (например, IP:3000).
  return false;
}

export function getSessionCookieBaseOptions(request?: Request) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: shouldUseSecureCookies(request),
    path: "/",
  };
}
