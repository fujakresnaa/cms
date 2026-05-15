"use client"

import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

interface Logo {
  text: string
  subtext: string
  image_url?: string
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [logo, setLogo] = useState<Logo>({ text: "MBW205CI", subtext: "Club Indonesia" })

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch("/api/cms/logo")
        const data = await response.json()
        if (data) {
          setLogo({
            text: data.text || "MBW205CI",
            subtext: data.subtext || "Club Indonesia",
            image_url: data.image_url,
          })
        }
      } catch (error) {
        console.error("Error fetching logo:", error)
      }
    }

    fetchLogo()
  }, [])

  return (
    <header className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40 transition-all duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          {logo.image_url && <img src={logo.image_url || "/placeholder.svg"} alt="Logo" className="h-8 w-auto group-hover:scale-105 transition-transform invert" />}
          <div>
            <div className="font-bold text-primary tracking-wider">{logo.text}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">{logo.subtext}</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#about" className="text-sm text-foreground/80 hover:text-primary transition-colors font-medium">
            About Us
          </Link>
          <Link href="#events" className="text-sm text-foreground/80 hover:text-primary transition-colors font-medium">
            Events
          </Link>
          <Link href="#membership" className="text-sm text-foreground/80 hover:text-primary transition-colors font-medium">
            Membership
          </Link>
          <Link href="#contact" className="text-sm text-foreground/80 hover:text-primary transition-colors font-medium">
            Contact
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center opacity-70">🌐</div>
            <select className="text-foreground/80 text-sm border-0 bg-transparent hover:text-primary focus:ring-0 cursor-pointer">
              <option className="bg-background text-foreground">English</option>
              <option className="bg-background text-foreground">Indonesia</option>
            </select>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="text-foreground" size={24} /> : <Menu className="text-foreground" size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/40 md:hidden shadow-lg animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-4 p-6">
              <Link href="#about" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                About Us
              </Link>
              <Link href="#events" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Events
              </Link>
              <Link href="#membership" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Membership
              </Link>
              <Link href="#contact" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
