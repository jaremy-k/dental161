import { doctors as defaultDoctors } from "@/lib/doctors";
import { getDefaultPriceCatalog } from "@/lib/prices";
import { site } from "@/lib/site";
import { getPool } from "@/lib/db";
import type { Clinic, Doctor, PriceCatalog } from "@/lib/content/types";

function mapClinicFromSite(location: (typeof site.locations)[number]): Clinic {
  return {
    slug: location.slug,
    title: location.title,
    address: location.address,
    phone: location.phone,
    phoneDisplay: location.phoneDisplay,
    legalEntityId: location.legalEntityId,
    mapHref: location.mapHref,
    mapLinks: [...location.mapLinks],
    sortOrder: 0,
  };
}

export async function seedContentIfEmpty() {
  const pool = getPool();

  const clinicsCount = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM clinics",
  );
  const doctorsCount = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM doctors",
  );
  const pricesCount = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM price_versions",
  );

  if (Number(clinicsCount.rows[0]?.count ?? 0) === 0) {
    for (const [index, location] of site.locations.entries()) {
      const clinic = mapClinicFromSite(location);
      await pool.query(
        `
          INSERT INTO clinics (
            slug, title, address, phone, phone_display, legal_entity_id,
            map_href, map_links, sort_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [
          clinic.slug,
          clinic.title,
          clinic.address,
          clinic.phone,
          clinic.phoneDisplay,
          clinic.legalEntityId,
          clinic.mapHref,
          JSON.stringify(clinic.mapLinks),
          index,
        ],
      );
    }
  }

  if (Number(doctorsCount.rows[0]?.count ?? 0) === 0) {
    for (const [index, doctor] of defaultDoctors.entries()) {
      await pool.query(
        `
          INSERT INTO doctors (
            slug, name, role, experience, focus, location_label,
            location_ids, image, sort_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
        [
          doctor.slug,
          doctor.name,
          doctor.role,
          doctor.experience,
          JSON.stringify(doctor.focus),
          doctor.location,
          JSON.stringify(doctor.locationIds),
          doctor.image,
          index,
        ],
      );
    }
  }

  if (Number(pricesCount.rows[0]?.count ?? 0) === 0) {
    const catalog = getDefaultPriceCatalog();
    await pool.query(
      `
        INSERT INTO price_versions (
          version_number, label, data, is_published, published_at
        ) VALUES (1, 'Начальная версия', $1, true, NOW())
      `,
      [JSON.stringify(catalog)],
    );
  }
}

export async function publishPriceCatalog(
  catalog: PriceCatalog,
  createdBy: string | null,
  label?: string,
) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const nextVersion = await client.query<{ next: number }>(
      "SELECT COALESCE(MAX(version_number), 0) + 1 AS next FROM price_versions",
    );
    const versionNumber = nextVersion.rows[0]?.next ?? 1;

    await client.query(
      "UPDATE price_versions SET is_published = false, published_at = NULL WHERE is_published = true",
    );

    const result = await client.query<{ id: number }>(
      `
        INSERT INTO price_versions (
          version_number, label, data, is_published, created_by, published_at
        ) VALUES ($1, $2, $3, true, $4, NOW())
        RETURNING id
      `,
      [
        versionNumber,
        label || `Версия ${versionNumber}`,
        JSON.stringify(catalog),
        createdBy,
      ],
    );

    await client.query("COMMIT");
    return versionNumber;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function savePriceDraft(
  catalog: PriceCatalog,
  createdBy: string | null,
  label?: string,
) {
  const pool = getPool();
  const nextVersion = await pool.query<{ next: number }>(
    "SELECT COALESCE(MAX(version_number), 0) + 1 AS next FROM price_versions",
  );
  const versionNumber = nextVersion.rows[0]?.next ?? 1;

  const result = await pool.query<{ id: number }>(
    `
      INSERT INTO price_versions (
        version_number, label, data, is_published, created_by
      ) VALUES ($1, $2, $3, false, $4)
      RETURNING id
    `,
    [
      versionNumber,
      label || `Черновик ${versionNumber}`,
      JSON.stringify(catalog),
      createdBy,
    ],
  );

  return {
    id: result.rows[0].id,
    versionNumber,
  };
}
