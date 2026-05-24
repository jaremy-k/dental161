import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PriceTable } from "@/components/PriceTable";
import {
  priceCategories,
  priceDisclaimer,
  priceIntro,
} from "@/lib/prices";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Цены — ${site.brand}`,
  description:
    "Прайс-лист стоматологии ДенталКеа в Ростове-на-Дону: терапия, ортопедия, хирургия, имплантация и протезирование.",
};

export default function PricePage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Цены" }]} />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {priceIntro.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
              {priceIntro.lead}
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <PriceTable categories={priceCategories} />

            <div className="mt-12 rounded-2xl bg-accent-light p-6 sm:p-8">
              <p className="text-slate-700">{priceIntro.note}</p>
              <p className="mt-4 text-slate-600">
                Сделать дешевле и качественно — на наш взгляд, довольно
                сомнительно. В нашей стоматологии хорошее оборудование и опытные
                врачи.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/#callback"
                  className="rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-dark"
                >
                  Записаться на консультацию
                </Link>
                <a
                  href={`tel:${site.phone}`}
                  className="rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-accent hover:text-accent"
                >
                  {site.phoneDisplay}
                </a>
              </div>
            </div>

            <p className="mt-8 text-xs text-slate-500">{priceDisclaimer}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
