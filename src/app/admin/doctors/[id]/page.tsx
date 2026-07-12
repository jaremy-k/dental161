import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { DoctorForm } from "@/components/admin/DoctorForm";
import { getSessionFromCookies } from "@/lib/auth";
import { listAdminClinics } from "@/lib/repositories/clinics";
import { getAdminDoctorById } from "@/lib/repositories/doctors";

export const metadata: Metadata = {
  title: "Редактирование врача — админ-панель",
  robots: { index: false, follow: false },
};

type AdminDoctorEditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminDoctorEditPage({
  params,
}: AdminDoctorEditPageProps) {
  const session = await getSessionFromCookies();
  const { id } = await params;
  const clinics = await listAdminClinics(true);

  if (id === "new") {
    return (
      <AdminShell title="Новый врач" email={session?.email}>
        <DoctorForm clinics={clinics} />
      </AdminShell>
    );
  }

  const doctorId = Number(id);
  if (!Number.isFinite(doctorId)) {
    notFound();
  }

  const doctor = await getAdminDoctorById(doctorId);
  if (!doctor) {
    notFound();
  }

  return (
    <AdminShell title="Редактирование врача" email={session?.email}>
      <DoctorForm doctor={doctor} clinics={clinics} />
    </AdminShell>
  );
}
