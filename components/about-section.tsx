"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

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
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-block mb-6">
            <span className="text-xs font-semibold text-gray-600 tracking-widest">● ABOUT US</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-10 leading-tight text-pretty">
            {about.title}
          </h2>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto whitespace-pre-wrap">{about.description}</p>

          {/* CTA Button */}
          <Link href="#events">
            <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 text-base">
              {about.button_text}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
