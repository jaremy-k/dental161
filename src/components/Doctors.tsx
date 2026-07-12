import { DoctorCard } from "@/components/DoctorCard";
import type { Doctor } from "@/lib/content/types";

type DoctorsProps = {
  doctors: Doctor[];
};

export function Doctors({ doctors }: DoctorsProps) {
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
            <DoctorCard key={doctor.slug} doctor={doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}
