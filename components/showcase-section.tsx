"use client"

import { useEffect, useState, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShowcaseItem {
  id: string
  image_url: string
  title?: string
}

export function ShowcaseSection() {
  const [showcase, setShowcase] = useState<ShowcaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false
  })

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

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
        const response = await fetch("/api/cms/gallery")
        const data = await response.json()
        if (data.data && data.data.length > 0) {
          const galleryItems = data.data.map((item: any) => ({
            id: item.id,
            image_url: item.image_url,
            title: item.title,
          }))
          // Ensure enough items for loop to work smoothly if few items
          const items = galleryItems.length < 4
            ? [...galleryItems, ...galleryItems, ...galleryItems].slice(0, 10)
            : galleryItems
          setShowcase(items)
        } else {
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

  // Custom Autoplay
  useEffect(() => {
    if (!emblaApi) return

    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext()
      } else {
        emblaApi.scrollTo(0)
      }
    }, 4000) // 4 seconds

    emblaApi.on("pointerDown", () => clearInterval(autoplay))
    emblaApi.on("pointerUp", () => {
      // Optional: Restart autoplay after interaction if desired, 
      // but strictly "pointerDown" clearing it is safer for UX to prevent jumping while reading.
      // For continuous autoplay, we'd need a more complex ref-based interval manager.
    })

    return () => clearInterval(autoplay)
  }, [emblaApi])

  if (loading) return null

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-gray-600 tracking-widest uppercase">● SHOWCASE</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-4 mb-6 text-pretty">
            W205CI Showcase
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore a collection of iconic W205CI vehicles. Each tells a story of elegance, passion, and individuality.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {showcase.map((item) => (
                <div
                  key={item.id}
                  className="pl-4 flex-[0_0_90%] min-w-0 sm:flex-[0_0_60%] md:flex-[0_0_50%] lg:flex-[0_0_40%]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg group cursor-pointer border border-white/20">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title || "Showcase vehicle"}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 border-gray-300 hover:bg-white hover:text-black transition-colors"
              onClick={scrollPrev}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 border-gray-300 hover:bg-white hover:text-black transition-colors"
              onClick={scrollNext}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}