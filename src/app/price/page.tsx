import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PriceSearchTable } from "@/components/PriceSearchTable";
import { getPublishedPriceCatalog } from "@/lib/repositories/prices";
import { callbackClinic, site } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Цены",
  description:
    "Прайс-лист стоматологии ДенталКеа в Ростове-на-Дону: терапия, ортопедия, хирургия, имплантация и протезирование.",
  alternates: {
    canonical: `${site.url}/price`,
  },
  openGraph: {
    title: `Цены стоматологии — ${site.brand}`,
    description:
      "Прайс-лист, популярные пакеты лечения и запись на консультацию в DentalCare.",
    url: `${site.url}/price`,
    siteName: site.brand,
    locale: "ru_RU",
    type: "website",
  },
};

export default async function PricePage() {
  const priceCatalog = await getPublishedPriceCatalog();

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Цены" }]} />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {priceCatalog.intro.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
              {priceCatalog.intro.lead}
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-12 grid gap-4 md:grid-cols-4">
              {priceCatalog.treatmentPackages.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <h2 className="text-base font-semibold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-2xl font-bold text-accent-dark">
                    {item.price}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>

            <PriceSearchTable categories={priceCatalog.priceCategories} />

            <div className="mt-12 rounded-2xl bg-accent-light p-6 sm:p-8">
              <p className="text-slate-700">{priceCatalog.intro.note}</p>
              <p className="mt-4 text-slate-600">
                Стоимость может меняться в зависимости от диагностики,
                материалов и объёма лечения. Перед началом процедур врач
                объяснит варианты и поможет выбрать оптимальный план.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/#callback"
                  className="rounded-full bg-accent px-6 py-3 font-semibold text-white transition hover:bg-accent-dark"
                >
                  Записаться на консультацию
                </Link>
                <a
                  href={`tel:${callbackClinic.phone}`}
                  className="rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:border-accent hover:text-accent"
                >
                  {callbackClinic.phoneDisplay}
                </a>
              </div>
            </div>

            <p className="mt-8 text-xs text-slate-500">{priceCatalog.disclaimer}</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
