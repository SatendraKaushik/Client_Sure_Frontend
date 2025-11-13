import Header from "./component/header";
import Hero from "./component/hero";
import PricingSection from "./component/pricing-section";
import Footer from "./component/footer";

export default function Home() {
  return (
    <main className="bg-white text-black overflow-x-hidden">
      <Header/>
      <Hero />
      <PricingSection />
      <Footer />
    </main>
  )
}
