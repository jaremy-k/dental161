import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/require-admin";
import type { ClinicInput } from "@/lib/content/types";
import {
  getAdminClinicById,
  restoreClinic,
  softDeleteClinic,
  updateClinic,
} from "@/lib/repositories/clinics";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const { id } = await context.params;
  const clinic = await getAdminClinicById(Number(id));

  if (!clinic) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, clinic });
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const { id } = await context.params;
  const clinicId = Number(id);
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
    await updateClinic(clinicId, {
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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update clinic failed", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось обновить клинику." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const { id } = await context.params;

  try {
    await softDeleteClinic(Number(id));
    revalidatePath("/");
    revalidatePath("/clinics");
    revalidatePath("/o-nas");
    revalidatePath("/admin/clinics");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete clinic failed", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось удалить клинику." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const body = (await request.json().catch(() => ({}))) as { action?: string };
  if (body.action !== "restore") {
    return NextResponse.json({ ok: false, error: "Invalid action" }, { status: 400 });
  }

  const { id } = await context.params;

  try {
    await restoreClinic(Number(id));
    revalidatePath("/");
    revalidatePath("/clinics");
    revalidatePath("/o-nas");
    revalidatePath("/admin/clinics");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Restore clinic failed", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось восстановить клинику." },
      { status: 500 },
    );
  }
}
