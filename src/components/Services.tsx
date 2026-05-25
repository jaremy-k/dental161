import { services } from "@/lib/site";

export function Services() {
  return (
    <section id="services" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Предоставляемые услуги
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Современная стоматология для всей семьи — от профилактики до сложной
            имплантации
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-accent/30 hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent-light text-accent">
                <span className="text-lg font-bold">
                  {service.title.charAt(0)}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {service.description}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
