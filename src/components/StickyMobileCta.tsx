import Link from "next/link";
import { site } from "@/lib/site";

export function StickyMobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        <a
          href={`tel:${site.phone}`}
          className="rounded-full border border-slate-200 px-3 py-2.5 text-center text-sm font-semibold text-slate-800"
        >
          Позвонить
        </a>
        <a
          href={site.whatsapp}
          className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-center text-sm font-semibold text-emerald-700"
        >
          WhatsApp
        </a>
        <Link
          href="/#callback"
          className="rounded-full bg-accent px-3 py-2.5 text-center text-sm font-semibold text-white"
        >
          Запись
        </Link>
      </div>
    </div>
  );
}
