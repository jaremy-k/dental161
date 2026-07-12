"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Clinic } from "@/lib/content/types";

type AdminClinicsTableProps = {
  clinics: Clinic[];
};

export function AdminClinicsTable({ clinics }: AdminClinicsTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleAction(id: number, action: "delete" | "restore") {
    setLoadingId(id);
    setError("");

    const response = await fetch(`/api/admin/clinics/${id}`, {
      method: action === "delete" ? "DELETE" : "POST",
      headers: { "Content-Type": "application/json" },
      body: action === "restore" ? JSON.stringify({ action: "restore" }) : undefined,
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Не удалось выполнить действие");
      setLoadingId(null);
      return;
    }

    router.refresh();
    setLoadingId(null);
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Название</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Адрес</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Телефон</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Статус</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clinics.map((clinic) => (
                <tr key={clinic.id ?? clinic.slug} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-900">{clinic.title}</td>
                  <td className="px-4 py-3 text-slate-700">{clinic.address}</td>
                  <td className="px-4 py-3 text-slate-700">{clinic.phoneDisplay}</td>
                  <td className="px-4 py-3">
                    {clinic.deletedAt ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Удалена
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Активна
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {clinic.id && (
                        <>
                          <Link
                            href={`/admin/clinics/${clinic.id}`}
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-accent hover:text-accent"
                          >
                            Изменить
                          </Link>
                          {clinic.deletedAt ? (
                            <button
                              type="button"
                              disabled={loadingId === clinic.id}
                              onClick={() => handleAction(clinic.id!, "restore")}
                              className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                              Восстановить
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={loadingId === clinic.id}
                              onClick={() => handleAction(clinic.id!, "delete")}
                              className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                              Удалить
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
