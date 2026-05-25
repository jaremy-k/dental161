import { Advantages } from "@/components/Advantages";
import { Contacts } from "@/components/Contacts";
import { Footer } from "@/components/Footer";
import { Doctors } from "@/components/Doctors";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Prices } from "@/components/Prices";
import { Services } from "@/components/Services";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Advantages />
        <Doctors />
        <Prices />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
