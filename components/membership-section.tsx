"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface MembershipData {
  id: string
  title: string
  description: string
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
          description: "Be part of an exclusive circle of W205CI enthusiasts",
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

  if (loading || !membership) return null

  return (
    <section id="membership" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-block mb-6">
              <span className="text-xs font-semibold text-gray-600 tracking-widest">● MEMBERSHIP</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 text-pretty">{membership.title}</h2>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">{membership.description}</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-6">
              {membership.stats.map((stat, idx) => (
                <Card key={idx} className="p-6 bg-gray-900 text-center text-white border-0">
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <p className="text-sm text-gray-300">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="relative overflow-hidden rounded-lg shadow-2xl h-96">
            <img src="/car-club-members-meeting-luxury.jpg" alt="W205CI Club Members" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}
