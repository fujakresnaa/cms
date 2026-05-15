export const dynamic = 'force-dynamic'

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Apa itu W205CI Club Indonesia?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "W205CI Club Indonesia adalah komunitas resmi bagi pemilik dan pecinta Mercedes-Benz C-Class seri W205 di Indonesia, yang berfokus pada persaudaraan, hobi otomotif, dan gaya hidup premium."
                }
              },
              {
                "@type": "Question",
                "name": "Bagaimana cara menjadi member Club Mercy W205CI?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Anda dapat mendaftar melalui website resmi kami di menu Registration. Calon member wajib memiliki unit Mercedes-Benz W205 dan mengikuti proses verifikasi komunitas."
                }
              },
              {
                "@type": "Question",
                "name": "Apa saja kegiatan rutin club Mercy ini?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Kegiatan kami meliputi Sunday Morning Ride (Sunmori), Night Drive, Touring antar kota, Technical Sharing, dan bakti sosial."
                }
              }
            ]
          })
        }}
      />
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
