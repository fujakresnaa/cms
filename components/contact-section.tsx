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
      
      {/* Abstract Background Accents */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>
      
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
                  <p className="text-xl font-sans font-bold text-foreground tracking-wide">{contactData?.phone}</p>
                </div>
                <div className="group/info">
                  <p className="font-accent text-primary mb-2 opacity-70 group-hover/info:opacity-100 transition-opacity">● Email</p>
                  <p className="text-xl font-sans font-bold text-foreground tracking-wide">{contactData?.email}</p>
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
            className="relative h-96 lg:h-full group flex items-center justify-center p-8"
          >
            {/* Abstract Graphics STRICTLY BEHIND Image */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] -z-10"></div>
            
            {/* Larger Geometric Lines Behind */}
            <svg className="absolute -inset-4 w-[110%] h-[110%] pointer-events-none opacity-30 -z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,20 L100,0 M0,80 L100,100 M20,0 L0,100 M80,0 L100,100 M50,0 L50,100 M0,50 L100,50" stroke="currentColor" strokeWidth="0.05" fill="none" className="text-primary" />
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.05" fill="none" className="text-primary/40" />
            </svg>

            {/* Decorative Corner Accents Behind */}
            <div className="absolute top-0 left-0 w-32 h-32 border-l border-t border-primary/20 -z-10"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r border-b border-primary/20 -z-10"></div>

            <div className="relative overflow-hidden rounded-sm w-full h-full border border-white/5 shadow-2xl z-0">
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent z-10"></div>
              <img
                src="/luxury-car-steering-wheel-dashboard-premium-interi.jpg"
                alt="Mercedes W205CI Interior"
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              />
            </div>
            
            {/* Floating Element Outside/Beside Image */}
            <motion.div 
              animate={{ 
                y: [0, -10, 0],
                x: [0, 5, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 p-4 bg-card/80 backdrop-blur-xl border border-primary/20 rounded-sm z-20 hidden xl:block shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                  <p className="font-accent text-[8px] opacity-60">RESPONSE</p>
                  <p className="text-xs font-bold tracking-widest">RAPID</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
