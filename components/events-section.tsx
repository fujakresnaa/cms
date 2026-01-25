"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface Event {
  id: string
  title: string
  description: string
  icon: string
  created_at: string
}

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/cms/events")
        const data = await response.json()
        setEvents(data.data || [])
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) {
    return (
      <section id="events" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs font-semibold text-gray-600 tracking-widest">● EVENTS</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4 mb-6 text-pretty">Our Exclusive Events</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Loading events...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="events" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-semibold text-gray-600 tracking-widest">● EVENTS</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4 mb-6 text-pretty">Our Exclusive Events</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Unique experiences that unite W205CI owners — from city night drives to adrenaline-fueled track days.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card
              key={event.id}
              className="p-8 bg-white hover:shadow-lg transition-shadow duration-300 border border-gray-200"
            >
              <div className="text-4xl mb-4">
                {(event.icon?.startsWith('/') || event.icon?.startsWith('http')) ? (
                  <img
                    src={event.icon}
                    alt={event.title}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  event.icon || "🎯"
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{event.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
