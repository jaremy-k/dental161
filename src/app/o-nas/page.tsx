import type { Metadata } from "next";
import Link from "next/link";
import { aboutDoctors, aboutIntro, aboutPriorities } from "@/lib/about";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Doctors } from "@/components/Doctors";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "Сеть стоматологических клиник ДенталКеа в Ростове-на-Дону: терапия, хирургия, ортопедия, имплантация ALL ON 4/6, детская стоматология.",
  alternates: {
    canonical: `${site.url}/o-nas`,
  },
  openGraph: {
    title: `О клинике — ${site.brand}`,
    description:
      "Две стоматологические клиники DentalCare в Ростове-на-Дону, врачи, направления лечения и преимущества.",
    url: `${site.url}/o-nas`,
    siteName: site.brand,
    locale: "ru_RU",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "О нас" }]} />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {aboutIntro.title}
            </h1>
            <div className="mt-6 max-w-3xl space-y-4 text-lg leading-relaxed text-slate-600">
              {aboutIntro.paragraphs.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Наши неоспоримые приоритеты
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {aboutPriorities.map((item, i) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {aboutDoctors.title}
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">
              {aboutDoctors.text}
            </p>
            <div className="mt-8 rounded-3xl bg-accent-light p-8">
              <h3 className="font-semibold text-slate-900">Наши клиники</h3>
              <ul className="mt-4 space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
                {site.locations.map((loc) => (
                  <li key={loc.address}>
                    <p className="font-medium text-slate-800">{loc.title}</p>
                    <p className="text-sm text-slate-600">{loc.address}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-600">{site.schedule}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/#callback"
                  className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
                >
                  Записаться
                </Link>
                <Link
                  href="/price"
                  className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-accent hover:text-accent"
                >
                  Смотреть цены
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Doctors />
      </main>
      <Footer />
    </>
  );
}
