"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PriceCatalog, PriceVersion } from "@/lib/content/types";

type PriceEditorProps = {
  catalog: PriceCatalog;
  versions: PriceVersion[];
};

function cloneCatalog(catalog: PriceCatalog): PriceCatalog {
  return JSON.parse(JSON.stringify(catalog)) as PriceCatalog;
}

export function PriceEditor({ catalog, versions }: PriceEditorProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<PriceCatalog>(() => cloneCatalog(catalog));
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"draft" | "publish" | number | null>(
    null,
  );

  async function saveCatalog(mode: "draft" | "publish") {
    setLoading(mode);
    setError("");

    const response = await fetch("/api/admin/prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        catalog: draft,
        publish: mode === "publish",
        label: label.trim() || undefined,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };

    if (!response.ok || !data.ok) {
      setError(data.error || "Не удалось сохранить прайс");
      setLoading(null);
      return;
    }

    setLabel("");
    router.refresh();
    setLoading(null);
  }

  async function publishVersion(id: number) {
    setLoading(id);
    setError("");

    const response = await fetch(`/api/admin/prices/${id}/publish`, {
      method: "POST",
    });

    const data = (await response.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: string;
    };

    if (!response.ok || !data.ok) {
      setError(data.error || "Не удалось опубликовать версию");
      setLoading(null);
      return;
    }

    router.refresh();
    setLoading(null);
  }

  function updateCategoryTitle(index: number, title: string) {
    setDraft((current) => {
      const next = cloneCatalog(current);
      next.priceCategories[index].title = title;
      return next;
    });
  }

  function updateItem(
    categoryIndex: number,
    itemIndex: number,
    field: "name" | "price",
    value: string,
  ) {
    setDraft((current) => {
      const next = cloneCatalog(current);
      next.priceCategories[categoryIndex].items[itemIndex][field] = value;
      return next;
    });
  }

  function addCategory() {
    setDraft((current) => {
      const next = cloneCatalog(current);
      next.priceCategories.push({ title: "Новая категория", items: [] });
      return next;
    });
  }

  function addItem(categoryIndex: number) {
    setDraft((current) => {
      const next = cloneCatalog(current);
      next.priceCategories[categoryIndex].items.push({
        name: "Новая услуга",
        price: "0 ₽",
      });
      return next;
    });
  }

  function removeCategory(index: number) {
    setDraft((current) => {
      const next = cloneCatalog(current);
      next.priceCategories.splice(index, 1);
      return next;
    });
  }

  function removeItem(categoryIndex: number, itemIndex: number) {
    setDraft((current) => {
      const next = cloneCatalog(current);
      next.priceCategories[categoryIndex].items.splice(itemIndex, 1);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Шапка прайса</h2>
        <div className="mt-4 grid gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Заголовок</span>
            <input
              value={draft.intro.title}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  intro: { ...current.intro, title: event.target.value },
                }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Описание</span>
            <textarea
              value={draft.intro.lead}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  intro: { ...current.intro, lead: event.target.value },
                }))
              }
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Примечание</span>
            <textarea
              value={draft.intro.note}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  intro: { ...current.intro, note: event.target.value },
                }))
              }
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Дисклеймер</span>
            <textarea
              value={draft.disclaimer}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  disclaimer: event.target.value,
                }))
              }
              rows={2}
              className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Популярные пакеты</h2>
          <button
            type="button"
            onClick={() =>
              setDraft((current) => {
                const next = cloneCatalog(current);
                next.treatmentPackages.push({
                  title: "Новый пакет",
                  price: "0 ₽",
                  description: "",
                });
                return next;
              })
            }
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-accent hover:text-accent"
          >
            + Пакет
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {draft.treatmentPackages.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="grid gap-2 rounded-xl border border-slate-200 p-4 md:grid-cols-[1fr_160px_auto]"
            >
              <input
                value={item.title}
                onChange={(event) =>
                  setDraft((current) => {
                    const next = cloneCatalog(current);
                    next.treatmentPackages[index].title = event.target.value;
                    return next;
                  })
                }
                className="rounded-xl border border-slate-200 px-4 py-2"
                placeholder="Название"
              />
              <input
                value={item.price}
                onChange={(event) =>
                  setDraft((current) => {
                    const next = cloneCatalog(current);
                    next.treatmentPackages[index].price = event.target.value;
                    return next;
                  })
                }
                className="rounded-xl border border-slate-200 px-4 py-2"
                placeholder="Цена"
              />
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => {
                    const next = cloneCatalog(current);
                    next.treatmentPackages.splice(index, 1);
                    return next;
                  })
                }
                className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
              >
                Удалить
              </button>
              <textarea
                value={item.description}
                onChange={(event) =>
                  setDraft((current) => {
                    const next = cloneCatalog(current);
                    next.treatmentPackages[index].description =
                      event.target.value;
                    return next;
                  })
                }
                rows={2}
                className="md:col-span-3 rounded-xl border border-slate-200 px-4 py-2"
                placeholder="Описание"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Категории и цены</h2>
          <button
            type="button"
            onClick={addCategory}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-accent hover:text-accent"
          >
            + Категория
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {draft.priceCategories.map((category, categoryIndex) => (
            <div
              key={`${category.title}-${categoryIndex}`}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={category.title}
                  onChange={(event) =>
                    updateCategoryTitle(categoryIndex, event.target.value)
                  }
                  className="min-w-[240px] flex-1 rounded-xl border border-slate-200 px-4 py-2 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => addItem(categoryIndex)}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  + Услуга
                </button>
                <button
                  type="button"
                  onClick={() => removeCategory(categoryIndex)}
                  className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                >
                  Удалить категорию
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={`${item.name}-${itemIndex}`}
                    className="grid gap-2 md:grid-cols-[1fr_180px_auto]"
                  >
                    <input
                      value={item.name}
                      onChange={(event) =>
                        updateItem(
                          categoryIndex,
                          itemIndex,
                          "name",
                          event.target.value,
                        )
                      }
                      className="rounded-xl border border-slate-200 px-4 py-2"
                    />
                    <input
                      value={item.price}
                      onChange={(event) =>
                        updateItem(
                          categoryIndex,
                          itemIndex,
                          "price",
                          event.target.value,
                        )
                      }
                      className="rounded-xl border border-slate-200 px-4 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(categoryIndex, itemIndex)}
                      className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                    >
                      Удалить
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            Комментарий к версии (необязательно)
          </span>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3"
            placeholder="Например: обновление цен на имплантацию"
          />
        </label>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => saveCatalog("draft")}
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {loading === "draft" ? "Сохранение..." : "Сохранить черновик"}
          </button>
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => saveCatalog("publish")}
            className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
          >
            {loading === "publish" ? "Публикация..." : "Опубликовать"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">История версий</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">№</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Название</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Статус</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Дата</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700">Действие</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {versions.map((version) => (
                <tr key={version.id}>
                  <td className="px-4 py-3">{version.versionNumber}</td>
                  <td className="px-4 py-3">{version.label || "—"}</td>
                  <td className="px-4 py-3">
                    {version.isPublished ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        Опубликована
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        Черновик
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Intl.DateTimeFormat("ru-RU", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(version.createdAt))}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {!version.isPublished && (
                      <button
                        type="button"
                        disabled={loading !== null}
                        onClick={() => publishVersion(version.id)}
                        className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-dark disabled:opacity-60"
                      >
                        {loading === version.id ? "..." : "Опубликовать"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
