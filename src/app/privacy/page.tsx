import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика обработки персональных данных пользователей сайта DentalCare.",
  alternates: {
    canonical: `${site.url}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Политика конфиденциальности" }]} />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Политика конфиденциальности
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Настоящая политика описывает, как клиники DentalCare обрабатывают
              персональные данные, которые пользователь оставляет на сайте.
            </p>
          </div>
        </section>

        <section className="bg-slate-50 py-12 sm:py-16">
          <div className="mx-auto max-w-4xl space-y-8 px-4 text-slate-700 sm:px-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Какие данные мы собираем
              </h2>
              <p className="mt-3 leading-relaxed">
                Имя, телефон, выбранную услугу, клинику и удобное время для
                связи, если пользователь указывает эти данные в форме заявки.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Для чего используются данные
              </h2>
              <p className="mt-3 leading-relaxed">
                Для обратной связи, записи на приём, уточнения деталей заявки и
                подготовки предварительной информации о лечении.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Правовое основание
              </h2>
              <p className="mt-3 leading-relaxed">
                Данные обрабатываются на основании согласия пользователя,
                которое он подтверждает перед отправкой формы.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Операторы персональных данных
              </h2>
              <ul className="mt-3 space-y-3 leading-relaxed">
                {site.legalEntities.map((entity) => (
                  <li key={entity.inn}>
                    {entity.company}, ОГРН {entity.ogrn}, ИНН {entity.inn}.
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                Телефон для связи:{" "}
                <a
                  className="font-semibold text-accent"
                  href={`tel:${site.phone}`}
                >
                  {site.phoneDisplay}
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
