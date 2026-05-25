"use client";

import { ContactForm } from "@/components/ContactForm";
import { site } from "@/lib/site";

export function Contacts() {
  return (
    <section id="contacts" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Контакты
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Ждём вас {site.schedule.toLowerCase()}. Выберите удобную клинику
              или оставьте заявку — перезвоним в течение 15 минут.
            </p>

            <div className="mt-8 space-y-6">
              <a
                href={`tel:${site.phone}`}
                className="block text-2xl font-bold text-accent hover:text-accent-dark"
              >
                {site.phoneDisplay}
              </a>
              <div className="flex flex-wrap gap-3">
                <a
                  href={site.whatsapp}
                  className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                >
                  Написать в WhatsApp
                </a>
                <a
                  href={site.telegram}
                  className="rounded-full bg-accent-light px-4 py-2 text-sm font-semibold text-accent-dark transition hover:bg-sky-100"
                >
                  Telegram
                </a>
              </div>
              {site.locations.map((loc) => (
                <div
                  key={loc.address}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <h3 className="font-semibold text-slate-900">{loc.title}</h3>
                  <p className="mt-1 text-slate-600">{loc.address}</p>
                  <a
                    href={loc.mapHref}
                    className="mt-3 inline-flex text-sm font-semibold text-accent hover:text-accent-dark"
                  >
                    Открыть на карте
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div id="callback" className="scroll-mt-24">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
