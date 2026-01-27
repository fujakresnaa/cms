"use client"

import Link from "next/link"
import { Facebook, Instagram, Youtube, MessageCircle, Mail, Twitter } from "lucide-react"
import { useEffect, useState } from "react"

interface SocialLink {
  platform: string
  url: string
  icon_type: string
}

interface FooterConfig {
  id: string
  company_name: string
  description: string
  phone: string
  email: string
  address: string
  copyright_year: number
  copyright_text: string
}

export function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [logo, setLogo] = useState({ text: "MBW205CI", subtext: "Club Indonesia" })
  const [footerConfig, setFooterConfig] = useState<FooterConfig>({
    id: "default",
    company_name: "Mercedes-Benz W205CI Club Indonesia",
    description: "Your Ultimate Community for W205CI Enthusiasts",
    phone: "+62 123 456 7890",
    email: "contact@mbw205ci.id",
    address: "Indonesia",
    copyright_year: new Date().getFullYear(),
    copyright_text: "Mercedes-Benz W205CI Club Indonesia. All rights reserved.",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [socialRes, logoRes, footerRes] = await Promise.all([
          fetch("/api/cms/social-media"),
          fetch("/api/cms/logo"),
          fetch("/api/cms/footer"),
        ])

        const socialData = await socialRes.json()
        const logoData = await logoRes.json()
        const footerData = await footerRes.json()

        setSocialLinks(socialData.data || [])
        if (logoData) {
          setLogo(logoData)
        }
        if (footerData) {
          setFooterConfig(footerData)
        }
      } catch (error) {
        console.error("Error fetching footer data:", error)
      }
    }

    fetchData()
  }, [])

  const getIcon = (platform: string) => {
    switch (platform) {
      case "whatsapp":
        return <MessageCircle className="w-5 h-5" />
      case "youtube":
        return <Youtube className="w-5 h-5" />
      case "instagram":
        return <Instagram className="w-5 h-5" />
      case "facebook":
        return <Facebook className="w-5 h-5" />
      case "email":
        return <Mail className="w-5 h-5" />
      case "x":
        return <Twitter className="w-5 h-5" />
      default:
        return null
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-2xl font-bold">{logo.text}</h3>
              <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">{logo.subtext}</p>
            <p className="text-gray-500 text-sm mt-4">{footerConfig.description}</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-6 text-white">About Us</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#about" className="text-gray-400 hover:text-white transition text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#events" className="text-gray-400 hover:text-white transition text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link href="#membership" className="text-gray-400 hover:text-white transition text-sm">
                  Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6 text-white">Contact</h4>
            <p className="text-gray-400 text-sm mb-2">{footerConfig.address}</p>
            <p className="text-gray-400 text-sm mb-2">{footerConfig.email}</p>
            <p className="text-gray-400 text-sm">{footerConfig.phone}</p>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-6 text-white">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition"
                  aria-label={social.platform}
                >
                  {getIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center md:text-left text-gray-500 text-sm">
            © {footerConfig.copyright_year} {footerConfig.copyright_text}
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-500 hover:text-white transition text-sm">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-500 hover:text-white transition text-sm">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
