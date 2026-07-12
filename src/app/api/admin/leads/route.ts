import { NextResponse } from "next/server";
import { getSessionFromCookies } from "@/lib/auth";
import { listLeads } from "@/lib/leads";

export async function GET() {
  const session = await getSessionFromCookies();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const leads = await listLeads();

  return NextResponse.json({ ok: true, leads });
}
