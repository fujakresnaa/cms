export const dynamic = 'force-dynamic'

import type React from "react"
import type { Metadata } from "next"

import { Outfit } from "next/font/google"
import "./globals.css"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Mercedes-Benz W205CI Club Indonesia",
    template: "%s | W205CI Club Indonesia",
  },
  description: "Komunitas resmi pecinta Mercedes-Benz W205 di Indonesia. Bergabunglah dengan kami untuk event eksklusif, night drive, technical sharing, dan persaudaraan tanpa batas.",
  keywords: ["Mercedes-Benz Indonesia", "W205CI", "W205 Club Indonesia", "Komunitas Mercedes-Benz", "C-Class Indonesia", "MBClub Indonesia", "Mercy W205"],
  authors: [{ name: "W205CI Club Indonesia" }],
  creator: "W205CI Club Indonesia",
  publisher: "W205CI Club Indonesia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://mbw205ci.com"), 
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mercedes-Benz W205CI Club Indonesia | Official Community",
    description: "Komunitas resmi pecinta Mercedes-Benz W205 di Indonesia. Join the brotherhood.",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://mbw205ci.com",
    siteName: "W205CI Club Indonesia",
    images: [
      {
        url: "/car-club-members-meeting-luxury.jpg",
        width: 1200,
        height: 630,
        alt: "W205CI Club Meeting",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mercedes-Benz W205CI Club Indonesia | Official Community",
    description: "Komunitas resmi pecinta Mercedes-Benz W205 di Indonesia. Join the brotherhood.",
    images: ["/car-club-members-meeting-luxury.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${outfit.variable}`}>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Mercedes-Benz W205CI Club Indonesia",
              "url": process.env.NEXT_PUBLIC_BASE_URL || "https://mbw205ci.com",
              "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "https://mbw205ci.com"}/placeholder-logo.png`,
              "sameAs": [
                "https://www.instagram.com/w205ci", // Example
                "https://www.facebook.com/w205ci"  // Example
              ],
              "description": "The official community for Mercedes-Benz W205 enthusiasts in Indonesia."
            })
          }}
        />
        {children}
      </body>
    </html>
  )
}
