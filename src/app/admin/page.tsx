import type { Metadata } from "next";
import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { getSessionFromCookies } from "@/lib/auth";
import { listLeads } from "@/lib/leads";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Админ-панель",
  robots: {
    index: false,
    follow: false,
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminPage() {
  const session = await getSessionFromCookies();
  const leads = await listLeads();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-sm font-medium text-accent">DentalCare Admin</p>
            <h1 className="text-xl font-bold text-slate-900">Заявки с сайта</h1>
            {session && (
              <p className="mt-1 text-sm text-slate-500">{session.email}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent hover:text-accent"
            >
              На сайт
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">
            Всего заявок:{" "}
            <span className="font-semibold text-slate-900">{leads.length}</span>
          </p>
        </div>

        {leads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-lg font-semibold text-slate-900">
              Заявок пока нет
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Новые обращения с формы на {site.url.replace("https://", "")}{" "}
              появятся здесь автоматически.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Дата
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Имя
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Телефон
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Услуга
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Клиника
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">
                      Время
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80">
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {lead.name}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <a
                          href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}
                          className="font-medium text-accent hover:text-accent-dark"
                        >
                          {lead.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {lead.service}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{lead.clinic}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {lead.preferredTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
