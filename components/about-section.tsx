"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AboutContent {
  title: string
  description: string
  button_text: string
}

export function AboutSection() {
  // CHANGE: Added state to manage about content from database
  const [about, setAbout] = useState<AboutContent>({
    title: "The Mercedes-Benz W205CI Club is more than a club",
    description:
      "The Mercedes-Benz W205CI Club is more than a gathering of car owners — it is a family built on passion, solidarity, and premium lifestyle. Founded by enthusiasts, for enthusiasts, we are dedicated to celebrating the timeless elegance and driving experience of the W205CI.",
    button_text: "Learn More",
  })

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
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <div className="inline-block mb-4">
            <span className="font-accent text-primary">● ABOUT MBW205CI</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-foreground mb-10 leading-tight text-pretty tracking-tight">
            {about.title}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto whitespace-pre-wrap font-light">
            {about.description}
          </p>

          {/* CTA Button */}
          <Link href="#events">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base tracking-wide rounded-sm transition-all hover:scale-105">
              {about.button_text}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
