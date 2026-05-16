"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

interface MembershipData {
  id: string
  title: string
  subtitle: string
  description: string
  image_url: string
  stats: Array<{ label: string; value: string }>
}

export function MembershipSection() {
  const [membership, setMembership] = useState<MembershipData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const response = await fetch("/api/cms/membership")
        const data = await response.json()
        setMembership(data)
      } catch (error) {
        console.error("[mrc] Error fetching membership:", error)
        // Set default values
        setMembership({
          id: "default",
          title: "Join the Brotherhood",
          subtitle: "● THE BROTHERHOOD",
          description: "Be part of an exclusive circle of W205CI enthusiasts",
          image_url: "/car-club-members-meeting-luxury.jpg",
          stats: [
            { label: "Member Club", value: "120+" },
            { label: "Events Club", value: "64+" },
            { label: "Partner W205CI", value: "20+" },
          ],
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMembership()
  }, [])

  const membershipData = membership || {
    id: "default",
    title: "Join the Brotherhood",
    subtitle: "● THE BROTHERHOOD",
    description: "Be part of an exclusive circle of W205CI enthusiasts",
    image_url: "/car-club-members-meeting-luxury.jpg",
    stats: [
      { label: "Member Club", value: "120+" },
      { label: "Events Club", value: "64+" },
      { label: "Partner W205CI", value: "20+" },
    ],
  }

  if (loading) return null

  return (
    <section id="membership" className="py-32 px-4 sm:px-6 lg:px-8 relative bg-secondary/5 ambient-glow overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 z-20"
          >
            <div className="inline-block mb-6">
              <span className="font-accent text-primary uppercase tracking-[0.3em]">{membershipData.subtitle || "● THE BROTHERHOOD"}</span>
            </div>

            {/* Heading with Accent Line */}
            <div className="relative pl-8 border-l-2 border-primary/30 mb-8">
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-sans font-bold text-foreground leading-tight tracking-tight">
                {membershipData.title}
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground mb-16 leading-relaxed font-light max-w-xl italic">
              "{membershipData.description}"
            </p>

            {/* Refined Stats List */}
            <div className="flex flex-wrap gap-12 border-t border-border/40 pt-10">
              {membershipData.stats.map((stat, idx) => (
                <div key={idx} className="relative group">
                  <div className="text-4xl font-sans font-bold text-primary mb-1 tracking-tight group-hover:scale-110 transition-transform duration-500 origin-left">
                    {stat.value}
                  </div>
                  <p className="font-accent text-[9px] text-muted-foreground">{stat.label}</p>
                  {idx < membershipData.stats.length - 1 && (
                    <div className="hidden sm:block absolute -right-6 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-primary/20" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Image with Offset Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex-1 relative group"
          >
            {/* Offset Gold Frame */}
            <div className="absolute -top-4 -right-4 w-full h-full border border-primary/20 rounded-sm -z-10 group-hover:top-0 group-hover:right-0 transition-all duration-700"></div>
            
            <div className="relative overflow-hidden rounded-sm h-[600px] border border-white/5 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-60"></div>
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay z-10"></div>
              <Image 
                src={membershipData.image_url || "/car-club-members-meeting-luxury.jpg"} 
                alt="W205CI Club Members" 
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-110" 
              />
            </div>
            
            {/* Decorative Element */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
