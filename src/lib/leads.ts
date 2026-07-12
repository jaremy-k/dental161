import { ensureDatabaseReady, getPool, isDatabaseConfigured } from "@/lib/db";

export type LeadInput = {
  name: string;
  phone: string;
  service: string;
  clinic: string;
  preferredTime: string;
};

export type LeadRecord = LeadInput & {
  id: number;
  createdAt: string;
};

export async function saveLead(lead: LeadInput) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  await ensureDatabaseReady();

  const pool = getPool();
  const result = await pool.query<{ id: number; created_at: Date }>(
    `
      INSERT INTO leads (name, phone, service, clinic, preferred_time)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at
    `,
    [lead.name, lead.phone, lead.service, lead.clinic, lead.preferredTime],
  );

  const row = result.rows[0];

  return {
    id: row.id,
    createdAt: row.created_at.toISOString(),
  };
}

export async function listLeads(limit = 100) {
  if (!isDatabaseConfigured()) {
    return [];
  }

  await ensureDatabaseReady();

  const pool = getPool();
  const result = await pool.query<{
    id: number;
    name: string;
    phone: string;
    service: string;
    clinic: string;
    preferred_time: string;
    created_at: Date;
  }>(
    `
      SELECT id, name, phone, service, clinic, preferred_time, created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit],
  );

  return result.rows.map(
    (row): LeadRecord => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      service: row.service,
      clinic: row.clinic,
      preferredTime: row.preferred_time,
      createdAt: row.created_at.toISOString(),
    }),
  );
}
