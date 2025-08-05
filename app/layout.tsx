import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { CurrencyProvider } from "@/contexts/currency-context"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Crypto Wallet App",
  description: "Application de portefeuille crypto professionnelle",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LanguageProvider>
            <CurrencyProvider>
              {children}
              <Toaster />
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
