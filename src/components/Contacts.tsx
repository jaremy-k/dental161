"use client";

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
              {site.locations.map((loc) => (
                <div
                  key={loc.address}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <h3 className="font-semibold text-slate-900">{loc.title}</h3>
                  <p className="mt-1 text-slate-600">{loc.address}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="callback" className="scroll-mt-24">
            <form
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/40"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (
                  form.elements.namedItem("name") as HTMLInputElement
                ).value;
                alert(
                  `Спасибо, ${name || "гость"}! Мы перезвоним вам в ближайшее время.`,
                );
                form.reset();
              }}
            >
              <h3 className="text-xl font-bold text-slate-900">
                Заказать звонок
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Оставьте номер — администратор свяжется с вами для записи на
                приём.
              </p>

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Ваше имя
                  </span>
                  <input
                    name="name"
                    type="text"
                    required
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none ring-accent/0 transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="Как к вам обращаться?"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">
                    Телефон
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    required
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="+7 (___) ___-__-__"
                  />
                </label>
                <label className="flex items-start gap-3">
                  <input
                    name="consent"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                  />
                  <span className="text-xs leading-relaxed text-slate-500">
                    Даю согласие на обработку персональных данных в соответствии
                    с политикой конфиденциальности
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="mt-6 w-full rounded-full bg-accent py-3.5 font-semibold text-white transition hover:bg-accent-dark"
              >
                Отправить заявку
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
