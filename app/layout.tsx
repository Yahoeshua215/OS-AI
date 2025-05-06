import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { IntelligencePanel } from "@/components/intelligence-panel"

// Check if settings are enabled (will be false in production)
const enableSettings = process.env.NEXT_PUBLIC_ENABLE_SETTINGS === "true"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OneSignal Dashboard",
  description: "Push notification management platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <IntelligencePanel />
        </ThemeProvider>
      </body>
    </html>
  )
}
