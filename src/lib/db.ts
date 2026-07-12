import { Pool } from "pg";

const globalForPg = globalThis as typeof globalThis & {
  pgPool?: Pool;
  pgReady?: Promise<void>;
};

function getDatabaseUrl() {
  return process.env.DATABASE_URL?.trim();
}

export function isDatabaseConfigured() {
  return Boolean(getDatabaseUrl());
}

export function getPool() {
  const connectionString = getDatabaseUrl();

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({ connectionString });
  }

  return globalForPg.pgPool;
}

async function ensureSchema() {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT NOT NULL DEFAULT 'Не указано',
      clinic TEXT NOT NULL DEFAULT 'Любая удобная',
      preferred_time TEXT NOT NULL DEFAULT 'Не указано',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC)
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS clinics (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      phone_display TEXT NOT NULL,
      legal_entity_id TEXT NOT NULL,
      map_href TEXT NOT NULL DEFAULT '',
      map_links JSONB NOT NULL DEFAULT '[]'::jsonb,
      sort_order INT NOT NULL DEFAULT 0,
      deleted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS clinics_slug_active_idx
    ON clinics (slug)
    WHERE deleted_at IS NULL
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS doctors (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      experience TEXT NOT NULL,
      focus JSONB NOT NULL DEFAULT '[]'::jsonb,
      location_label TEXT NOT NULL,
      location_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
      image TEXT NOT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      deleted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS doctors_slug_active_idx
    ON doctors (slug)
    WHERE deleted_at IS NULL
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS price_versions (
      id SERIAL PRIMARY KEY,
      version_number INT NOT NULL UNIQUE,
      label TEXT,
      data JSONB NOT NULL,
      is_published BOOLEAN NOT NULL DEFAULT false,
      created_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      published_at TIMESTAMPTZ
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS price_versions_published_idx
    ON price_versions (is_published, published_at DESC)
  `);
}

async function ensureDefaultAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!email || !password) {
    return;
  }

  const pool = getPool();
  const existing = await pool.query<{ id: number }>(
    "SELECT id FROM admins WHERE email = $1 LIMIT 1",
    [email],
  );

  if ((existing.rowCount ?? 0) > 0) {
    return;
  }

  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash(password, 12);

  await pool.query(
    "INSERT INTO admins (email, password_hash) VALUES ($1, $2)",
    [email, passwordHash],
  );
}

export async function ensureDatabaseReady() {
  if (!isDatabaseConfigured()) {
    return;
  }

  if (!globalForPg.pgReady) {
    globalForPg.pgReady = (async () => {
      await ensureSchema();
      await ensureDefaultAdmin();
      const { seedContentIfEmpty } = await import("@/lib/content/seed");
      await seedContentIfEmpty();
    })();
  }

  await globalForPg.pgReady;
}
