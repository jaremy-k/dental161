import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="mb-4 inline-flex items-center rounded-full bg-accent-light px-4 py-1.5 text-sm font-medium text-accent-dark">
            {site.tagline}
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem]">
            Стоматология в Ростове с{" "}
            <span className="text-accent">понятной сметой</span> до начала
            лечения
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            Имплантация, протезирование, терапия и детская стоматология в трёх
            клиниках Ростова. Врач объяснит варианты, сроки и стоимость, а
            лечение можно начать в рассрочку 0% до 12 месяцев.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#callback"
              className="rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark"
            >
              Получить план лечения
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
              <dt className="text-2xl font-bold text-accent">3</dt>
              <dd className="mt-1 text-sm text-slate-600">клиники в городе</dd>
            </div>
            <div>
              <dt className="text-2xl font-bold text-accent">12 мес</dt>
              <dd className="mt-1 text-sm text-slate-600">рассрочка 0%</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-2xl font-bold text-accent">9–20</dt>
              <dd className="mt-1 text-sm text-slate-600">
                пн–сб 9–20, вс — выходной
              </dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-2">
            {site.trust.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-100 shadow-xl shadow-slate-200/50">
            <Image
              src="/images/doctors/koccharov.jpg"
              alt="Врач стоматологии DentalCare"
              width={533}
              height={800}
              priority
              className="h-[560px] w-full object-cover object-top"
            />
          </div>
          <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-5 shadow-xl shadow-slate-900/10 backdrop-blur">
            <h2 className="text-xl font-bold text-slate-900">
              Нужна помощь сегодня?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              При острой боли оставляем срочные окна. Позвоните или оставьте
              заявку — подберём ближайшее время.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="#callback"
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Записаться
              </Link>
              <a
                href={site.whatsapp}
                className="rounded-full bg-emerald-50 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
