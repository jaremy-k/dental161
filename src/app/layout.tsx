import type { Metadata } from "next";
import "./globals.css";
import { StickyMobileCta } from "@/components/StickyMobileCta";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.brand} — стоматология в Ростове-на-Дону`,
    template: `%s | ${site.brand}`,
  },
  description:
    "Сеть клиник ДенталКеа: имплантация, протезирование, терапия, ортодонтия и детская стоматология. Доступные цены, рассрочка, гарантия.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${site.brand} — стоматология в Ростове-на-Дону`,
    description:
      "Лечение зубов, имплантация, протезирование и детская стоматология в двух клиниках Ростова-на-Дону.",
    url: site.url,
    siteName: site.brand,
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brand} — стоматология в Ростове-на-Дону`,
    description:
      "Понятная смета до начала лечения, рассрочка 0% и экстренные окна при острой боли.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: site.name,
    alternateName: site.brand,
    url: site.url,
    telephone: site.phone,
    openingHours: "Mo-Sa 09:00-20:00",
    priceRange: "₽₽",
    address: site.locations.map((location) => ({
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressLocality: site.city,
      addressCountry: "RU",
    })),
    medicalSpecialty: [
      "Therapeutic dentistry",
      "Dental implants",
      "Prosthodontics",
      "Orthodontics",
      "Pediatric dentistry",
    ],
  };

  return (
    <html lang="ru">
      <body className="pb-20 font-sans md:pb-0">
        {children}
        <StickyMobileCta />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
