import Link from "next/link";
import type { Metadata } from "next";
import { AdminDoctorsTable } from "@/components/admin/AdminDoctorsTable";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSessionFromCookies } from "@/lib/auth";
import { listAdminDoctors } from "@/lib/repositories/doctors";

export const metadata: Metadata = {
  title: "Врачи — админ-панель",
  robots: { index: false, follow: false },
};

export default async function AdminDoctorsPage() {
  const session = await getSessionFromCookies();
  const doctors = await listAdminDoctors(true);

  return (
    <AdminShell title="Врачи" email={session?.email}>
      <div className="mb-6 flex justify-end">
        <Link
          href="/admin/doctors/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-dark"
        >
          Добавить врача
        </Link>
      </div>
      <AdminDoctorsTable doctors={doctors} />
    </AdminShell>
  );
}
