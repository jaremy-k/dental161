import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Реквизиты",
  description: "Реквизиты юридических лиц клиник DentalCare в Ростове-на-Дону.",
  alternates: {
    canonical: `${site.url}/requisites`,
  },
};

const rows = [
  ["ИНН", "inn"],
  ["КПП", "kpp"],
  ["ОГРН", "ogrn"],
  ["Расчётный счёт", "account"],
  ["Банк", "bank"],
  ["БИК банка", "bik"],
  ["Корсчёт", "correspondentAccount"],
  ["ИНН банка", "bankInn"],
  ["КПП банка", "bankKpp"],
] as const;

export default function RequisitesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Реквизиты" }]} />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Реквизиты клиник DentalCare
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
              Юридические и банковские реквизиты трёх клиник сети в
              Ростове-на-Дону.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-3">
            {site.legalEntities.map((entity) => (
              <article
                key={entity.inn}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold text-slate-900">
                  {entity.company}
                </h2>
                <dl className="mt-5 space-y-3 text-sm">
                  {rows.map(([label, key]) => (
                    <div key={key}>
                      <dt className="text-slate-500">{label}</dt>
                      <dd className="mt-1 font-medium text-slate-900">
                        {entity[key]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
