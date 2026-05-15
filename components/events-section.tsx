"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface Event {
  id: string
  title: string
  description: string
  icon: string
  header_image?: string
  event_time?: string
  location?: string
  status?: string
  created_at: string
}

const EVENTS_PER_PAGE = 6

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [total, setTotal] = useState(0)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/cms/events?limit=${EVENTS_PER_PAGE}&offset=0`)
        const data = await response.json()
        setEvents(data.data || [])
        setTotal(data.total || 0)
        setOffset(EVENTS_PER_PAGE)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const response = await fetch(`/api/cms/events?limit=${EVENTS_PER_PAGE}&offset=${offset}`)
      const data = await response.json()
      setEvents([...events, ...(data.data || [])])
      setOffset(offset + EVENTS_PER_PAGE)
    } catch (error) {
      console.error("Error loading more events:", error)
    } finally {
      setLoadingMore(false)
    }
  }

  const hasMore = events.length < total

  if (loading) {
    return (
      <section id="events" className="py-32 px-4 sm:px-6 lg:px-8 bg-background relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-xs font-semibold text-primary tracking-[0.2em] uppercase">● EVENTS</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mt-4 mb-6 text-pretty tracking-tight">Our Exclusive Events</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">Loading events...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="events" className="py-32 px-4 sm:px-6 lg:px-8 bg-background relative ambient-glow overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="font-accent text-primary">● EVENTS</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-foreground mt-4 mb-6 text-pretty tracking-tight">Our Exclusive Events</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            Unique experiences that unite W205CI owners — from city night drives to adrenaline-fueled track days.
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="h-full p-8 bg-card hover:bg-card/80 transition-all duration-300 border-border/50 hover:border-primary/50 group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="text-4xl">
                    {(event.icon?.startsWith('/') || event.icon?.startsWith('http')) ? (
                      <img
                        src={event.icon}
                        alt={event.title}
                        className="w-12 h-12 object-contain invert brightness-200"
                      />
                    ) : (
                      event.icon || "🎯"
                    )}
                  </div>
                  {event.status && event.status !== 'upcoming' && (
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${event.status === 'coming_soon'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                      }`}>
                      {event.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-sans font-bold text-foreground mb-3">{event.title}</h3>

                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex flex-wrap gap-4">
                    {event.event_time && (
                      <div className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <span className="mr-2">🕒</span>
                        {event.event_time}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        <span className="mr-2">📍</span>
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm line-clamp-3 mb-6 font-light">{event.description}</p>
                <Link
                  href={`/events/${event.id}`}
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary/80 transition-colors group-hover:translate-x-1 duration-300"
                >
                  Read Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-16">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center px-10 py-5 bg-metallic-gold text-primary-foreground font-bold tracking-widest rounded-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg border-0"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  See More Events
                  <span className="ml-2 text-primary-foreground/70">({events.length} of {total})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
