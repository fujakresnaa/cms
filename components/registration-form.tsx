"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Upload, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

    if (!formData.nomorTelephone.trim()) {
      newErrors.nomorTelephone = "Phone number is required"
    } else {
      const phoneClean = formData.nomorTelephone.replace(/\s/g, "")
      if (!/^(\+62|08)[0-9]{9,}$/.test(phoneClean)) {
        newErrors.nomorTelephone = "Enter a valid phone number (+62 or 08...)"
      }
    }

    if (!formData.tipeMobile.trim()) newErrors.tipeMobile = "Car variant is required"
    if (!formData.tahunKendaraan.trim()) newErrors.tahunKendaraan = "Year is required"
    if (!formData.chapterDomisili.trim()) newErrors.chapterDomisili = "City is required"
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
    setErrors({}) // Clear previous errors

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
          // If there are specific field errors, go back to the first step
          const fieldWithError = Object.keys(data.errors).find(key => key !== 'submit')
          if (fieldWithError) {
            setCurrentStep("registration")
          }
        } else {
          setErrors({ submit: data.error || "Registration failed" })
        }
        return
      }

      setCurrentStep("member")
    } catch (error) {
      setErrors({ submit: "A connection error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Styles
  const glassCard = "bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
  const inputStyle = "w-full px-4 py-3 rounded-lg bg-black/20 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all font-sans"
  const labelStyle = "block text-sm font-semibold text-white/90 mb-2 font-serif tracking-wide"
  const headingStyle = "text-3xl font-serif font-bold text-white mb-8"

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.4 }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Stepper */}
      <div className="mb-12 relative px-4">
        <div className="flex items-center justify-between relative z-10">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative group cursor-pointer"
              onClick={() => {
                if (index < steps.findIndex((s) => s.id === currentStep)) {
                  setCurrentStep(step.id)
                }
              }}>
              <motion.div
                initial={false}
                animate={{
                  scale: step.id === currentStep ? 1.1 : 1,
                  backgroundColor: step.id === currentStep || steps.indexOf(step) < steps.findIndex((s) => s.id === currentStep) ? "#D4AF37" : "rgba(255,255,255,0.1)",
                  borderColor: step.id === currentStep ? "#D4AF37" : "rgba(255,255,255,0.2)"
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 shadow-lg transition-colors duration-300 ${step.id === currentStep || steps.indexOf(step) < steps.findIndex((s) => s.id === currentStep)
                  ? "text-black"
                  : "text-white/60"
                  }`}
              >
                {steps.indexOf(step) < steps.findIndex((s) => s.id === currentStep) ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              <div className="absolute top-14 w-32 text-center">
                <span
                  className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${step.id === currentStep ? "text-[#D4AF37]" : "text-white/40"
                    }`}
                >
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Connection Lines */}
        <div className="absolute top-6 left-0 w-full px-12 sm:px-16 -z-0">
          <div className="h-0.5 w-full bg-white/10 rounded-full" />
          <motion.div
            className="absolute top-0 left-12 sm:left-16 h-0.5 bg-[#D4AF37] rounded-full"
            initial={false}
            animate={{ width: `${(steps.findIndex((s) => s.id === currentStep) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{ maxWidth: 'calc(100% - 6rem)' }}
          />
        </div>
      </div>

      {/* Form Content */}
      <Card className={`${glassCard} p-8 md:p-12 overflow-hidden relative`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50" />

        <AnimatePresence mode="wait">
          {currentStep === "registration" && (
            <motion.div key="registration" {...fadeIn} className="space-y-6">
              <h2 className={headingStyle}>Member Registration</h2>

              {/* Full Name */}
              <div>
                <label className={labelStyle}>
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="namaLengkap"
                  value={formData.namaLengkap}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`${inputStyle} ${errors.namaLengkap ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
                />
                {errors.namaLengkap && (
                  <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.namaLengkap}
                  </p>
                )}
              </div>

              {/* Email and Car Variant */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="alamatEmail"
                    value={formData.alamatEmail}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={`${inputStyle} ${errors.alamatEmail ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
                  />
                  {errors.alamatEmail && (
                    <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.alamatEmail}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelStyle}>
                    Car Variant <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="tipeMobile"
                      value={formData.tipeMobile}
                      onChange={handleInputChange}
                      className={`${inputStyle} appearance-none cursor-pointer`}
                    >
                      <option value="C180" className="text-black">C180</option>
                      <option value="C200" className="text-black">C200</option>
                      <option value="C250" className="text-black">C250</option>
                      <option value="C300" className="text-black">C300</option>
                      <option value="C43" className="text-black">C43</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                      <ChevronRight className="w-5 h-5 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone and Year */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="nomorTelephone"
                    value={formData.nomorTelephone}
                    onChange={handleInputChange}
                    placeholder="+62 or 08"
                    className={`${inputStyle} ${errors.nomorTelephone ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
                  />
                  {errors.nomorTelephone && (
                    <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.nomorTelephone}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelStyle}>
                    Year Car <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    name="tahunKendaraan"
                    value={formData.tahunKendaraan}
                    onChange={handleInputChange}
                    min="1990"
                    max={new Date().getFullYear()}
                    className={inputStyle}
                  />
                </div>
              </div>

              {/* City and License Plate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}>
                    City/Domicile <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="chapterDomisili"
                      value={formData.chapterDomisili}
                      onChange={handleInputChange}
                      className={`${inputStyle} appearance-none cursor-pointer`}
                    >
                      <option value="Tangerang" className="text-black">Tangerang</option>
                      <option value="Jakarta" className="text-black">Jakarta</option>
                      <option value="Bekasi" className="text-black">Bekasi</option>
                      <option value="Bandung" className="text-black">Bandung</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                      <ChevronRight className="w-5 h-5 rotate-90" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelStyle}>
                    License Plate <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="nomorPolisi"
                    value={formData.nomorPolisi}
                    onChange={handleInputChange}
                    placeholder="Enter license plate"
                    className={`${inputStyle} ${errors.nomorPolisi ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""}`}
                  />
                  {errors.nomorPolisi && (
                    <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.nomorPolisi}
                    </p>
                  )}
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className={labelStyle}>
                  Photo with Vehicle <span className="text-red-400">*</span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all group ${errors.fotoKendaraan
                    ? "border-red-400 bg-red-400/5"
                    : formData.fotoKendaraan
                      ? "border-[#D4AF37] bg-[#D4AF37]/5"
                      : "border-white/20 hover:border-[#D4AF37]/50 hover:bg-white/5"
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
                    <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center transition-colors ${formData.fotoKendaraan ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "bg-white/5 text-white/40 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37]"
                      }`}>
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="font-medium text-white text-lg">
                      {formData.fotoKendaraan ? formData.fotoKendaraan.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-white/40 mt-2">PNG, JPG or WEBP (Max 5MB)</p>
                  </label>
                </div>
                {errors.fotoKendaraan && (
                  <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.fotoKendaraan}
                  </p>
                )}
              </div>

              {errors.submit && (
                <div className="bg-red-400/10 border border-red-400 text-red-400 p-4 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{errors.submit}</span>
                </div>
              )}

              {/* Continue Button */}
              <Button onClick={handleNext} className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-black py-6 text-lg font-bold shadow-lg shadow-[#D4AF37]/20 transition-all hover:scale-[1.01]">
                Continue Registration <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {currentStep === "requirements" && (
            <motion.div key="requirements" {...fadeIn} className="space-y-6">
              <h2 className={headingStyle}>
                Terms & Requirements
              </h2>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex gap-4 items-start p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#D4AF37] font-bold">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-serif font-bold text-white mb-2 text-lg">General Requirements</p>
                    <ul className="space-y-2 text-white/70">
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" /> Owner and user of Mercedes-Benz W 205 (C-Class).</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" /> Minimum age 17 years or active driver's license.</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" /> Willing to follow AD/ART and community rules.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#D4AF37] font-bold">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-serif font-bold text-white mb-2 text-lg">Administration</p>
                    <ul className="space-y-2 text-white/70">
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" /> Fill out Member Registration Form.</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" /> Provide KTP and STNK copy.</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" /> Pay registration and annual fees.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 items-start p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#D4AF37] font-bold">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-serif font-bold text-white mb-2 text-lg">Mandatory Activities</p>
                    <ul className="space-y-2 text-white/70">
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" /> Join at least 2 SOTR events.</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" /> Join at least 1 touring event.</li>
                      <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-2 flex-shrink-0" /> Active participation in official events.</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <p className="text-[#D4AF37] text-sm text-center italic">By continuing, you acknowledge that you have read and agreed to these requirements.</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => setCurrentStep("registration")} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 py-6">
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep("inauguration")}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#B5952F] text-black py-6 text-lg font-bold shadow-lg"
                >
                  I Agree & Continue
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === "inauguration" && (
            <motion.div key="inauguration" {...fadeIn} className="space-y-8">
              <h2 className={headingStyle}>Inauguration Journey</h2>

              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#D4AF37] via-white/20 to-transparent" />

                <div className="space-y-8 relative">
                  <div className="flex gap-6 items-center group">
                    <div className="w-16 h-16 rounded-full bg-[#0f0f0f] border-2 border-[#D4AF37] flex items-center justify-center flex-shrink-0 z-10 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                      <span className="text-xl font-bold text-[#D4AF37]">1</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex-1 group-hover:border-[#D4AF37]/30 transition-colors">
                      <h3 className="text-lg font-bold text-white">Application Review</h3>
                      <p className="text-white/60 text-sm">Our team will review your submission within 3-5 business days.</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-center group">
                    <div className="w-16 h-16 rounded-full bg-[#0f0f0f] border-2 border-white/20 flex items-center justify-center flex-shrink-0 z-10 bg-[#0f0f0f]">
                      <span className="text-xl font-bold text-white/40">2</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex-1">
                      <h3 className="text-lg font-bold text-white">Verification</h3>
                      <p className="text-white/60 text-sm">We verify your vehicle details and personal information.</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-center group">
                    <div className="w-16 h-16 rounded-full bg-[#0f0f0f] border-2 border-white/20 flex items-center justify-center flex-shrink-0 z-10 bg-[#0f0f0f]">
                      <span className="text-xl font-bold text-white/40">3</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex-1">
                      <h3 className="text-lg font-bold text-white">Welcome Event</h3>
                      <p className="text-white/60 text-sm">Join us at the next gathering to meet the family.</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-center group">
                    <div className="w-16 h-16 rounded-full bg-[#0f0f0f] border-2 border-white/20 flex items-center justify-center flex-shrink-0 z-10 bg-[#0f0f0f]">
                      <span className="text-xl font-bold text-white/40">4</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex-1">
                      <h3 className="text-lg font-bold text-white">Official Member</h3>
                      <p className="text-white/60 text-sm">Receive your official ID and starter kit.</p>
                    </div>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <div className="bg-red-400/10 border border-red-400 text-red-400 p-4 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{errors.submit}</span>
                </div>
              )}

              <div className="flex gap-4 pt-8">
                <Button onClick={() => setCurrentStep("requirements")} variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10 py-6">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#B5952F] text-black py-6 text-lg font-bold shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                      />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {currentStep === "member" && (
            <motion.div key="member" {...fadeIn} className="text-center space-y-8 py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(212,175,55,0.5)]"
              >
                <Check className="w-12 h-12 text-black" />
              </motion.div>

              <div className="space-y-4">
                <h2 className="text-4xl font-serif font-bold text-white">Application Received</h2>
                <p className="text-white/70 max-w-md mx-auto text-lg leading-relaxed">
                  Thank you for applying to the <span className="text-[#D4AF37] font-semibold">Mercedes-Benz W205CI Club Indonesia</span>.
                </p>
                <div className="p-4 bg-white/5 rounded-lg max-w-sm mx-auto border border-white/10">
                  <p className="text-white/60 text-sm">We will contact you via email or WhatsApp within 3-5 business days regarding the next steps.</p>
                </div>
              </div>

              <Button
                onClick={() => (window.location.href = "/")}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full border border-white/20 backdrop-blur-sm transition-all hover:scale-105"
              >
                Return to Home
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}
