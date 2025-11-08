"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

interface ContactData {
  id: string
  title: string
  description: string
  phone: string
  email: string
}

export function ContactSection() {
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch("/api/cms/contact")
        const data = await response.json()
        setContactData(data)
      } catch (error) {
        console.error("[mrc] Error fetching contact data:", error)
        setContactData({
          id: "default",
          title: "Get in touch",
          description: "Our friendly team would love to hear from you. Send us a message anytime.",
          phone: "+62 XXX XXXX XXXX",
          email: "info@mbw205ci.com",
        })
      }
    }

    fetchContactData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitMessage("Message sent successfully!")
        setFormData({ first_name: "", last_name: "", email: "", message: "" })
      } else {
        setSubmitMessage("Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("[mrc] Error:", error)
      setSubmitMessage("Error sending message.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Contact Form */}
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 text-pretty">
              {contactData?.title || "Get in touch"}
            </h2>
            <p className="text-gray-600 mb-12 text-lg leading-relaxed">
              {contactData?.description || "Our friendly team would love to hear from you. Send us a message anytime."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                  <Input
                    name="first_name"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="border-gray-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                  <Input
                    name="last_name"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="border-gray-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-gray-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <Textarea
                  name="message"
                  placeholder="Tell us about your W205CI..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="border-gray-300"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-base"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
              {submitMessage && (
                <p className={`text-sm ${submitMessage.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                  {submitMessage}
                </p>
              )}
            </form>

            {contactData && (
              <div className="mt-12 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">{contactData.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{contactData.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right - Contact Image */}
          <div className="relative overflow-hidden rounded-lg shadow-2xl h-96 lg:h-full">
            <img
              src="/luxury-car-steering-wheel-dashboard-premium-interi.jpg"
              alt="Mercedes W205CI Interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
