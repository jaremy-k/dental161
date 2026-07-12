import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/require-admin";
import type { PriceCatalog } from "@/lib/content/types";
import {
  createAndPublishPriceVersion,
  createPriceDraftVersion,
  getPublishedPriceCatalog,
  listPriceVersions,
} from "@/lib/repositories/prices";

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const [catalog, versions] = await Promise.all([
    getPublishedPriceCatalog(),
    listPriceVersions(),
  ]);

  return NextResponse.json({ ok: true, catalog, versions });
}

type SavePayload = {
  catalog?: PriceCatalog;
  publish?: boolean;
  label?: string;
};

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const body = (await request.json().catch(() => ({}))) as SavePayload;

  if (!body.catalog) {
    return NextResponse.json(
      { ok: false, error: "Не переданы данные прайса." },
      { status: 400 },
    );
  }

  try {
    if (body.publish) {
      const versionNumber = await createAndPublishPriceVersion(
        body.catalog,
        auth.session!.email,
        body.label,
      );

      revalidatePath("/");
      revalidatePath("/price");
      revalidatePath("/services");
      revalidatePath("/admin/prices");

      return NextResponse.json({ ok: true, versionNumber, published: true });
    }

    const draft = await createPriceDraftVersion(
      body.catalog,
      auth.session!.email,
      body.label,
    );

    revalidatePath("/admin/prices");

    return NextResponse.json({ ok: true, ...draft, published: false });
  } catch (error) {
    console.error("Save price version failed", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось сохранить прайс." },
      { status: 500 },
    );
  }
}
