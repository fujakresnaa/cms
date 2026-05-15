"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

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
    <section id="contact" className="py-32 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden ambient-glow">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-4">
              <span className="font-accent text-primary">● CONTACT</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-foreground mb-6 text-pretty tracking-tight">
              {contactData?.title || "Get in touch"}
            </h2>
            <p className="text-muted-foreground mb-12 text-lg leading-relaxed font-light">
              {contactData?.description || "Our friendly team would love to hear from you. Send us a message anytime."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-accent text-[10px] text-muted-foreground mb-2 block">First name</label>
                  <Input
                    name="first_name"
                    placeholder="First name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="border-border/50 bg-card/50 focus:bg-card focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="font-accent text-[10px] text-muted-foreground mb-2 block">Last name</label>
                  <Input
                    name="last_name"
                    placeholder="Last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="border-border/50 bg-card/50 focus:bg-card focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-accent text-[10px] text-muted-foreground mb-2 block">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="border-border/50 bg-card/50 focus:bg-card focus:border-primary/50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="font-accent text-[10px] text-muted-foreground mb-2 block">Message</label>
                <Textarea
                  name="message"
                  placeholder="Tell us about your W205CI..."
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="border-border/50 bg-card/50 focus:bg-card focus:border-primary/50 transition-colors resize-none"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-metallic-gold text-primary-foreground py-7 text-base font-bold tracking-widest rounded-sm transition-all hover:scale-[1.02] shadow-lg border-0"
              >
                {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
              </Button>
              {submitMessage && (
                <p className={`text-sm ${submitMessage.includes("successfully") ? "text-green-500" : "text-destructive"}`}>
                  {submitMessage}
                </p>
              )}
            </form>

            {contactData && (
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-border/40 pt-10">
                <div className="group/info">
                  <p className="font-accent text-primary mb-2 opacity-70 group-hover/info:opacity-100 transition-opacity">● Phone</p>
                  <p className="text-xl font-sans font-bold text-foreground tracking-wide">{contactData.phone}</p>
                </div>
                <div className="group/info">
                  <p className="font-accent text-primary mb-2 opacity-70 group-hover/info:opacity-100 transition-opacity">● Email</p>
                  <p className="text-xl font-sans font-bold text-foreground tracking-wide">{contactData.email}</p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right - Contact Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative overflow-hidden rounded-sm h-96 lg:h-full border border-white/5 group shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10"></div>
            <img
              src="/luxury-car-steering-wheel-dashboard-premium-interi.jpg"
              alt="Mercedes W205CI Interior"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
