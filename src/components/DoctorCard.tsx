import Image from "next/image";
import type { Doctor } from "@/lib/doctors";

type DoctorCardProps = {
  doctor: Doctor;
};

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition hover:border-accent/30 hover:shadow-md">
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
        <p className="mt-2 text-sm font-medium text-slate-700">
          {doctor.experience}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Приём: {doctor.location}
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {doctor.focus.map((item) => (
            <li
              key={item}
              className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {item}
            </li>
          ))}
        </ul>
        <a
          href="#callback"
          className="mt-4 inline-flex text-sm font-semibold text-accent hover:text-accent-dark"
        >
          Записаться к врачу →
        </a>
      </div>
    </article>
  );
}
