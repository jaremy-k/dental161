import Link from "next/link";
import { PriceTable } from "@/components/PriceTable";
import { priceCategories, priceDisclaimer } from "@/lib/prices";

const priceHighlights = priceCategories.flatMap((c) => c.items).slice(0, 6);

export function Prices() {
  return (
    <section id="prices" className="bg-slate-900 py-20 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Прозрачные цены
            </h2>
            <p className="mt-4 text-slate-300">
              Одни из лучших цен среди стоматологий Ростова. Точную стоимость
              «под ключ» рассчитаем на консультации — подберём имплант, коронку
              или протез под ваш случай.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/price"
              className="shrink-0 rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-dark"
            >
              Весь прайс-лист
            </Link>
            <Link
              href="/#callback"
              className="shrink-0 rounded-full border border-slate-600 px-6 py-3 font-semibold text-white transition hover:border-accent"
            >
              Консультация
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <PriceTable
            categories={[
              {
                title: "Популярные услуги",
                items: priceHighlights.map((item) => ({
                  name: item.name,
                  price: item.price,
                })),
              },
            ]}
            variant="dark"
          />
        </div>

        <p className="mt-6 text-xs text-slate-400">{priceDisclaimer}</p>
        <p className="mt-2 text-sm text-slate-400">
          <Link href="/price" className="text-accent hover:underline">
            Смотреть все цены →
          </Link>
        </p>
      </div>
    </section>
  );
}
