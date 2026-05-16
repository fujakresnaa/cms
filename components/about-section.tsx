"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface AboutContent {
  title: string
  description: string
  button_text: string
  image_url_1?: string
  image_url_2?: string
}

export function AboutSection() {
  // CHANGE: Added state to manage about content from database
  const [about, setAbout] = useState<AboutContent>({
    title: "The Mercedes-Benz W205CI Club is more than a club",
    description:
      "The Mercedes-Benz W205CI Club is more than a gathering of car owners — it is a family built on passion, solidarity, and premium lifestyle. Founded by enthusiasts, for enthusiasts, we are dedicated to celebrating the timeless elegance and driving experience of the W205CI.",
    button_text: "Learn More",
    image_url_1: "/car-club-members-meeting-luxury.jpg",
    image_url_2: "/luxury-car-steering-wheel-dashboard-premium-interi.jpg",
  })
  const [isExpanded, setIsExpanded] = useState(false)
  const isLongDescription = about.description.length > 200
  const displayDescription = isLongDescription && !isExpanded 
    ? about.description.slice(0, 200) + "..." 
    : about.description

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await fetch("/api/cms/about")
        const data = await response.json()
        if (data) {
          setAbout({
            title: data.title || about.title,
            description: data.description || about.description,
            button_text: data.button_text || about.button_text,
            image_url_1: data.image_url_1 || about.image_url_1,
            image_url_2: data.image_url_2 || about.image_url_2,
          })
        }
      } catch (error) {
        console.error("Error fetching about content:", error)
      }
    }

    fetchAbout()
  }, [])

  return (
    <section id="about" className="py-32 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(212,175,55,0.05)_0%,_transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,_rgba(212,175,55,0.05)_0%,_transparent_50%)]"></div>
      
      {/* Technical Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      
      {/* Floating Abstract Shapes */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 -left-20 w-64 h-64 border border-primary/10 rounded-full -z-0 opacity-20"
      />
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 -right-20 w-80 h-80 border border-primary/10 rounded-full -z-0 opacity-20"
      />

      {/* Geometric Abstract Graphics */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.05]" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,50 L100,50 M50,0 L50,100" stroke="var(--primary)" strokeWidth="0.1" fill="none" />
        <circle cx="20" cy="30" r="15" stroke="var(--primary)" strokeWidth="0.05" fill="none" />
        <circle cx="80" cy="70" r="20" stroke="var(--primary)" strokeWidth="0.05" fill="none" />
        <path d="M0,0 L100,100 M100,0 L0,100" stroke="var(--primary)" strokeWidth="0.03" fill="none" />
      </svg>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Left - Stacked Images */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1"
          >
            {/* Background Decorative Frame */}
            <div className="absolute -inset-4 border border-primary/10 -z-10 translate-x-4 translate-y-4"></div>
            
            {/* Image 1 (Bottom Stack) */}
            <div className="relative z-0 w-4/5 ml-auto overflow-hidden rounded-sm border border-white/5 shadow-2xl aspect-[4/5]">
              <Image 
                src={about.image_url_2 || "/luxury-car-steering-wheel-dashboard-premium-interi.jpg"} 
                alt="About W205CI 1" 
                fill
                className="object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
            
            {/* Image 2 (Top Stack) */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute top-1/4 left-0 z-10 w-3/4 aspect-[4/5] overflow-hidden rounded-sm border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              <Image 
                src={about.image_url_1 || "/car-club-members-meeting-luxury.jpg"} 
                alt="About W205CI 2" 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </motion.div>

            {/* Floating Detail */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-full flex items-center justify-center -z-10 animate-pulse">
              <div className="w-24 h-24 border border-primary/30 rounded-full border-dashed"></div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-left order-1 lg:order-2"
          >
            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="font-accent text-primary tracking-[0.3em] uppercase">● ABOUT MBW205CI</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-sans font-bold text-foreground mb-10 leading-tight tracking-tight text-pretty">
              {about.title}
            </h2>

            {/* Description */}
            <div className="mb-12">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                {displayDescription}
              </p>
              {isLongDescription && (
                <button 
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-6 text-primary font-accent text-xs tracking-[0.2em] hover:opacity-70 transition-opacity uppercase border-b border-primary/30 pb-1"
                >
                  {isExpanded ? "↑ Show Less" : "↓ Read More"}
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
