"use client"

import { useEffect, useState, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ShowcaseItem {
  id: string
  image_url: string
  title?: string
}

export function ShowcaseSection() {
  const [showcase, setShowcase] = useState<ShowcaseItem[]>([])
  const [loading, setLoading] = useState(true)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      duration: 30, // Optimized transition duration for smoothness
    },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      })
    ]
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
      const autoplay = emblaApi.plugins().autoplay
      if (autoplay) autoplay.reset()
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
      const autoplay = emblaApi.plugins().autoplay
      if (autoplay) autoplay.reset()
    }
  }, [emblaApi])

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
            ? [...galleryItems, ...galleryItems, ...galleryItems].slice(0, 10).map((item: any, idx: number) => ({
              ...item,
              id: `${item.id}-${idx}`
            }))
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

  if (loading) return null

  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden relative ambient-glow">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="font-accent text-primary">● SHOWCASE</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-foreground mt-4 mb-6 text-pretty tracking-tight">
            W205CI Showcase
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            Explore a collection of iconic W205CI vehicles. Each tells a story of elegance, passion, and individuality.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {showcase.map((item) => (
                <div
                  key={item.id}
                  className="pl-4 flex-[0_0_90%] min-w-0 sm:flex-[0_0_60%] md:flex-[0_0_50%] lg:flex-[0_0_40%]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm shadow-2xl group cursor-pointer border border-primary/20">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title || "Showcase vehicle"}
                      className="w-full h-full object-cover will-change-transform transform group-hover:scale-110 transition-transform duration-1000 ease-out"
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
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center gap-6 mt-12"
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-14 h-14 border-primary/40 bg-card/40 backdrop-blur-md text-primary hover:bg-metallic-gold hover:text-primary-foreground hover:border-transparent transition-all duration-300 hover:scale-110 shadow-lg"
              onClick={scrollPrev}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-14 h-14 border-primary/40 bg-card/40 backdrop-blur-md text-primary hover:bg-metallic-gold hover:text-primary-foreground hover:border-transparent transition-all duration-300 hover:scale-110 shadow-lg"
              onClick={scrollNext}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}