import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Crypto Wallet App",
  description: "Application de portefeuille multi-crypto",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <script src="https://widget.mtpelerin.com/mtp-widget.js" async></script>
      </head>
      <body className="font-inter">{children}</body>
    </html>
  )
}
