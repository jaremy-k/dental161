"use client";

import { useMemo, useState } from "react";
import { PriceTable } from "@/components/PriceTable";
import type { PriceCategory } from "@/lib/prices";

type PriceSearchTableProps = {
  categories: PriceCategory[];
};

export function PriceSearchTable({ categories }: PriceSearchTableProps) {
  const [query, setQuery] = useState("");

  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return categories;
    }

    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter((item) =>
          `${category.title} ${item.name}`.toLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, query]);

  return (
    <div>
      <label className="block max-w-xl">
        <span className="text-sm font-medium text-slate-700">
          Быстрый поиск по прайсу
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="Например: имплант, кариес, коронка"
        />
      </label>

      <div className="mt-8">
        {filteredCategories.length > 0 ? (
          <PriceTable categories={filteredCategories} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600">
            По такому запросу ничего не найдено. Оставьте заявку — администратор
            подскажет стоимость нужной услуги.
          </div>
        )}
      </div>
    </div>
  );
}
