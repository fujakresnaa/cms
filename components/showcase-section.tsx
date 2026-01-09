"use client"

import { useEffect, useState } from "react"

interface ShowcaseItem {
  id: string
  image_url: string
  title?: string
}

export function ShowcaseSection() {
  const [showcase, setShowcase] = useState<ShowcaseItem[]>([])
  const [loading, setLoading] = useState(true)

  const staticCars = [
    {
      image: "/car-club-members-meeting-luxury.jpg",
      alt: "Mercedes W205CI Meeting",
    },
    {
      image: "/placeholder.jpg",
      alt: "Dark Blue Mercedes W205CI",
    },
    {
      image: "/car-club-members-meeting-luxury.jpg",
      alt: "White Mercedes W205CI",
    },
    {
      image: "/placeholder.jpg",
      alt: "Dark Mercedes W205CI Night",
    },
  ]

  useEffect(() => {
    const fetchShowcase = async () => {
      try {
        // Changed from /api/showcase to /api/cms/gallery
        const response = await fetch("/api/cms/gallery")
        const data = await response.json()
        if (data.data && data.data.length > 0) {
          // Use gallery data and ensure proper image paths
          const galleryItems = data.data.map((item: any) => ({
            id: item.id,
            image_url: item.image_url,
            title: item.title,
          }))
          setShowcase(galleryItems)
        } else {
          // Fallback to static cars if no database entries
          setShowcase(
            staticCars.map((car, idx) => ({
              id: `static-${idx}`,
              image_url: car.image,
              title: car.alt,
            })),
          )
        }
      } catch (error) {
        console.error("[mrc] Error fetching showcase:", error)
        // Use static fallback
        setShowcase(
          staticCars.map((car, idx) => ({
            id: `static-${idx}`,
            image_url: car.image,
            title: car.alt,
          })),
        )
      } finally {
        setLoading(false)
      }
    }

    fetchShowcase()
  }, [])

  if (loading) return null

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-semibold text-gray-600 tracking-widest">● SHOWCASE</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4 mb-6 text-pretty">W205CI Showcase</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore a collection of iconic W205CI vehicles. Each tells a story of elegance, passion, and individuality
            within our community.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showcase.map((item) => (
            <div key={item.id} className="relative overflow-hidden rounded-lg shadow-lg group h-96">
              <img
                src={item.image_url || "/placeholder.svg"}
                alt={item.title || "Showcase vehicle"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  console.error("[mrc] Image load error:", item.image_url)
                  // Fallback to placeholder if image fails to load
                  e.currentTarget.src = "/placeholder.svg"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}