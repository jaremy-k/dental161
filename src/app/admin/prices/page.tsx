import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { PriceEditor } from "@/components/admin/PriceEditor";
import { getSessionFromCookies } from "@/lib/auth";
import {
  getPublishedPriceCatalog,
  listPriceVersions,
} from "@/lib/repositories/prices";

export const metadata: Metadata = {
  title: "Цены — админ-панель",
  robots: { index: false, follow: false },
};

export default async function AdminPricesPage() {
  const session = await getSessionFromCookies();
  const [catalog, versions] = await Promise.all([
    getPublishedPriceCatalog(),
    listPriceVersions(),
  ]);

  return (
    <AdminShell title="Прайс-лист" email={session?.email}>
      <PriceEditor catalog={catalog} versions={versions} />
    </AdminShell>
  );
}
