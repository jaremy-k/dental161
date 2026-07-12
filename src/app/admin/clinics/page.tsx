import Link from "next/link";
import type { Metadata } from "next";
import { AdminClinicsTable } from "@/components/admin/AdminClinicsTable";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSessionFromCookies } from "@/lib/auth";
import { listAdminClinics } from "@/lib/repositories/clinics";

export const metadata: Metadata = {
  title: "Клиники — админ-панель",
  robots: { index: false, follow: false },
};

export default async function AdminClinicsPage() {
  const session = await getSessionFromCookies();
  const clinics = await listAdminClinics(true);

  return (
    <AdminShell title="Клиники" email={session?.email}>
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/clinics/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          Добавить клинику
        </Link>
      </div>
      <AdminClinicsTable clinics={clinics} />
    </AdminShell>
  );
}
