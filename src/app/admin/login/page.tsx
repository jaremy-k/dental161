import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Вход в админ-панель",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium text-accent">DentalCare Admin</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Вход</h1>
        <p className="mt-2 text-sm text-slate-600">
          Авторизуйтесь, чтобы просматривать заявки с сайта.
        </p>
        <AdminLoginForm
          nextPath={params.next || "/admin"}
          initialError={params.error}
        />
      </div>
    </div>
  );
}
