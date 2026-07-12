import type { MetadataRoute } from "next";
import { getPublicClinics } from "@/lib/repositories/clinics";
import { dentalServices } from "@/lib/services";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const locations = await getPublicClinics();

  const staticPages = [
    "",
    "/clinics",
    "/services",
    "/price",
    "/o-nas",
    "/privacy",
    "/requisites",
  ].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const servicePages = dentalServices.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const clinicPages = locations.map((location) => ({
    url: `${site.url}/clinics/${location.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  return [...staticPages, ...servicePages, ...clinicPages];
}
