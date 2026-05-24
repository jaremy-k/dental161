import type { PriceCategory } from "@/lib/prices";

type PriceTableProps = {
  categories: PriceCategory[];
  variant?: "light" | "dark";
};

export function PriceTable({
  categories,
  variant = "light",
}: PriceTableProps) {
  const dark = variant === "dark";

  return (
    <div className="space-y-10">
      {categories.map((category) => (
        <section key={category.title}>
          <h3
            className={`mb-4 text-lg font-semibold sm:text-xl ${
              dark ? "text-white" : "text-slate-900"
            }`}
          >
            {category.title}
          </h3>
          <div
            className={`overflow-hidden rounded-2xl border ${
              dark ? "border-slate-700" : "border-slate-200 bg-white shadow-sm"
            }`}
          >
            <table className="w-full text-left text-sm">
              <thead>
                <tr
                  className={
                    dark
                      ? "border-b border-slate-700 bg-slate-800/50"
                      : "border-b border-slate-200 bg-slate-50"
                  }
                >
                  <th
                    className={`px-4 py-3 font-semibold sm:px-6 sm:py-4 ${
                      dark ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    Услуга
                  </th>
                  <th
                    className={`px-4 py-3 text-right font-semibold sm:px-6 sm:py-4 ${
                      dark ? "text-slate-200" : "text-slate-700"
                    }`}
                  >
                    Цена
                  </th>
                </tr>
              </thead>
              <tbody>
                {category.items.map((row, i) => (
                  <tr
                    key={row.name}
                    className={
                      dark
                        ? i % 2 === 0
                          ? "bg-slate-800/30"
                          : "bg-slate-900"
                        : i % 2 === 0
                          ? "bg-white"
                          : "bg-slate-50/80"
                    }
                  >
                    <td
                      className={`px-4 py-3 sm:px-6 sm:py-3.5 ${
                        dark ? "text-slate-200" : "text-slate-700"
                      }`}
                    >
                      {row.name}
                    </td>
                    <td
                      className={`whitespace-nowrap px-4 py-3 text-right font-semibold sm:px-6 sm:py-3.5 ${
                        dark ? "text-accent" : "text-accent-dark"
                      }`}
                    >
                      {row.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}
