import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { EventsSection } from "@/components/events-section"
import { MembershipSection } from "@/components/membership-section"
import { ShowcaseSection } from "@/components/showcase-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutSection />
      <EventsSection />
      <MembershipSection />
      <ShowcaseSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
