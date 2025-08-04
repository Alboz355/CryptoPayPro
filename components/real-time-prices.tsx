"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCcw, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { CryptoPriceService, type CryptoPrice } from "@/lib/crypto-prices"
import { formatCurrency } from "@/lib/utils"

export function RealTimePrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const cryptoPriceService = CryptoPriceService.getInstance()

  const fetchAndSetPrices = async () => {
    setIsLoading(true)
    try {
      const fetchedPrices = await cryptoPriceService.fetchPrices("chf")
      setPrices(fetchedPrices)
    } catch (error) {
      console.error("Failed to fetch real-time prices:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAndSetPrices()
    const interval = setInterval(fetchAndSetPrices, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const getPriceDisplay = (cryptoId: string) => {
    const price = prices.find((p) => p.id === cryptoId)
    if (!price) return "N/A"

    const formattedPrice = formatCurrency(price.current_price, "chf")
    const change = price.price_change_percentage_24h
    const changeColor = change >= 0 ? "text-green-600" : "text-red-600"
    const changeIcon = change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />

    return (
      <div className="flex items-center space-x-1">
        <span>{formattedPrice}</span>
        <span className={`text-xs flex items-center ${changeColor}`}>
          {changeIcon}
          {change.toFixed(2)}%
        </span>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Prix en temps réel</CardTitle>
        <Button variant="ghost" size="icon" onClick={fetchAndSetPrices} disabled={isLoading}>
          <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-muted-foreground">Chargement des prix...</div>
        ) : (
          <div className="space-y-4">
            {/* Bitcoin */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src="/placeholder-logo.png?height=24&width=24&query=bitcoin-logo"
                  alt="Bitcoin Logo"
                  className="h-6 w-6"
                />
                <div>
                  <p className="font-medium">Bitcoin</p>
                  <p className="text-sm text-muted-foreground">BTC</p>
                </div>
              </div>
              {getPriceDisplay("bitcoin")}
            </div>
            {/* Ethereum */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src="/placeholder-logo.png?height=24&width=24&query=ethereum-logo"
                  alt="Ethereum Logo"
                  className="h-6 w-6"
                />
                <div>
                  <p className="font-medium">Ethereum</p>
                  <p className="text-sm text-muted-foreground">ETH</p>
                </div>
              </div>
              {getPriceDisplay("ethereum")}
            </div>
            {/* Algorand */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src="/placeholder-logo.png?height=24&width=24&query=algorand-logo"
                  alt="Algorand Logo"
                  className="h-6 w-6"
                />
                <div>
                  <p className="font-medium">Algorand</p>
                  <p className="text-sm text-muted-foreground">ALGO</p>
                </div>
              </div>
              {getPriceDisplay("algorand")}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
