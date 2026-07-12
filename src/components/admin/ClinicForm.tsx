"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Clinic } from "@/lib/content/types";
import { site } from "@/lib/site";

type ClinicFormProps = {
  clinic?: Clinic;
};

export function ClinicForm({ clinic }: ClinicFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    let mapLinks: { label: string; href: string }[] = [];

    try {
      mapLinks = JSON.parse(String(formData.get("mapLinks") || "[]")) as {
        label: string;
        href: string;
      }[];
    } catch {
      setError("Ссылки на карты должны быть в формате JSON");
      setLoading(false);
      return;
    }

    const payload = {
      slug: String(formData.get("slug") || "").trim(),
      title: String(formData.get("title") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      phoneDisplay: String(formData.get("phoneDisplay") || "").trim(),
      legalEntityId: String(formData.get("legalEntityId") || "").trim(),
      mapHref: String(formData.get("mapHref") || "").trim(),
      mapLinks,
      sortOrder: Number(formData.get("sortOrder") || 0),
    };

    const url = clinic?.id
      ? `/api/admin/clinics/${clinic.id}`
      : "/api/admin/clinics";
    const method = clinic?.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };

    if (!response.ok || !data.ok) {
      setError(data.error || "Не удалось сохранить клинику");
      setLoading(false);
      return;
    }

    router.push("/admin/clinics");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Slug</span>
          <input
            name="slug"
            required
            defaultValue={clinic?.slug}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Порядок</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={clinic?.sortOrder ?? 0}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Название</span>
          <input
            name="title"
            required
            defaultValue={clinic?.title}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Адрес</span>
          <input
            name="address"
            required
            defaultValue={clinic?.address}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Телефон (href)</span>
          <input
            name="phone"
            required
            defaultValue={clinic?.phone}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Телефон (отображение)</span>
          <input
            name="phoneDisplay"
            required
            defaultValue={clinic?.phoneDisplay}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Юр. лицо</span>
          <select
            name="legalEntityId"
            defaultValue={clinic?.legalEntityId || site.legalEntities[0].id}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          >
            {site.legalEntities.map((entity) => (
              <option key={entity.id} value={entity.id}>
                {entity.company}
              </option>
            ))}
          </select>
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Основная ссылка на карту</span>
          <input
            name="mapHref"
            defaultValue={clinic?.mapHref}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">
            Ссылки на карты (JSON)
          </span>
          <textarea
            name="mapLinks"
            rows={6}
            defaultValue={JSON.stringify(clinic?.mapLinks ?? [], null, 2)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 font-mono text-sm"
          />
        </label>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
      >
        {loading ? "Сохранение..." : "Сохранить"}
      </button>
    </form>
  );
}
