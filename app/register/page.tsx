import { RegistrationForm } from "@/components/registration-form"
import { AnimatedBackground } from "@/components/animated-background"

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
