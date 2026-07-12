import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/require-admin";
import type { ClinicInput } from "@/lib/content/types";
import {
  createClinic,
  listAdminClinics,
} from "@/lib/repositories/clinics";

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const clinics = await listAdminClinics(true);
  return NextResponse.json({ ok: true, clinics });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const body = (await request.json().catch(() => ({}))) as Partial<ClinicInput>;

  if (
    !body.slug ||
    !body.title ||
    !body.address ||
    !body.phone ||
    !body.phoneDisplay ||
    !body.legalEntityId
  ) {
    return NextResponse.json(
      { ok: false, error: "Заполните обязательные поля." },
      { status: 400 },
    );
  }

  try {
    const id = await createClinic({
      slug: body.slug,
      title: body.title,
      address: body.address,
      phone: body.phone,
      phoneDisplay: body.phoneDisplay,
      legalEntityId: body.legalEntityId,
      mapHref: body.mapHref ?? "",
      mapLinks: body.mapLinks ?? [],
      sortOrder: body.sortOrder ?? 0,
    });

    revalidatePath("/");
    revalidatePath("/clinics");
    revalidatePath("/o-nas");
    revalidatePath("/admin/clinics");

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error("Create clinic failed", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось создать клинику." },
      { status: 500 },
    );
  }
}
