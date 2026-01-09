import type React from "react"
import type { Metadata } from "next"

import "@fontsource/inter/400.css"
import "@fontsource/inter/600.css"
import "@fontsource/playfair-display/400.css"
import "@fontsource/playfair-display/700.css"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mercedes-Benz W205CI Club Indonesia",
  description: "Your Ultimate Community for W205CI Enthusiasts",
  generator: "MRC Admin",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased font-sans`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
