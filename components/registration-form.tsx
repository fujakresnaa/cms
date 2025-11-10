"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Upload, AlertCircle } from "lucide-react"

type RegistrationStep = "registration" | "requirements" | "inauguration" | "member"

interface FormData {
  namaLengkap: string
  alamatEmail: string
  nomorTelephone: string
  tipeMobile: string
  tahunKendaraan: string
  chapterDomisili: string
  nomorPolisi: string
  fotoKendaraan: File | null
}

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("registration")
  const [formData, setFormData] = useState<FormData>({
    namaLengkap: "",
    alamatEmail: "",
    nomorTelephone: "",
    tipeMobile: "C180",
    tahunKendaraan: new Date().getFullYear().toString(),
    chapterDomisili: "Jakarta",
    nomorPolisi: "",
    fotoKendaraan: null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps: { id: RegistrationStep; label: string }[] = [
    { id: "registration", label: "Registration" },
    { id: "requirements", label: "Requirements" },
    { id: "inauguration", label: "Inauguration Process" },
    { id: "member", label: "Official Member" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          fotoKendaraan: "File size must be less than 5MB",
        }))
        return
      }
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          fotoKendaraan: "Only JPG, PNG, and WEBP formats are allowed",
        }))
        return
      }
      setFormData((prev) => ({
        ...prev,
        fotoKendaraan: file,
      }))
      setErrors((prev) => ({
        ...prev,
        fotoKendaraan: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.namaLengkap.trim()) newErrors.namaLengkap = "Full name is required"
    if (!formData.alamatEmail.trim()) newErrors.alamatEmail = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.alamatEmail)) {
      newErrors.alamatEmail = "Please enter a valid email"
    }
    if (!formData.nomorTelephone.trim()) newErrors.nomorTelephone = "Phone number is required"
    else if (!/^(\+62|08)[0-9]{9,}$/.test(formData.nomorTelephone.replace(/\s/g, ""))) {
      newErrors.nomorTelephone = "Please enter a valid Indonesian phone number"
    }
    if (!formData.nomorPolisi.trim()) newErrors.nomorPolisi = "License plate is required"
    if (!formData.fotoKendaraan) newErrors.fotoKendaraan = "Vehicle photo is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (currentStep === "registration") {
      if (validateForm()) {
        setCurrentStep("requirements")
      }
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("namaLengkap", formData.namaLengkap)
      formDataToSend.append("alamatEmail", formData.alamatEmail)
      formDataToSend.append("nomorTelephone", formData.nomorTelephone)
      formDataToSend.append("tipeMobile", formData.tipeMobile)
      formDataToSend.append("tahunKendaraan", formData.tahunKendaraan)
      formDataToSend.append("chapterDomisili", formData.chapterDomisili)
      formDataToSend.append("nomorPolisi", formData.nomorPolisi)
      if (formData.fotoKendaraan) {
        formDataToSend.append("fotoKendaraan", formData.fotoKendaraan)
      }

      const response = await fetch("/api/register", {
        method: "POST",
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setErrors({ submit: data.error || "Registration failed" })
        }
        return
      }

      setCurrentStep("member")
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress Stepper */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => {
                    if (index < steps.findIndex((s) => s.id === currentStep)) {
                      setCurrentStep(step.id)
                    }
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step.id === currentStep
                      ? "bg-primary text-white ring-4 ring-primary/30"
                      : steps.indexOf(step) < steps.findIndex((s) => s.id === currentStep)
                        ? "bg-primary text-white"
                        : "bg-white/20 text-white/60"
                  }`}
                >
                  {steps.indexOf(step) < steps.findIndex((s) => s.id === currentStep) ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>
                <span
                  className={`text-xs font-medium mt-2 ${step.id === currentStep ? "text-white" : "text-white/60"}`}
                >
                  {step.label}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded-full ${
                    steps.indexOf(step) < steps.findIndex((s) => s.id === currentStep) ? "bg-primary" : "bg-white/20"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card className="bg-white/95 backdrop-blur-sm border-white/20 p-8 md:p-12 rounded-2xl shadow-2xl">
        {currentStep === "registration" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-8">Member Registration</h2>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Full Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-lg bg-background border transition-colors ${
                  errors.namaLengkap ? "border-accent" : "border-border"
                } focus:outline-none focus:ring-2 focus:ring-primary/50`}
              />
              {errors.namaLengkap && (
                <p className="text-sm text-accent mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.namaLengkap}
                </p>
              )}
            </div>

            {/* Email and Car Variant */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email Address <span className="text-accent">*</span>
                </label>
                <input
                  type="email"
                  name="alamatEmail"
                  value={formData.alamatEmail}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={`w-full px-4 py-3 rounded-lg bg-background border transition-colors ${
                    errors.alamatEmail ? "border-accent" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                />
                {errors.alamatEmail && (
                  <p className="text-sm text-accent mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.alamatEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Car Variant <span className="text-accent">*</span>
                </label>
                <select
                  name="tipeMobile"
                  value={formData.tipeMobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="C180">C180</option>
                  <option value="C200">C200</option>
                  <option value="C250">C250</option>
                  <option value="C300">C300</option>
                  <option value="C43">C43</option>
                </select>
              </div>
            </div>

            {/* Phone and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Phone Number <span className="text-accent">*</span>
                </label>
                <input
                  type="tel"
                  name="nomorTelephone"
                  value={formData.nomorTelephone}
                  onChange={handleInputChange}
                  placeholder="+62 or 08"
                  className={`w-full px-4 py-3 rounded-lg bg-background border transition-colors ${
                    errors.nomorTelephone ? "border-accent" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                />
                {errors.nomorTelephone && (
                  <p className="text-sm text-accent mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.nomorTelephone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Year Car <span className="text-accent">*</span>
                </label>
                <input
                  type="number"
                  name="tahunKendaraan"
                  value={formData.tahunKendaraan}
                  onChange={handleInputChange}
                  min="1990"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* City and License Plate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  City/Domicile <span className="text-accent">*</span>
                </label>
                <select
                  name="chapterDomisili"
                  value={formData.chapterDomisili}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="Tangerang">Tangerang</option>
                  <option value="Jakarta">Jakarta</option>
                  <option value="Bekasi">Bekasi</option>
                  <option value="Bandung">Bandung</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  License Plate <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  name="nomorPolisi"
                  value={formData.nomorPolisi}
                  onChange={handleInputChange}
                  placeholder="Enter license plate"
                  className={`w-full px-4 py-3 rounded-lg bg-background border transition-colors ${
                    errors.nomorPolisi ? "border-accent" : "border-border"
                  } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                />
                {errors.nomorPolisi && (
                  <p className="text-sm text-accent mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.nomorPolisi}
                  </p>
                )}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Photo with Vehicle <span className="text-accent">*</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  errors.fotoKendaraan
                    ? "border-accent bg-accent/5"
                    : formData.fotoKendaraan
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
              >
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer block">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-foreground/60" />
                  <p className="font-medium text-foreground">
                    {formData.fotoKendaraan ? formData.fotoKendaraan.name : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-sm text-foreground/60 mt-1">PNG, JPG or WEBP (Max 5MB)</p>
                </label>
              </div>
              {errors.fotoKendaraan && (
                <p className="text-sm text-accent mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.fotoKendaraan}
                </p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-accent/10 border border-accent text-accent p-4 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{errors.submit}</span>
              </div>
            )}

            {/* Continue Button */}
            <Button onClick={handleNext} className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg">
              Continue Registration →
            </Button>
          </div>
        )}

        {currentStep === "requirements" && (
          <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground mb-8">
            SYARAT MENJADI MEMBER MERCEDES-BENZ W 205 CI
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-3 items-start">
              <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-bold text-foreground mb-2">1. Persyaratan Umum</p>
                <ul className="space-y-1 text-foreground/70">
                  <li>• Pemilik dan pengguna Mercedes-Benz W 205 (C-Class).</li>
                  <li>• Usia minimal 17 tahun atau memiliki SIM A aktif.</li>
                  <li>• Bersedia mengikuti AD/ART dan tata tertib komunitas.</li>
                  <li>• Memiliki semangat kebersamaan, persaudaraan, dan solidaritas.</li>
                </ul>
              </div>
            </div>
        
            <div className="flex gap-3 items-start">
              <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-bold text-foreground mb-2">2. Administrasi</p>
                <ul className="space-y-1 text-foreground/70">
                  <li>• Mengisi Formulir Pendaftaran Anggota (online/offline).</li>
                  <li>• Menyertakan fotokopi KTP dan STNK kendaraan.</li>
                  <li>• Membayar biaya registrasi dan iuran tahunan sesuai ketentuan komunitas.</li>
                </ul>
              </div>
            </div>
        
            <div className="flex gap-3 items-start">
              <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-bold text-foreground mb-2">3. Persyaratan Aktivitas Wajib</p>
                <ul className="space-y-1 text-foreground/70">
                  <li>• Mengikuti minimal 2 kali SOTR (Saturday On The Road) bersama komunitas.</li>
                  <li>• Mengikuti minimal 1 kali touring menginap bersama komunitas.</li>
                  <li>• Aktif berpartisipasi dalam kegiatan resmi komunitas maupun nasional.</li>
                </ul>
              </div>
            </div>
        
            <div className="flex gap-3 items-start">
              <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-bold text-foreground mb-2">4. Hak Member</p>
                <ul className="space-y-1 text-foreground/70">
                  <li>• Mendapat KTA (Kartu Tanda Anggota) resmi Mercedes-Benz W 205 CI.</li>
                  <li>• Berhak mengikuti semua kegiatan resmi komunitas maupun nasional.</li>
                  <li>• Akses ke merchandise resmi, grup komunikasi, dan jaringan komunitas.</li>
                  <li>• Kesempatan mengikuti event, touring, gathering, dan jamboree nasional.</li>
                </ul>
              </div>
            </div>
        
            <div className="flex gap-3 items-start">
              <Check className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="font-bold text-foreground mb-2">5. Kewajiban Member</p>
                <ul className="space-y-1 text-foreground/70">
                  <li>• Menjaga nama baik komunitas di jalan maupun di luar komunitas.</li>
                  <li>• Aktif dalam kegiatan komunitas dan mendukung program bersama.</li>
                  <li>• Membayar iuran tepat waktu.</li>
                  <li>• Menjaga sikap saling menghormati antar anggota tanpa memandang latar belakang.</li>
                </ul>
              </div>
            </div>
          </div>
        
          <div className="border-t border-border pt-6 mt-8 flex gap-4">
            <Button onClick={() => setCurrentStep("registration")} variant="outline" className="flex-1">
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep("inauguration")}
              className="flex-1 bg-primary hover:bg-primary/90 text-white"
            >
              Continue
            </Button>
          </div>
        </div>
        )}

        {currentStep === "inauguration" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-8">Inauguration Process</h2>
            <div className="space-y-4 text-foreground/70">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  1
                </div>
                <div>
                  <p className="font-semibold text-foreground">Application Review</p>
                  <p className="text-sm">Our team reviews your application within 3-5 business days</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  2
                </div>
                <div>
                  <p className="font-semibold text-foreground">Member Verification</p>
                  <p className="text-sm">Verification of vehicle and personal information</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  3
                </div>
                <div>
                  <p className="font-semibold text-foreground">Welcome Meeting</p>
                  <p className="text-sm">Attend our welcome gathering with existing members</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  4
                </div>
                <div>
                  <p className="font-semibold text-foreground">Official Membership</p>
                  <p className="text-sm">Receive your member certificate and ID</p>
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-6 mt-8 flex gap-4">
              <Button onClick={() => setCurrentStep("requirements")} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </div>
          </div>
        )}

        {currentStep === "member" && (
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Application Submitted!</h2>
            <p className="text-foreground/70 max-w-sm mx-auto">
              Thank you for applying to Mercedes-Benz W205CI Club Indonesia. We will review your application and contact
              you within 3-5 business days.
            </p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
            >
              Return to Home
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
