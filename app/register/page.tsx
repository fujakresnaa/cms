import { RegistrationForm } from "@/components/registration-form"

export default function RegisterPage() {
  return (
    <main className="min-h-screen relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(/c300.jpg?height=1080&width=1920&query=mercedes-benz-w205ci-luxury-front-city-street-bokeh)",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center py-12 px-4 sm:px-6 lg:px-8">
        <RegistrationForm />
      </div>
    </main>
  )
}
