import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

const navItems = [
  { href: "/admin/leads", label: "Заявки" },
  { href: "/admin/doctors", label: "Врачи" },
  { href: "/admin/clinics", label: "Клиники" },
  { href: "/admin/prices", label: "Цены" },
];

type AdminShellProps = {
  title: string;
  email?: string;
  children: React.ReactNode;
};

export function AdminShell({ title, email, children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-accent">DentalCare Admin</p>
            <h1 className="text-xl font-bold text-slate-900">{title}</h1>
            {email && <p className="mt-1 text-sm text-slate-500">{email}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-accent hover:text-accent"
            >
              На сайт
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
