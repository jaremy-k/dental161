import { Advantages } from "@/components/Advantages";
import { Contacts } from "@/components/Contacts";
import { Footer } from "@/components/Footer";
import { Doctors } from "@/components/Doctors";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Prices } from "@/components/Prices";
import { Services } from "@/components/Services";
import { getPublicClinics } from "@/lib/repositories/clinics";
import { getPublicDoctors } from "@/lib/repositories/doctors";
import { getPublishedPriceCatalog } from "@/lib/repositories/prices";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [doctors, priceCatalog, locations] = await Promise.all([
    getPublicDoctors(),
    getPublishedPriceCatalog(),
    getPublicClinics(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Advantages />
        <Doctors doctors={doctors} />
        <Prices catalog={priceCatalog} />
        <Contacts locations={locations} />
      </main>
      <Footer />
    </>
  );
}
