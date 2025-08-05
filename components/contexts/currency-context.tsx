"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Currency } from "@/lib/crypto-prices"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("CHF")

  useEffect(() => {
    // Load saved currency from localStorage
    const savedCurrency = localStorage.getItem("preferred-currency") as Currency
    if (savedCurrency) {
      setCurrency(savedCurrency)
    }
  }, [])

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    localStorage.setItem("preferred-currency", newCurrency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency }}>{children}</CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
