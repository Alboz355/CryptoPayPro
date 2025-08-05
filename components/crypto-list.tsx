"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cryptoService } from "@/lib/crypto-prices"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/i18n"

interface CryptoData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  image: string
  balance?: string
}

export function CryptoList() {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const [cryptos, setCryptos] = useState<CryptoData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCryptoData()
    const interval = setInterval(fetchCryptoData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchCryptoData = async () => {
    try {
      const prices = await cryptoService.getCryptoPrices()

      // Add mock balances for demonstration
      const cryptosWithBalances = prices.map((crypto) => ({
        ...crypto,
        balance: getStoredBalance(crypto.symbol.toUpperCase()),
      }))

      setCryptos(cryptosWithBalances)
    } catch (error) {
      console.error("Error fetching crypto data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStoredBalance = (symbol: string): string => {
    const walletData = localStorage.getItem("wallet-data")
    if (walletData) {
      try {
        const parsed = JSON.parse(walletData)
        switch (symbol) {
          case "BTC":
            return parsed.balances?.bitcoin || "0"
          case "ETH":
            return parsed.balances?.ethereum || "0"
          case "ALGO":
            return parsed.balances?.algorand || "0"
          default:
            return "0"
        }
      } catch (error) {
        return "0"
      }
    }
    return "0"
  }

  const formatBalance = (balance: string, symbol: string): string => {
    const num = Number.parseFloat(balance)
    if (isNaN(num) || num === 0) return `0 ${symbol}`

    if (symbol === "BTC") {
      return `${num.toFixed(8)} ${symbol}`
    } else if (symbol === "ETH") {
      return `${num.toFixed(6)} ${symbol}`
    } else {
      return `${num.toFixed(4)} ${symbol}`
    }
  }

  const calculateBalanceValue = (balance: string, price: number): string => {
    const num = Number.parseFloat(balance)
    if (isNaN(num) || num === 0) return "0.00"
    return (num * price).toFixed(2)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-CH", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `${(marketCap / 1e12).toFixed(2)}T $`
    } else if (marketCap >= 1e9) {
      return `${(marketCap / 1e9).toFixed(2)}B $`
    } else if (marketCap >= 1e6) {
      return `${(marketCap / 1e6).toFixed(2)}M $`
    } else {
      return `${marketCap.toLocaleString()} $`
    }
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)}%`
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {cryptos.map((crypto) => (
        <Card key={crypto.id} className="crypto-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`crypto-icon ${crypto.symbol.toLowerCase()}`}>{crypto.symbol.charAt(0)}</div>
                <div>
                  <h3 className="font-semibold">{crypto.name}</h3>
                  <p className="text-sm text-muted-foreground crypto-balance">
                    {formatBalance(crypto.balance || "0", crypto.symbol.toUpperCase())}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <p className="font-semibold">{formatPrice(crypto.current_price)}</p>
                  <Badge
                    variant={crypto.price_change_percentage_24h >= 0 ? "default" : "destructive"}
                    className="text-xs"
                  >
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  CHF {calculateBalanceValue(crypto.balance || "0", crypto.current_price)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
