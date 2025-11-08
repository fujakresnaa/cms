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
    <header className="fixed w-full top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {logo.image_url && <img src={logo.image_url || "/placeholder.svg"} alt="Logo" className="h-8 w-auto" />}
          <div>
            <div className="font-bold text-primary">{logo.text}</div>
            <div className="text-xs text-gray-600">{logo.subtext}</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#about" className="text-sm text-gray-700 hover:text-primary transition font-medium">
            About Us
          </Link>
          <Link href="#events" className="text-sm text-gray-700 hover:text-primary transition font-medium">
            Events
          </Link>
          <Link href="#membership" className="text-sm text-gray-700 hover:text-primary transition font-medium">
            Membership
          </Link>
          <Link href="#contact" className="text-sm text-gray-700 hover:text-primary transition font-medium">
            Contact
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 flex items-center justify-center">🌐</div>
            <select className="text-gray-700 text-sm border-0 bg-transparent hover:text-primary">
              <option>English</option>
              <option>Indonesia</option>
            </select>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="text-gray-900" size={24} /> : <Menu className="text-gray-900" size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 md:hidden shadow-lg">
            <div className="flex flex-col gap-4 p-6">
              <Link href="#about" className="text-gray-700 hover:text-primary transition font-medium">
                About Us
              </Link>
              <Link href="#events" className="text-gray-700 hover:text-primary transition font-medium">
                Events
              </Link>
              <Link href="#membership" className="text-gray-700 hover:text-primary transition font-medium">
                Membership
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-primary transition font-medium">
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
