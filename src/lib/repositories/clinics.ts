import { ensureDatabaseReady, getPool, isDatabaseConfigured } from "@/lib/db";
import type { Clinic, ClinicInput } from "@/lib/content/types";
import { site } from "@/lib/site";

type ClinicRow = {
  id: number;
  slug: string;
  title: string;
  address: string;
  phone: string;
  phone_display: string;
  legal_entity_id: string;
  map_href: string;
  map_links: MapLinkRow[] | string;
  sort_order: number;
  deleted_at: Date | null;
};

type MapLinkRow = {
  label: string;
  href: string;
};

function mapRow(row: ClinicRow): Clinic {
  const mapLinks =
    typeof row.map_links === "string"
      ? (JSON.parse(row.map_links) as MapLinkRow[])
      : row.map_links;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    address: row.address,
    phone: row.phone,
    phoneDisplay: row.phone_display,
    legalEntityId: row.legal_entity_id,
    mapHref: row.map_href,
    mapLinks,
    sortOrder: row.sort_order,
    deletedAt: row.deleted_at?.toISOString() ?? null,
  };
}

function getStaticClinics(): Clinic[] {
  return site.locations.map((location, index) => ({
    slug: location.slug,
    title: location.title,
    address: location.address,
    phone: location.phone,
    phoneDisplay: location.phoneDisplay,
    legalEntityId: location.legalEntityId,
    mapHref: location.mapHref,
    mapLinks: [...location.mapLinks],
    sortOrder: index,
    deletedAt: null,
  }));
}

async function queryClinics(includeDeleted: boolean) {
  await ensureDatabaseReady();

  const pool = getPool();
  const result = await pool.query<ClinicRow>(
    `
      SELECT
        id, slug, title, address, phone, phone_display, legal_entity_id,
        map_href, map_links, sort_order, deleted_at
      FROM clinics
      ${includeDeleted ? "" : "WHERE deleted_at IS NULL"}
      ORDER BY sort_order ASC, id ASC
    `,
  );

  return result.rows.map(mapRow);
}

export async function getPublicClinics() {
  if (!isDatabaseConfigured()) {
    return getStaticClinics();
  }

  try {
    const clinics = await queryClinics(false);
    return clinics.length > 0 ? clinics : getStaticClinics();
  } catch (error) {
    console.error("Failed to load clinics from database", error);
    return getStaticClinics();
  }
}

export async function getClinicBySlug(slug: string) {
  const clinics = await getPublicClinics();
  return clinics.find((clinic) => clinic.slug === slug) ?? null;
}

export async function listAdminClinics(includeDeleted = true) {
  if (!isDatabaseConfigured()) {
    return getStaticClinics();
  }

  await ensureDatabaseReady();
  return queryClinics(includeDeleted);
}

export async function getAdminClinicById(id: number) {
  await ensureDatabaseReady();

  const pool = getPool();
  const result = await pool.query<ClinicRow>(
    `
      SELECT
        id, slug, title, address, phone, phone_display, legal_entity_id,
        map_href, map_links, sort_order, deleted_at
      FROM clinics
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  const row = result.rows[0];
  return row ? mapRow(row) : null;
}

export async function createClinic(input: ClinicInput) {
  await ensureDatabaseReady();

  const pool = getPool();
  const result = await pool.query<{ id: number }>(
    `
      INSERT INTO clinics (
        slug, title, address, phone, phone_display, legal_entity_id,
        map_href, map_links, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `,
    [
      input.slug,
      input.title,
      input.address,
      input.phone,
      input.phoneDisplay,
      input.legalEntityId,
      input.mapHref,
      JSON.stringify(input.mapLinks),
      input.sortOrder ?? 0,
    ],
  );

  return result.rows[0].id;
}

export async function updateClinic(id: number, input: ClinicInput) {
  await ensureDatabaseReady();

  const pool = getPool();
  await pool.query(
    `
      UPDATE clinics
      SET
        slug = $2,
        title = $3,
        address = $4,
        phone = $5,
        phone_display = $6,
        legal_entity_id = $7,
        map_href = $8,
        map_links = $9,
        sort_order = $10,
        updated_at = NOW()
      WHERE id = $1
    `,
    [
      id,
      input.slug,
      input.title,
      input.address,
      input.phone,
      input.phoneDisplay,
      input.legalEntityId,
      input.mapHref,
      JSON.stringify(input.mapLinks),
      input.sortOrder ?? 0,
    ],
  );
}

export async function softDeleteClinic(id: number) {
  await ensureDatabaseReady();

  const pool = getPool();
  await pool.query(
    "UPDATE clinics SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1",
    [id],
  );
}

export async function restoreClinic(id: number) {
  await ensureDatabaseReady();

  const pool = getPool();
  await pool.query(
    "UPDATE clinics SET deleted_at = NULL, updated_at = NOW() WHERE id = $1",
    [id],
  );
}
