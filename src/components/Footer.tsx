import Image from "next/image";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 sm:px-6 md:flex-row md:justify-between">
        <Image
          src="/logo.png"
          alt={site.brand}
          width={120}
          height={42}
          className="h-9 w-auto opacity-90"
        />
        <div className="text-center text-sm text-slate-500 md:text-right">
          <p>
            © {new Date().getFullYear()} {site.brand}. Все права защищены.
          </p>
          <p className="mt-1">
            {site.legal.company} · ОГРН {site.legal.ogrn} · ИНН{" "}
            {site.legal.inn}
          </p>
        </div>
      </div>
    </footer>
  );
}
