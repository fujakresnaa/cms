import { RegistrationForm } from "@/components/registration-form"
import { AnimatedBackground } from "@/components/animated-background"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pendaftaran Anggota Resmi | W205CI Club Indonesia",
  description: "Formulir pendaftaran resmi anggota W205CI Club Indonesia. Bergabunglah dengan komunitas pemilik Mercedes-Benz C-Class W205 dan nikmati berbagai keuntungan eksklusif.",
  keywords: ["Daftar W205CI", "Registrasi Club Mercy", "Mercedes-Benz C-Class Club", "Membership W205CI", "Komunitas Mercedes Indonesia"],
  alternates: {
    canonical: "/register",
  },
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center py-12 px-4 sm:px-6 lg:px-8">
        <RegistrationForm />
      </div>
    </main>
  )
}
