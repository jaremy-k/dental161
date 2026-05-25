import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { dentalServices } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Услуги стоматологии в Ростове-на-Дону",
  description:
    "Лечение зубов, имплантация, протезирование, хирургия, ортодонтия, детская стоматология и диагностика в DentalCare.",
  alternates: {
    canonical: `${site.url}/services`,
  },
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Услуги" }]} />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Услуги стоматологии DentalCare
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
              Выберите направление, чтобы посмотреть цены, этапы лечения и
              ответы на частые вопросы.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
            {dentalServices.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-accent/30 hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-dark">
                  {service.patientIntent}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-slate-900">
                  {service.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>
                <span className="mt-5 inline-flex text-sm font-semibold text-accent">
                  Подробнее →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
