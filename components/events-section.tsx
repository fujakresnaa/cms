"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Loader2 } from "lucide-react"

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
              <div className="flex justify-between items-start mb-4">
                <div className="text-4xl">
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
                {event.status && event.status !== 'upcoming' && (
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${event.status === 'coming_soon'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                    }`}>
                    {event.status.replace('_', ' ')}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>

              <div className="flex flex-col gap-2 mb-4">
                <div className="flex flex-wrap gap-4">
                  {event.event_time && (
                    <div className="flex items-center text-xs font-medium text-gray-400 uppercase tracking-tighter">
                      <span className="mr-1">🕒</span>
                      {event.event_time}
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center text-xs font-medium text-gray-400 uppercase tracking-tighter">
                      <span className="mr-1">📍</span>
                      {event.location}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm line-clamp-3 mb-4">{event.description}</p>
              <Link
                href={`/events/${event.id}`}
                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Read Details
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  See More Events
                  <span className="ml-2 text-gray-400">({events.length} of {total})</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
