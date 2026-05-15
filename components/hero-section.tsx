"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

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
    <section className="relative h-screen min-h-[700px] w-full overflow-hidden bg-black flex items-center justify-center">
      {/* Background with Mouse Parallax */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{ 
          x: mousePosition.x,
          y: mousePosition.y,
          scale: 1.05
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10" />
        <img
          src={heroData.background_image_url || "/images/MercedesBenz.jpg"}
          alt="Mercedes-Benz W205"
          className="h-full w-full object-cover opacity-80"
        />
      </motion.div>

      {/* Floating Ambient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -120, 80, 0],
            y: [0, 100, -60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(212,175,55,1)]" />
          <span className="font-accent text-white/80">W205CI CLUB INDONESIA</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-sans font-bold mb-8 leading-tight tracking-tight text-white drop-shadow-2xl relative"
        >
          <span className="relative inline-block">
            {heroData.title}
            <motion.div 
              initial={{ left: "-100%" }}
              animate={{ left: "200%" }}
              transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 4 }}
              className="absolute top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] z-10 pointer-events-none"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg md:text-2xl text-white/70 max-w-2xl mx-auto mb-14 leading-relaxed font-light"
        >
          {heroData.description}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/register">
            <Button size="lg" className="bg-metallic-gold text-primary-foreground px-12 py-7 text-base font-semibold tracking-wide rounded-sm shadow-[0_0_30px_rgba(212,175,55,0.2)] transition-all hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:scale-105 border-0">
              {heroData.button_text}
            </Button>
          </Link>
        </motion.div>
      </div>
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="font-accent text-[8px] text-white/40 tracking-[0.3em]">EXPLORE</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary/60 to-transparent relative overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 w-full h-1/2 bg-white"
          />
        </div>
      </motion.div>
    </section>
  )
}