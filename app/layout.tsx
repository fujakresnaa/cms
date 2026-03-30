import type React from "react"
import type { Metadata } from "next"

import "@fontsource/inter/400.css"
import "@fontsource/inter/600.css"
import "@fontsource/playfair-display/400.css"
import "@fontsource/playfair-display/700.css"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Mercedes-Benz W205CI Club Indonesia",
    template: "%s | W205CI Club Indonesia",
  },
  description: "The official community for Mercedes-Benz W205 enthusiasts in Indonesia. Join us for exclusive events, night drives, and technical sharing.",
  keywords: ["Mercedes-Benz", "W205", "W205CI", "Car Club", "Indonesia", "C-Class", "Automotive"],
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
    title: "Mercedes-Benz W205CI Club Indonesia",
    description: "The official community for Mercedes-Benz W205 enthusiasts in Indonesia.",
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
    title: "Mercedes-Benz W205CI Club Indonesia",
    description: "The official community for Mercedes-Benz W205 enthusiasts in Indonesia.",
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
    <html lang="en">
      <body className={`antialiased font-sans`} suppressHydrationWarning>
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
