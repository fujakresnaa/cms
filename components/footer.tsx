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
    <footer className="bg-background border-t border-border/20 text-foreground py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-2xl font-sans font-bold tracking-widest text-primary">{logo.text}</h3>
              <div className="w-6 h-6 rounded-full border border-primary/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              </div>
            </div>
            <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] mb-4">{logo.subtext}</p>
            <p className="text-muted-foreground/80 text-sm font-light leading-relaxed">{footerConfig.description}</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-6 text-foreground tracking-wide">About Us</h4>
            <ul className="space-y-4">
              <li>
                <Link href="#about" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#events" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link href="#membership" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6 text-foreground tracking-wide">Contact</h4>
            <p className="text-muted-foreground text-sm mb-3 font-light">{footerConfig.address}</p>
            <p className="text-muted-foreground text-sm mb-3 font-light hover:text-primary transition-colors"><a href={`mailto:${footerConfig.email}`}>{footerConfig.email}</a></p>
            <p className="text-muted-foreground text-sm font-light">{footerConfig.phone}</p>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-semibold mb-6 text-foreground tracking-wide">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.platform}
                  href={social.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.platform}
                >
                  {getIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center md:text-left text-muted-foreground/70 text-xs font-light tracking-wide">
            © {footerConfig.copyright_year} {footerConfig.copyright_text}
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-muted-foreground/70 hover:text-primary transition-colors text-xs tracking-wide">
              Privacy Policy
            </Link>
            <Link href="#" className="text-muted-foreground/70 hover:text-primary transition-colors text-xs tracking-wide">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
