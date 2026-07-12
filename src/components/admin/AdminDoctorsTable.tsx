"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Doctor } from "@/lib/content/types";

type AdminDoctorsTableProps = {
  doctors: Doctor[];
};

export function AdminDoctorsTable({ doctors }: AdminDoctorsTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function handleAction(id: number, action: "delete" | "restore") {
    setLoadingId(id);
    setError("");

    const response = await fetch(`/api/admin/doctors/${id}`, {
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
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Имя</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Должность</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Приём</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Статус</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors.map((doctor) => (
                <tr key={doctor.id ?? doctor.slug} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-900">{doctor.name}</td>
                  <td className="px-4 py-3 text-slate-700">{doctor.role}</td>
                  <td className="px-4 py-3 text-slate-700">{doctor.location}</td>
                  <td className="px-4 py-3">
                    {doctor.deletedAt ? (
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        Удалён
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Активен
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {doctor.id && (
                        <>
                          <Link
                            href={`/admin/doctors/${doctor.id}`}
                            className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-accent hover:text-accent"
                          >
                            Изменить
                          </Link>
                          {doctor.deletedAt ? (
                            <button
                              type="button"
                              disabled={loadingId === doctor.id}
                              onClick={() => handleAction(doctor.id!, "restore")}
                              className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                            >
                              Восстановить
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={loadingId === doctor.id}
                              onClick={() => handleAction(doctor.id!, "delete")}
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
