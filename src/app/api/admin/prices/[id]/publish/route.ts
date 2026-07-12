import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/require-admin";
import { publishExistingPriceVersion } from "@/lib/repositories/prices";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const { id } = await context.params;

  try {
    await publishExistingPriceVersion(Number(id));

    revalidatePath("/");
    revalidatePath("/price");
    revalidatePath("/services");
    revalidatePath("/admin/prices");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Publish price version failed", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось опубликовать версию." },
      { status: 500 },
    );
  }
}
