CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service TEXT NOT NULL DEFAULT 'Не указано',
  clinic TEXT NOT NULL DEFAULT 'Любая удобная',
  preferred_time TEXT NOT NULL DEFAULT 'Не указано',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);

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
);

CREATE UNIQUE INDEX IF NOT EXISTS clinics_slug_active_idx
  ON clinics (slug)
  WHERE deleted_at IS NULL;

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
);

CREATE UNIQUE INDEX IF NOT EXISTS doctors_slug_active_idx
  ON doctors (slug)
  WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS price_versions (
  id SERIAL PRIMARY KEY,
  version_number INT NOT NULL UNIQUE,
  label TEXT,
  data JSONB NOT NULL,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS price_versions_published_idx
  ON price_versions (is_published, published_at DESC);
