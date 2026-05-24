import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="mb-4 inline-flex items-center rounded-full bg-accent-light px-4 py-1.5 text-sm font-medium text-accent-dark">
            {site.tagline}
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
            Здоровая улыбка{" "}
            <span className="text-accent">без переплат</span> — с гарантией
            качества
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Имплантация, протезирование, терапия и детская стоматология в двух
            клиниках Ростова. Современное оборудование, опытные врачи и
            беспроцентная рассрочка до 12 месяцев.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#callback"
              className="rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
            >
              Записаться на приём
            </a>
            <a
              href={`tel:${site.phone}`}
              className="rounded-full border border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-800 transition hover:border-accent hover:text-accent"
            >
              Позвонить сейчас
            </a>
          </div>
          <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3">
            <div>
              <dt className="text-2xl font-bold text-accent">2</dt>
              <dd className="mt-1 text-sm text-slate-600">клиники в городе</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-accent">12 мес</dt>
              <dd className="mt-1 text-sm text-slate-600">рассрочка 0%</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-2xl font-bold text-accent">9–20</dt>
              <dd className="mt-1 text-sm text-slate-600">пн–сб, без выходных вечером</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-slate-100 bg-gradient-to-br from-accent-light to-white p-8 shadow-xl shadow-slate-200/50">
            <h2 className="text-xl font-bold text-slate-900">
              Нужна помощь сегодня?
            </h2>
            <p className="mt-3 text-slate-600">
              Острая боль или травма — принимаем в экстренном порядке. Каждый
              день зарезервированы окна для срочных пациентов.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Консультация и план лечения",
                "ALL ON 4 и ALL ON 6",
                "Диагностика в клинике",
                "Накопительные скидки для семьи",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-700">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs text-white">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#callback"
              className="mt-8 block rounded-2xl bg-slate-900 py-3.5 text-center font-semibold text-white transition hover:bg-slate-800"
            >
              Бесплатная консультация
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
