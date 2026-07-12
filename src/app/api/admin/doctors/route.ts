import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/require-admin";
import type { DoctorInput } from "@/lib/content/types";
import {
  createDoctor,
  listAdminDoctors,
} from "@/lib/repositories/doctors";

export async function GET() {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const doctors = await listAdminDoctors(true);
  return NextResponse.json({ ok: true, doctors });
}

export async function POST(request: Request) {
  const auth = await requireAdminSession();
  if (auth.response) {
    return auth.response;
  }

  const body = (await request.json().catch(() => ({}))) as Partial<DoctorInput>;

  if (!body.slug || !body.name || !body.role || !body.experience || !body.image) {
    return NextResponse.json(
      { ok: false, error: "Заполните обязательные поля." },
      { status: 400 },
    );
  }

  try {
    const id = await createDoctor({
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

    return NextResponse.json({ ok: true, id });
  } catch (error) {
    console.error("Create doctor failed", error);
    return NextResponse.json(
      { ok: false, error: "Не удалось создать врача." },
      { status: 500 },
    );
  }
}
