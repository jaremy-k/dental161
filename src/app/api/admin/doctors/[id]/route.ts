import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/require-admin";
import type { DoctorInput } from "@/lib/content/types";
import {
  getAdminDoctorById,
  restoreDoctor,
  softDeleteDoctor,
  updateDoctor,
} from "@/lib/repositories/doctors";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const { id } = await context.params;
  const doctor = await getAdminDoctorById(Number(id));

  if (!doctor) {
    return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, doctor });
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const { id } = await context.params;
  const doctorId = Number(id);
  const body = (await request.json().catch(() => ({}))) as Partial<DoctorInput>;

  if (!body.slug || !body.name || !body.role || !body.experience || !body.image) {
    return NextResponse.json(
      { ok: false, error: "Заполните обязательные поля." },
      { status: 400 },
    );
  }

  try {
    await updateDoctor(doctorId, {
      slug: body.slug,
      name: body.name,
      role: body.role,
      experience: body.experience,
      focus: body.focus ?? [],
      location: body.location ?? "",
      locationIds: body.locationIds ?? [],
      image: body.image,
      sortOrder: body.sortOrder ?? 0,
    });

    revalidatePath("/");
    revalidatePath("/o-nas");
    revalidatePath("/clinics");
    revalidatePath("/admin/doctors");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Update doctor failed", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось обновить врача." },
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
    await softDeleteDoctor(Number(id));
    revalidatePath("/");
    revalidatePath("/o-nas");
    revalidatePath("/clinics");
    revalidatePath("/admin/doctors");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete doctor failed", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось удалить врача." },
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
    await restoreDoctor(Number(id));
    revalidatePath("/");
    revalidatePath("/o-nas");
    revalidatePath("/clinics");
    revalidatePath("/admin/doctors");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Restore doctor failed", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось восстановить врача." },
      { status: 500 },
    );
  }
}
