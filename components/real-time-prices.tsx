"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { cryptoService } from "@/lib/crypto-prices"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/i18n"

interface PriceData {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  image: string
}

export function RealTimePrices() {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const [prices, setPrices] = useState<PriceData[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchPrices = async () => {
    try {
      setLoading(true)
      const data = await cryptoService.getCryptoPrices()
      setPrices(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Error fetching prices:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatLastUpdate = (date: Date | null): string => {
    if (!date) return ""
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ${t.time.ago}`
    } else {
      const diffInMinutes = Math.floor(diffInSeconds / 60)
      return `${diffInMinutes} ${diffInMinutes === 1 ? t.time.minute : t.time.minutes} ${t.time.ago}`
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {lastUpdate && `Dernière mise à jour: ${formatLastUpdate(lastUpdate)}`}
        </div>
        <Button variant="outline" size="sm" onClick={fetchPrices} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {t.common.refresh}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {prices.map((crypto) => (
          <Card key={crypto.id} className="crypto-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`crypto-icon ${crypto.symbol.toLowerCase()}`}>{crypto.symbol.charAt(0)}</div>
                  <div>
                    <h3 className="font-semibold text-sm">{crypto.name}</h3>
                    <p className="text-xs text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                  </div>
                </div>
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

              <div className="space-y-1">
                <p className="text-lg font-bold">{cryptoService.formatPrice(crypto.current_price)}</p>
                <p className="text-xs text-muted-foreground">
                  Cap. marché: {cryptoService.formatMarketCap(crypto.market_cap)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && prices.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
