"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { nav, site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.svg"
            alt={site.brand}
            width={140}
            height={48}
            className="h-10 w-auto sm:h-11"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={site.whatsapp}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
          >
            WhatsApp
          </a>
          <a
            href={`tel:${site.phone}`}
            className="text-sm font-semibold text-slate-800 hover:text-accent"
          >
            {site.phoneDisplay}
          </a>
          <Link
            href="/#callback"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-dark"
          >
            Записаться
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex flex-col gap-1.5 rounded-lg p-2 md:hidden"
          aria-label="Меню"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 w-6 bg-slate-800 transition ${open ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-slate-800 transition ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-slate-800 transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-base font-medium text-slate-700"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${site.phone}`}
              className="pt-2 font-semibold text-accent"
            >
              {site.phoneDisplay}
            </a>
            <a href={site.whatsapp} className="font-semibold text-emerald-600">
              Написать в WhatsApp
            </a>
            <Link
              href="/#callback"
              className="mt-2 rounded-full bg-accent py-3 text-center font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Записаться на приём
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
