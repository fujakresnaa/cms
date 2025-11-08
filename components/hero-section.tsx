"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroData {
  id: string
  title: string
  description: string
  button_text: string
  background_image_url?: string
  _timestamp?: number
}

export function HeroSection() {
  const [hero, setHero] = useState<HeroData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastTimestamp, setLastTimestamp] = useState<number>(0)

  const fetchHero = useCallback(async (forceRefresh = false) => {
    try {
      const url = `/api/cms/hero${forceRefresh ? `?_t=${Date.now()}` : ""}`
      const response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("[Hero] Hero data fetched:", data)
      
      if (data) {
        // Only update if timestamp is different to prevent unnecessary re-renders
        if (data._timestamp && data._timestamp !== lastTimestamp) {
          setLastTimestamp(data._timestamp)
          setHero(data)
          console.log("[Hero] Data updated with new timestamp:", data._timestamp)
        } else if (!hero) {
          // Only set data if we don't have any yet
          setHero(data)
        }
      } else {
        // Set default values if no data returned
        setHero({
          id: "default",
          title: "Your Journey with MBW205CI Starts Here",
          description:
            "Register now to become part of an exclusive community of Mercedes Benz W205 owners in Indonesia. More than a club, MBW205CI is a family built on passion, solidarity, and premium lifestyle.",
          button_text: "Continue Registration →",
        })
      }
    } catch (error) {
      console.error("[Hero] Error fetching hero:", error)
      // Set default values if fetch fails
      setHero({
        id: "default",
        title: "Your Journey with MBW205CI Starts Here",
        description:
          "Register now to become part of an exclusive community of Mercedes Benz W205 owners in Indonesia. More than a club, MBW205CI is a family built on passion, solidarity, and premium lifestyle.",
        button_text: "Continue Registration →",
      })
    } finally {
      setLoading(false)
    }
  }, [lastTimestamp, hero])

  useEffect(() => {
    // Only fetch once on mount
    fetchHero(true)
  }, []) // Remove fetchHero from dependencies to prevent loops

  // Only listen for storage events (when admin updates data in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hero-updated') {
        console.log("[Hero] Storage event detected, refreshing data")
        fetchHero(true)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [fetchHero])

  const heroData = hero || {
    id: "default",
    title: "Your Journey with MBW205CI Starts Here",
    description:
      "Register now to become part of an exclusive community of Mercedes Benz W205 owners in Indonesia. More than a club, MBW205CI is a family built on passion, solidarity, and premium lifestyle.",
    button_text: "Continue Registration →",
  }

  if (loading) {
    return (
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="text-white text-lg">Loading...</div>
      </section>
    )
  }

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-16">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: heroData.background_image_url
            ? `url(${heroData.background_image_url})`
            : "url(/images/MercedesBenz.jpg)",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="mb-8 flex justify-center items-center gap-3">
          <span className="text-sm font-semibold text-white/90 tracking-widest">MBW205CI</span>
          <div className="w-6 h-6 rounded-full border-2 border-white/80 flex items-center justify-center">
            <div className="w-2 h-2 bg-white/80 rounded-full"></div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-pretty">{heroData.title}</h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-white/90 mb-10 max-w-3xl mx-auto text-pretty leading-relaxed">
          {heroData.description}
        </p>

        {/* CTA Button */}
        <Link href="/register">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-base font-semibold">
            {heroData.button_text}
          </Button>
        </Link>
      </div>
    </section>
  )
}