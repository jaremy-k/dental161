import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getPublicClinics } from "@/lib/repositories/clinics";
import { getDoctorsByLocationSlug } from "@/lib/repositories/doctors";
import { site } from "@/lib/site";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Клиники",
  description:
    "Адреса, телефоны, карты и врачи трёх стоматологических клиник DentalCare в Ростове-на-Дону.",
  alternates: {
    canonical: `${site.url}/clinics`,
  },
};

export default async function ClinicsPage() {
  const locations = await getPublicClinics();
  const locationsWithCounts = await Promise.all(
    locations.map(async (location) => ({
      location,
      doctorsCount: (await getDoctorsByLocationSlug(location.slug)).length,
    })),
  );

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Клиники" }]} />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Клиники DentalCare в Ростове-на-Дону
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
              Выберите удобный филиал, чтобы посмотреть адрес, телефон, ссылки
              на карты и врачей, которые принимают в этой клинике.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
            {locationsWithCounts.map(({ location, doctorsCount }) => (
              <article
                key={location.slug}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-slate-900">
                  {location.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {location.address}
                </p>
                <a
                  href={`tel:${location.phone}`}
                  className="mt-3 inline-flex text-base font-semibold text-accent hover:text-accent-dark"
                >
                  {location.phoneDisplay}
                </a>
                <p className="mt-4 text-sm text-slate-600">
                  Врачи филиала: {doctorsCount}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {location.mapLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-accent hover:text-accent"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <Link
                  href={`/clinics/${location.slug}`}
                  className="mt-6 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
                >
                  Подробнее о клинике
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
