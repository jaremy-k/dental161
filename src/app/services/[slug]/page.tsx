import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PriceTable } from "@/components/PriceTable";
import { dentalServices, getServiceBySlug } from "@/lib/services";
import { getPublicClinics } from "@/lib/repositories/clinics";
import {
  getPublishedPriceCatalog,
  getRelatedPriceCategories,
} from "@/lib/repositories/prices";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return dentalServices.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {};
  }

  return {
    title: `${service.title} в Ростове-на-Дону`,
    description: `${service.lead} ${site.name}: ${site.schedule}, ${site.phoneDisplay}.`,
    alternates: {
      canonical: `${site.url}/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} — ${site.brand}`,
      description: service.lead,
      url: `${site.url}/services/${service.slug}`,
      siteName: site.brand,
      locale: "ru_RU",
      type: "website",
    },
  };
}

function getRelatedPrices(
  catalog: Awaited<ReturnType<typeof getPublishedPriceCatalog>>,
  terms: string[],
) {
  return getRelatedPriceCategories(catalog, terms);
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const [priceCatalog, clinics] = await Promise.all([
    getPublishedPriceCatalog(),
    getPublicClinics(),
  ]);

  const relatedPrices = getRelatedPrices(priceCatalog, service.relatedPriceTerms);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.title,
    description: service.lead,
    provider: {
      "@type": "Dentist",
      name: site.name,
      telephone: site.phone,
      url: site.url,
      address: clinics.map((location) => ({
        "@type": "PostalAddress",
        streetAddress: location.address,
        addressLocality: site.city,
        addressCountry: "RU",
      })),
    },
    offers: service.packages.map((item) => ({
      "@type": "Offer",
      name: item.title,
      priceCurrency: "RUB",
      description: `${item.price}. ${item.description}`,
    })),
  };

  return (
    <>
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Breadcrumbs
              items={[
                { label: "Услуги", href: "/#services" },
                { label: service.shortTitle },
              ]}
            />
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="mb-4 inline-flex rounded-full bg-accent-light px-4 py-1.5 text-sm font-semibold text-accent-dark">
                  {service.patientIntent}
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                  {service.title} в Ростове-на-Дону
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
                  {service.lead}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="#callback"
                    className="rounded-full bg-accent px-7 py-3 font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
                  >
                    Получить план и стоимость
                  </Link>
                  <a
                    href={`tel:${site.phone}`}
                    className="rounded-full border border-slate-200 bg-white px-7 py-3 font-semibold text-slate-800 transition hover:border-accent hover:text-accent"
                  >
                    {site.phoneDisplay}
                  </a>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Что важно для пациента
                </h2>
                <ul className="mt-5 space-y-3">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3 text-slate-700">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-5 md:grid-cols-2">
              {service.packages.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h2 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-3xl font-bold text-accent-dark">
                    {item.price}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>

            {relatedPrices.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-slate-900">
                  Цены по направлению
                </h2>
                <p className="mt-3 max-w-3xl text-slate-600">
                  Точная стоимость зависит от диагностики и объёма лечения.
                  Ниже — позиции прайса, которые чаще всего относятся к этому
                  направлению.
                </p>
                <div className="mt-8">
                  <PriceTable categories={relatedPrices} />
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Частые вопросы
              </h2>
              <div className="mt-6 space-y-5">
                {service.faqs.map((item) => (
                  <div key={item.question}>
                    <h3 className="font-semibold text-slate-900">
                      {item.question}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
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
