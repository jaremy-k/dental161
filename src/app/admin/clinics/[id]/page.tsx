import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ClinicForm } from "@/components/admin/ClinicForm";
import { getSessionFromCookies } from "@/lib/auth";
import { getAdminClinicById } from "@/lib/repositories/clinics";

export const metadata: Metadata = {
  title: "Редактирование клиники — админ-панель",
  robots: { index: false, follow: false },
};

type AdminClinicEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminClinicEditPage({
  params,
}: AdminClinicEditPageProps) {
  const session = await getSessionFromCookies();
  const { id } = await params;

  if (id === "new") {
    return (
      <AdminShell title="Новая клиника" email={session?.email}>
        <ClinicForm />
      </AdminShell>
    );
  }

  const clinicId = Number(id);
  if (!Number.isFinite(clinicId)) {
    notFound();
  }

  const clinic = await getAdminClinicById(clinicId);
  if (!clinic) {
    notFound();
  }

  return (
    <AdminShell title="Редактирование клиники" email={session?.email}>
      <ClinicForm clinic={clinic} />
    </AdminShell>
  );
}
