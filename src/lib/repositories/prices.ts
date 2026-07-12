import { ensureDatabaseReady, getPool, isDatabaseConfigured } from "@/lib/db";
import {
  publishPriceCatalog,
  savePriceDraft,
  seedContentIfEmpty,
} from "@/lib/content/seed";
import type { PriceCatalog, PriceVersion } from "@/lib/content/types";
import { getDefaultPriceCatalog } from "@/lib/prices";

type PriceVersionRow = {
  id: number;
  version_number: number;
  label: string | null;
  data: PriceCatalog | string;
  is_published: boolean;
  created_by: string | null;
  created_at: Date;
  published_at: Date | null;
};

function mapVersion(row: PriceVersionRow): PriceVersion {
  const data =
    typeof row.data === "string"
      ? (JSON.parse(row.data) as PriceCatalog)
      : row.data;

  return {
    id: row.id,
    versionNumber: row.version_number,
    label: row.label,
    data,
    isPublished: row.is_published,
    createdBy: row.created_by,
    createdAt: row.created_at.toISOString(),
    publishedAt: row.published_at?.toISOString() ?? null,
  };
}

export async function getPublishedPriceCatalog(): Promise<PriceCatalog> {
  if (!isDatabaseConfigured()) {
    return getDefaultPriceCatalog();
  }

  try {
    await ensureDatabaseReady();
    await seedContentIfEmpty();

    const pool = getPool();
    const result = await pool.query<PriceVersionRow>(
      `
        SELECT
          id, version_number, label, data, is_published,
          created_by, created_at, published_at
        FROM price_versions
        WHERE is_published = true
        ORDER BY published_at DESC NULLS LAST, id DESC
        LIMIT 1
      `,
    );

    const row = result.rows[0];
    return row ? mapVersion(row).data : getDefaultPriceCatalog();
  } catch (error) {
    console.error("Failed to load prices from database", error);
    return getDefaultPriceCatalog();
  }
}

export async function listPriceVersions(): Promise<PriceVersion[]> {
  await ensureDatabaseReady();
  await seedContentIfEmpty();

  const pool = getPool();
  const result = await pool.query<PriceVersionRow>(
    `
      SELECT
        id, version_number, label, data, is_published,
        created_by, created_at, published_at
      FROM price_versions
      ORDER BY version_number DESC, id DESC
    `,
  );

  return result.rows.map(mapVersion);
}

export async function getPriceVersionById(id: number) {
  await ensureDatabaseReady();
  await seedContentIfEmpty();

  const pool = getPool();
  const result = await pool.query<PriceVersionRow>(
    `
      SELECT
        id, version_number, label, data, is_published,
        created_by, created_at, published_at
      FROM price_versions
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  const row = result.rows[0];
  return row ? mapVersion(row) : null;
}

export async function createAndPublishPriceVersion(
  catalog: PriceCatalog,
  createdBy: string | null,
  label?: string,
) {
  await ensureDatabaseReady();
  return publishPriceCatalog(catalog, createdBy, label);
}

export async function createPriceDraftVersion(
  catalog: PriceCatalog,
  createdBy: string | null,
  label?: string,
) {
  await ensureDatabaseReady();
  return savePriceDraft(catalog, createdBy, label);
}

export async function publishExistingPriceVersion(id: number) {
  await ensureDatabaseReady();

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const version = await client.query<{ data: PriceCatalog | string }>(
      "SELECT data FROM price_versions WHERE id = $1 LIMIT 1",
      [id],
    );

    if ((version.rowCount ?? 0) === 0) {
      throw new Error("Price version not found");
    }

    await client.query(
      "UPDATE price_versions SET is_published = false, published_at = NULL WHERE is_published = true",
    );

    await client.query(
      `
        UPDATE price_versions
        SET is_published = true, published_at = NOW()
        WHERE id = $1
      `,
      [id],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export function getRelatedPriceCategories(
  catalog: PriceCatalog,
  terms: string[],
) {
  const normalizedTerms = terms.map((term) => term.toLowerCase());

  return catalog.priceCategories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        normalizedTerms.some((term) =>
          `${category.title} ${item.name}`.toLowerCase().includes(term),
        ),
      ),
    }))
    .filter((category) => category.items.length > 0);
}
