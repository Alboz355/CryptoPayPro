"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowUpDown, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { cryptoPriceService } from "@/lib/crypto-prices"
import type { AppState } from "@/app/page"

interface TPEConversionPageProps {
  onNavigate: (page: AppState) => void
}

export function TPEConversionPage({ onNavigate }: TPEConversionPageProps) {
  const [fromCurrency, setFromCurrency] = useState("EUR")
  const [toCurrency, setToCurrency] = useState("bitcoin")
  const [amount, setAmount] = useState("")
  const [convertedAmount, setConvertedAmount] = useState("")
  const [exchangeRate, setExchangeRate] = useState(0)
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const currencies = [
    { value: "EUR", label: "Euro", symbol: "€", type: "fiat" },
    { value: "USD", label: "Dollar US", symbol: "$", type: "fiat" },
    { value: "CHF", label: "Franc Suisse", symbol: "CHF", type: "fiat" },
    { value: "bitcoin", label: "Bitcoin", symbol: "BTC", type: "crypto" },
    { value: "ethereum", label: "Ethereum", symbol: "ETH", type: "crypto" },
    { value: "algorand", label: "Algorand", symbol: "ALGO", type: "crypto" },
  ]

  const quickAmounts = [10, 25, 50, 100, 250, 500]

  useEffect(() => {
    if (amount && Number.parseFloat(amount) > 0) {
      convertCurrency()
    } else {
      setConvertedAmount("")
    }
  }, [amount, fromCurrency, toCurrency])

  const convertCurrency = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) return

    setLoading(true)
    try {
      const rate = await getExchangeRate(fromCurrency, toCurrency)
      setExchangeRate(rate)

      const converted = Number.parseFloat(amount) * rate
      setConvertedAmount(converted.toFixed(8))
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Erreur de conversion:", error)
      setConvertedAmount("Erreur")
    } finally {
      setLoading(false)
    }
  }

  const getExchangeRate = async (from: string, to: string): Promise<number> => {
    // Taux de change simulés pour les devises fiat
    const fiatRates: Record<string, number> = {
      "EUR-USD": 1.08,
      "USD-EUR": 0.93,
      "EUR-CHF": 0.95,
      "CHF-EUR": 1.05,
      "USD-CHF": 0.88,
      "CHF-USD": 1.14,
    }

    // Si les deux sont des devises fiat
    if (
      currencies.find((c) => c.value === from)?.type === "fiat" &&
      currencies.find((c) => c.value === to)?.type === "fiat"
    ) {
      const key = `${from}-${to}`
      return fiatRates[key] || 1
    }

    // Si une des devises est crypto, utiliser les prix réels
    const cryptoPrices = await cryptoPriceService.getCryptoPrices()

    if (
      currencies.find((c) => c.value === from)?.type === "fiat" &&
      currencies.find((c) => c.value === to)?.type === "crypto"
    ) {
      // Fiat vers crypto
      const cryptoPrice = cryptoPrices.find((p) => p.id === to)
      if (!cryptoPrice) throw new Error("Prix crypto non trouvé")

      let fiatInEur = 1
      if (from !== "EUR") {
        fiatInEur = fiatRates[`${from}-EUR`] || 1
      }

      return fiatInEur / cryptoPrice.current_price
    }

    if (
      currencies.find((c) => c.value === from)?.type === "crypto" &&
      currencies.find((c) => c.value === to)?.type === "fiat"
    ) {
      // Crypto vers fiat
      const cryptoPrice = cryptoPrices.find((p) => p.id === from)
      if (!cryptoPrice) throw new Error("Prix crypto non trouvé")

      let eurToFiat = 1
      if (to !== "EUR") {
        eurToFiat = fiatRates[`EUR-${to}`] || 1
      }

      return cryptoPrice.current_price * eurToFiat
    }

    // Crypto vers crypto
    if (
      currencies.find((c) => c.value === from)?.type === "crypto" &&
      currencies.find((c) => c.value === to)?.type === "crypto"
    ) {
      const fromPrice = cryptoPrices.find((p) => p.id === from)?.current_price || 1
      const toPrice = cryptoPrices.find((p) => p.id === to)?.current_price || 1
      return fromPrice / toPrice
    }

    return 1
  }

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
    setAmount(convertedAmount)
    setConvertedAmount(amount)
  }

  const setQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString())
  }

  const refreshRates = () => {
    if (amount && Number.parseFloat(amount) > 0) {
      convertCurrency()
    }
  }

  const fromCurrencyInfo = currencies.find((c) => c.value === fromCurrency)
  const toCurrencyInfo = currencies.find((c) => c.value === toCurrency)

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("tpe")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Convertisseur</h1>
          <Button variant="ghost" size="icon" onClick={refreshRates}>
            <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Conversion Card */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion de devises</CardTitle>
            {lastUpdate && (
              <p className="text-sm text-muted-foreground">Dernière mise à jour: {lastUpdate.toLocaleTimeString()}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* From Currency */}
            <div className="space-y-2">
              <Label>De</Label>
              <div className="flex gap-2">
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        <div className="flex items-center gap-2">
                          <Badge variant={currency.type === "crypto" ? "default" : "secondary"}>
                            {currency.symbol}
                          </Badge>
                          {currency.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button variant="outline" size="icon" onClick={swapCurrencies}>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* To Currency */}
            <div className="space-y-2">
              <Label>Vers</Label>
              <div className="flex gap-2">
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.value} value={currency.value}>
                        <div className="flex items-center gap-2">
                          <Badge variant={currency.type === "crypto" ? "default" : "secondary"}>
                            {currency.symbol}
                          </Badge>
                          {currency.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex-1 p-3 bg-muted rounded-md">
                  <div className="text-lg font-mono">
                    {loading ? (
                      <div className="flex items-center">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Calcul...
                      </div>
                    ) : (
                      convertedAmount || "0.00"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Exchange Rate */}
            {exchangeRate > 0 && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Taux de change</div>
                <div className="font-mono">
                  1 {fromCurrencyInfo?.symbol} = {exchangeRate.toFixed(8)} {toCurrencyInfo?.symbol}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Amount Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Montants rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <Button key={quickAmount} variant="outline" size="sm" onClick={() => setQuickAmount(quickAmount)}>
                  {quickAmount} {fromCurrencyInfo?.symbol}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du marché</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bitcoin (BTC)</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">65,000 €</span>
                  <Badge variant="secondary" className="text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +2.5%
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Ethereum (ETH)</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">3,200 €</span>
                  <Badge variant="secondary" className="text-red-600">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    -1.2%
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Algorand (ALGO)</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">0.25 €</span>
                  <Badge variant="secondary" className="text-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +5.8%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion History */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>100 EUR → 0.00153846 BTC</span>
                <span className="text-muted-foreground">Il y a 5 min</span>
              </div>
              <div className="flex justify-between">
                <span>50 USD → 0.015625 ETH</span>
                <span className="text-muted-foreground">Il y a 12 min</span>
              </div>
              <div className="flex justify-between">
                <span>200 CHF → 800 ALGO</span>
                <span className="text-muted-foreground">Il y a 1h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
