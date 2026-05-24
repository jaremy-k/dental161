import Link from "next/link";

type BreadcrumbsProps = {
  items: { label: string; href?: string }[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="mb-6 text-sm text-slate-500" aria-label="Хлебные крошки">
      <Link href="/" className="hover:text-accent">
        Главная
      </Link>
      {items.map((item) => (
        <span key={item.label}>
          <span className="mx-2">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-accent">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
