"use client"

import { useEffect, useState, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface ShowcaseItem {
  id: string
  image_url: string
  title?: string
}

export function ShowcaseSection() {
  const [showcase, setShowcase] = useState<ShowcaseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      duration: 50, // Increased for smoother, more cinematic feel
    },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      })
    ]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

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
      alt: "Pertemuan Member Mercedes-Benz W205CI Club Indonesia",
    },
    {
      image: "/placeholder.jpg",
      alt: "Modifikasi Mewah Mercedes-Benz W205 C-Class",
    },
    {
      image: "/car-club-members-meeting-luxury.jpg",
      alt: "Gathering Komunitas Mercy W205 Indonesia",
    },
    {
      image: "/placeholder.jpg",
      alt: "Malam Kebersamaan Night Drive W205CI Indonesia",
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
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden relative ambient-glow bg-gradient-to-b from-background via-muted/30 to-background">
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
        <div className="relative pt-10 pb-24">
          <div className="overflow-visible" ref={emblaRef}>
            <div className="flex -ml-4">
              {showcase.map((item, index) => {
                const isSelected = selectedIndex === index;
                return (
                  <motion.div
                    key={item.id}
                    className="pl-4 flex-[0_0_85%] min-w-0 sm:flex-[0_0_65%] md:flex-[0_0_55%] lg:flex-[0_0_48%] relative py-10"
                    style={{ zIndex: isSelected ? 10 : 1 }}
                    animate={{ zIndex: isSelected ? 10 : 1 }}
                  >
                    {/* Background Blur Glow (Originating from center) */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 0.25, scale: 1.2 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute inset-0 z-0 pointer-events-none"
                        >
                          <div 
                            className="absolute inset-0 blur-[100px] rounded-full"
                            style={{ 
                              background: `radial-gradient(circle, var(--primary) 0%, transparent 70%)`,
                              transform: 'translateY(-10%)'
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div
                      animate={{
                        scale: isSelected ? 1.15 : 0.85,
                        x: isSelected ? 0 : (index < selectedIndex ? "25%" : "-25%"),
                        rotateY: isSelected ? 0 : (index < selectedIndex ? 15 : -15),
                        filter: isSelected ? "brightness(1)" : "brightness(0.85)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 25,
                        mass: 0.8,
                      }}
                      style={{ perspective: "1000px" }}
                      className={`relative aspect-[16/10] overflow-hidden rounded-sm group cursor-pointer transition-shadow duration-500 ${
                        isSelected ? 'shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8),0_0_40px_rgba(212,175,55,0.3)]' : 'shadow-none'
                      }`}
                    >
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title || "Showcase vehicle"}
                        className="w-full h-full object-cover will-change-transform transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                      {/* Inner edge glow for premium feel */}
                      <div className="absolute inset-0 pointer-events-none border border-white/5" />
                      
                      {/* Suble overlay for non-selected items */}
                      {!isSelected && (
                        <div className="absolute inset-0 bg-black/10 transition-opacity duration-500" />
                      )}
                    </motion.div>
                    
                    {/* Floor Shadow / Reflection Effect */}
                    <motion.div 
                      animate={{ 
                        opacity: isSelected ? 0.8 : 0.2,
                        scaleX: isSelected ? 1.2 : 0.8,
                        y: isSelected ? 45 : 25
                      }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[85%] h-6 bg-primary/40 blur-3xl rounded-full pointer-events-none"
                    />
                    <motion.div 
                      animate={{ 
                        opacity: isSelected ? 1 : 0.4,
                        y: isSelected ? 50 : 30
                      }}
                      transition={{ duration: 0.8, ease: "circOut" }}
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[95%] h-8 bg-black/90 blur-3xl rounded-full pointer-events-none" 
                    />
                  </motion.div>
                );
              })}
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