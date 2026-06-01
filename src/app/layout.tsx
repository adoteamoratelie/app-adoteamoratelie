import type { Metadata } from "next"
import { Inter, Manrope } from "next/font/google"

import { siteConfig } from "@/config/site"

import "./globals.css"
import { cn } from "@/lib/utils";

const manropeHeading = Manrope({subsets:['latin'],variable:'--font-heading'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={cn(manropeHeading.variable)}>
      <body
        suppressHydrationWarning
        className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}