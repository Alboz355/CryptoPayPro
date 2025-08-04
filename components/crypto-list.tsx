"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react"
import { cryptoPriceService, type CryptoPrice } from "@/lib/crypto-prices"

interface CryptoListProps {
  onCryptoSelect?: (crypto: CryptoPrice) => void
  selectedCrypto?: string
}

export function CryptoList({ onCryptoSelect, selectedCrypto }: CryptoListProps) {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCryptoPrices()
  }, [])

  const loadCryptoPrices = async () => {
    try {
      setLoading(true)
      setError(null)
      const prices = await cryptoPriceService.getCryptoPrices()
      setCryptos(prices)
    } catch (err) {
      setError("Erreur lors du chargement des prix")
      console.error("Error loading crypto prices:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement des prix...</span>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center p-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadCryptoPrices} variant="outline">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <CardHeader>
        <CardTitle>Prix des Cryptomonnaies</CardTitle>
      </CardHeader>

      {cryptos.map((crypto) => (
        <Card
          key={crypto.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedCrypto === crypto.id ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onCryptoSelect?.(crypto)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={crypto.image || "/placeholder.svg"}
                  alt={crypto.name}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `/placeholder.svg?height=40&width=40&text=${crypto.symbol.toUpperCase()}`
                  }}
                />
                <div>
                  <h3 className="font-semibold">{crypto.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {crypto.symbol.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-lg">
                  {crypto.current_price.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </div>
                <div
                  className={`flex items-center text-sm ${
                    crypto.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Cap. marché</span>
                <span>{cryptoPriceService.formatMarketCap(crypto.market_cap)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Rang</span>
                <span>#{crypto.market_cap_rank}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
