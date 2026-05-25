import Image from "next/image";
import { doctors } from "@/lib/doctors";

export function Doctors() {
  return (
    <section id="doctors" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Наши врачи
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Команда специалистов с многолетним опытом — имплантологи, ортопеды,
            ортодонты и терапевты
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {doctors.map((doctor) => (
            <article
              key={doctor.slug}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition hover:border-accent/30 hover:shadow-md"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-slate-200">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold leading-snug text-slate-900">
                  {doctor.name}
                </h3>
                <p className="mt-1 text-sm text-accent-dark">{doctor.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
