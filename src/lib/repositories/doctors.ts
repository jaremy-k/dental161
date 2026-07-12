import { ensureDatabaseReady, getPool, isDatabaseConfigured } from "@/lib/db";
import type { Doctor, DoctorInput } from "@/lib/content/types";
import { doctors as defaultDoctors } from "@/lib/doctors";

type DoctorRow = {
  id: number;
  slug: string;
  name: string;
  role: string;
  experience: string;
  focus: string[] | string;
  location_label: string;
  location_ids: string[] | string;
  image: string;
  sort_order: number;
  deleted_at: Date | null;
};

function mapRow(row: DoctorRow): Doctor {
  const focus =
    typeof row.focus === "string"
      ? (JSON.parse(row.focus) as string[])
      : row.focus;
  const locationIds =
    typeof row.location_ids === "string"
      ? (JSON.parse(row.location_ids) as string[])
      : row.location_ids;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    experience: row.experience,
    focus,
    location: row.location_label,
    locationIds,
    image: row.image,
    sortOrder: row.sort_order,
    deletedAt: row.deleted_at?.toISOString() ?? null,
  };
}

function getStaticDoctors(): Doctor[] {
  return defaultDoctors.map((doctor, index) => ({
    ...doctor,
    sortOrder: index,
    deletedAt: null,
  }));
}

async function queryDoctors(includeDeleted: boolean) {
  await ensureDatabaseReady();

  const pool = getPool();
  const result = await pool.query<DoctorRow>(
    `
      SELECT
        id, slug, name, role, experience, focus, location_label,
        location_ids, image, sort_order, deleted_at
      FROM doctors
      ${includeDeleted ? "" : "WHERE deleted_at IS NULL"}
      ORDER BY sort_order ASC, id ASC
    `,
  );

  return result.rows.map(mapRow);
}

export async function getPublicDoctors() {
  if (!isDatabaseConfigured()) {
    return getStaticDoctors();
  }

  try {
    const doctors = await queryDoctors(false);
    return doctors.length > 0 ? doctors : getStaticDoctors();
  } catch (error) {
    console.error("Failed to load doctors from database", error);
    return getStaticDoctors();
  }
}

export async function getDoctorsByLocationSlug(slug: string) {
  const doctors = await getPublicDoctors();
  return doctors.filter((doctor) => doctor.locationIds.includes(slug));
}

export async function listAdminDoctors(includeDeleted = true) {
  if (!isDatabaseConfigured()) {
    return getStaticDoctors();
  }

  await ensureDatabaseReady();
  return queryDoctors(includeDeleted);
}

export async function getAdminDoctorById(id: number) {
  await ensureDatabaseReady();

  const pool = getPool();
  const result = await pool.query<DoctorRow>(
    `
      SELECT
        id, slug, name, role, experience, focus, location_label,
        location_ids, image, sort_order, deleted_at
      FROM doctors
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  const row = result.rows[0];
  return row ? mapRow(row) : null;
}

export async function createDoctor(input: DoctorInput) {
  await ensureDatabaseReady();

  const pool = getPool();
  const result = await pool.query<{ id: number }>(
    `
      INSERT INTO doctors (
        slug, name, role, experience, focus, location_label,
        location_ids, image, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `,
    [
      input.slug,
      input.name,
      input.role,
      input.experience,
      JSON.stringify(input.focus),
      input.location,
      JSON.stringify(input.locationIds),
      input.image,
      input.sortOrder ?? 0,
    ],
  );

  return result.rows[0].id;
}

export async function updateDoctor(id: number, input: DoctorInput) {
  await ensureDatabaseReady();

  const pool = getPool();
  await pool.query(
    `
      UPDATE doctors
      SET
        slug = $2,
        name = $3,
        role = $4,
        experience = $5,
        focus = $6,
        location_label = $7,
        location_ids = $8,
        image = $9,
        sort_order = $10,
        updated_at = NOW()
      WHERE id = $1
    `,
    [
      id,
      input.slug,
      input.name,
      input.role,
      input.experience,
      JSON.stringify(input.focus),
      input.location,
      JSON.stringify(input.locationIds),
      input.image,
      input.sortOrder ?? 0,
    ],
  );
}

export async function softDeleteDoctor(id: number) {
  await ensureDatabaseReady();

  const pool = getPool();
  await pool.query(
    "UPDATE doctors SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1",
    [id],
  );
}

export async function restoreDoctor(id: number) {
  await ensureDatabaseReady();

  const pool = getPool();
  await pool.query(
    "UPDATE doctors SET deleted_at = NULL, updated_at = NOW() WHERE id = $1",
    [id],
  );
}
