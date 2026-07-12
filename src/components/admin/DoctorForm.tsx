"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Clinic, Doctor } from "@/lib/content/types";

type DoctorFormProps = {
  doctor?: Doctor;
  clinics: Clinic[];
};

export function DoctorForm({ doctor, clinics }: DoctorFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const activeClinics = useMemo(
    () => clinics.filter((clinic) => !clinic.deletedAt),
    [clinics],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const locationIds = formData.getAll("locationIds").map(String);
    const selectedClinics = activeClinics.filter((clinic) =>
      locationIds.includes(clinic.slug),
    );

    const payload = {
      slug: String(formData.get("slug") || "").trim(),
      name: String(formData.get("name") || "").trim(),
      role: String(formData.get("role") || "").trim(),
      experience: String(formData.get("experience") || "").trim(),
      focus: String(formData.get("focus") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      location:
        String(formData.get("location") || "").trim() ||
        selectedClinics.map((clinic) => clinic.title).join(" / "),
      locationIds,
      image: String(formData.get("image") || "").trim(),
      sortOrder: Number(formData.get("sortOrder") || 0),
    };

    const url = doctor?.id
      ? `/api/admin/doctors/${doctor.id}`
      : "/api/admin/doctors";
    const method = doctor?.id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
      id?: number;
    };

    if (!response.ok || !data.ok) {
      setError(data.error || "Не удалось сохранить врача");
      setLoading(false);
      return;
    }

    router.push("/admin/doctors");
    router.refresh();
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
            defaultValue={doctor?.slug}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Порядок</span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={doctor?.sortOrder ?? 0}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">ФИО</span>
          <input
            name="name"
            required
            defaultValue={doctor?.name}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Должность</span>
          <input
            name="role"
            required
            defaultValue={doctor?.role}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Стаж / описание</span>
          <input
            name="experience"
            required
            defaultValue={doctor?.experience}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">
            Специализация (через запятую)
          </span>
          <input
            name="focus"
            defaultValue={doctor?.focus.join(", ")}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">
            Подпись «Приём: ...»
          </span>
          <input
            name="location"
            defaultValue={doctor?.location}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Фото (путь)</span>
          <input
            name="image"
            required
            defaultValue={doctor?.image || "/images/doctors/"}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
          />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-slate-700">Клиники</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {activeClinics.map((clinic) => (
            <label
              key={clinic.slug}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3"
            >
              <input
                type="checkbox"
                name="locationIds"
                value={clinic.slug}
                defaultChecked={doctor?.locationIds.includes(clinic.slug)}
              />
              <span className="text-sm text-slate-700">{clinic.title}</span>
            </label>
          ))}
        </div>
      </fieldset>

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
