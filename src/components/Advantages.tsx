import Link from "next/link";
import { aboutPriorities } from "@/lib/about";
import { site } from "@/lib/site";

export function Advantages() {
  const highlights = aboutPriorities.slice(0, 6);

  return (
    <section id="advantages" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Почему выбирают ДенталКеа
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Качество лечения, прозрачные цены и забота о каждом пациенте — наши
            приоритеты с первого визита.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item, i) => (
            <div key={item.title} className="relative pl-14">
              <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center">
          <Link
            href="/o-nas"
            className="font-semibold text-accent hover:text-accent-dark"
          >
            Подробнее о клинике →
          </Link>
        </p>

        <div className="mt-10 rounded-2xl bg-slate-50 p-6 text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            Проверьте нас на картах
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            Перед записью можно посмотреть карточки клиники, маршрут и отзывы
            пациентов на популярных сервисах.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {site.reviewLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-accent hover:text-accent"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
