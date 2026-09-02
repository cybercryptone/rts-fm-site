import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import RadioSection from "@/components/RadioSection";
import LabelSection from "@/components/LabelSection";
import AboutFooter from "@/components/AboutFooter";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Ticker />
        <RadioSection />
        <LabelSection />
      </main>
      <AboutFooter />
    </>
  );
}
