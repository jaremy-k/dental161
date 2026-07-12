import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSessionFromCookies } from "@/lib/auth";
import { listLeads } from "@/lib/leads";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Заявки — админ-панель",
  robots: { index: false, follow: false },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminLeadsPage() {
  const session = await getSessionFromCookies();
  const leads = await listLeads();

  return (
    <AdminShell title="Заявки с сайта" email={session?.email}>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-600">
          Всего заявок:{" "}
          <span className="font-semibold text-slate-900">{leads.length}</span>
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-slate-900">Заявок пока нет</p>
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
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Дата</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Имя</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Телефон</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Услуга</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Клиника</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Время</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">{lead.name}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <a
                        href={`tel:${lead.phone.replace(/[^\d+]/g, "")}`}
                        className="font-medium text-accent hover:text-accent-dark"
                      >
                        {lead.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{lead.service}</td>
                    <td className="px-4 py-3 text-slate-700">{lead.clinic}</td>
                    <td className="px-4 py-3 text-slate-700">{lead.preferredTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
