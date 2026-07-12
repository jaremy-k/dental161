import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { DoctorCard } from "@/components/DoctorCard";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getClinicBySlug, getPublicClinics } from "@/lib/repositories/clinics";
import { getDoctorsByLocationSlug } from "@/lib/repositories/doctors";
import { site } from "@/lib/site";

export const revalidate = 60;

type ClinicPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const locations = await getPublicClinics();
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: ClinicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await getClinicBySlug(slug);

  if (!location) {
    return {};
  }

  return {
    title: `${location.title}`,
    description: `${location.title}: ${location.address}, телефон ${location.phoneDisplay}. Врачи филиала и запись на приём.`,
    alternates: {
      canonical: `${site.url}/clinics/${location.slug}`,
    },
    openGraph: {
      title: `${location.title} — ${site.brand}`,
      description: `${location.address}. Телефон: ${location.phoneDisplay}.`,
      url: `${site.url}/clinics/${location.slug}`,
      siteName: site.brand,
      locale: "ru_RU",
      type: "website",
    },
  };
}

export default async function ClinicPage({ params }: ClinicPageProps) {
  const { slug } = await params;
  const [location, clinicDoctors, clinics] = await Promise.all([
    getClinicBySlug(slug),
    getDoctorsByLocationSlug(slug),
    getPublicClinics(),
  ]);

  if (!location) {
    notFound();
  }

  const legalEntity = site.legalEntities.find(
    (entity) => entity.id === location.legalEntityId,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: location.title,
    url: `${site.url}/clinics/${location.slug}`,
    telephone: location.phone,
    parentOrganization: {
      "@type": "Organization",
      name: site.brand,
      url: site.url,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: site.city,
      addressCountry: "RU",
    },
  };

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Breadcrumbs
              items={[
                { label: "Клиники", href: "/clinics" },
                { label: location.title },
              ]}
            />
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {location.title}
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-slate-600">
                  {location.address}
                </p>
                <a
                  href={`tel:${location.phone}`}
                  className="mt-5 inline-flex text-2xl font-bold text-accent hover:text-accent-dark"
                >
                  {location.phoneDisplay}
                </a>
                <div className="mt-6 flex flex-wrap gap-2">
                  {location.mapLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent hover:text-accent"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Информация о филиале
                </h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-slate-500">График</dt>
                    <dd className="font-medium text-slate-900">
                      {site.schedule}
                    </dd>
                  </div>
                  {legalEntity && (
                    <div>
                      <dt className="text-slate-500">Юридическое лицо</dt>
                      <dd className="font-medium text-slate-900">
                        {legalEntity.company}, ИНН {legalEntity.inn}
                      </dd>
                    </div>
                  )}
                </dl>
                <Link
                  href="/requisites"
                  className="mt-5 inline-flex text-sm font-semibold text-accent hover:text-accent-dark"
                >
                  Смотреть реквизиты →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Врачи в этом филиале
            </h2>
            {clinicDoctors.length > 0 ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {clinicDoctors.map((doctor) => (
                  <DoctorCard key={doctor.slug} doctor={doctor} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-600">
                Расписание врачей уточняйте у администратора.
              </p>
            )}
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Записаться в филиал
              </h2>
              <p className="mt-4 leading-relaxed text-slate-600">
                Оставьте заявку, и администратор подберёт удобное время в
                клинике по адресу {location.address}.
              </p>
            </div>
            <div id="callback" className="scroll-mt-24">
              <ContactForm clinics={clinics} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
