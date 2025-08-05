"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, QrCode, Copy, Printer, RefreshCw, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cryptoService } from "@/lib/crypto-prices"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/i18n"
import type { AppState, WalletData } from "@/app/page"

interface TPEPaymentPageProps {
  onNavigate: (page: AppState) => void
  onBack: () => void
  walletData: WalletData | null
}

interface CryptoOption {
  id: string
  name: string
  symbol: string
  color: string
  address: string
  qrPrefix: string
}

export function TPEPaymentPage({ onNavigate, onBack, walletData }: TPEPaymentPageProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const [amount, setAmount] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin")
  const [cryptoAmount, setCryptoAmount] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [cryptoPrices, setCryptoPrices] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"waiting" | "received" | "confirmed">("waiting")
  const { toast } = useToast()

  const cryptoOptions: Record<string, CryptoOption> = {
    bitcoin: {
      id: "bitcoin",
      name: t.crypto.bitcoin,
      symbol: "BTC",
      color: "bg-orange-500",
      address: walletData?.addresses?.bitcoin || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      qrPrefix: "bitcoin:",
    },
    ethereum: {
      id: "ethereum",
      name: t.crypto.ethereum,
      symbol: "ETH",
      color: "bg-blue-500",
      address: walletData?.addresses?.ethereum || "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e",
      qrPrefix: "ethereum:",
    },
    algorand: {
      id: "algorand",
      name: t.crypto.algorand,
      symbol: "ALGO",
      color: "bg-black",
      address: walletData?.addresses?.algorand || "ALGORANDADDRESSEXAMPLE234567890ABCDEFGHIJK",
      qrPrefix: "algorand:",
    },
  }

  useEffect(() => {
    fetchCryptoPrices()
    const interval = setInterval(fetchCryptoPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (amount && cryptoPrices[selectedCrypto]) {
      calculateCryptoAmount()
      generateQRCode()
    }
  }, [amount, selectedCrypto, cryptoPrices])

  const fetchCryptoPrices = async () => {
    try {
      setLoading(true)
      const prices = await cryptoService.getCryptoPrices()
      const priceMap = prices.reduce((acc: any, crypto: any) => {
        acc[crypto.id] = crypto.current_price
        return acc
      }, {})
      setCryptoPrices(priceMap)
    } catch (error) {
      console.error("Error fetching crypto prices:", error)
      toast({
        title: t.common.error,
        description: "Impossible de récupérer les prix des cryptomonnaies",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateCryptoAmount = () => {
    const chfAmount = Number.parseFloat(amount)
    const cryptoPrice = cryptoPrices[selectedCrypto]

    if (chfAmount && cryptoPrice) {
      // Convert CHF to USD (using real-time rates would be better)
      const usdAmount = chfAmount * 1.1 // 1 CHF ≈ 1.1 USD
      const cryptoValue = usdAmount / cryptoPrice
      setCryptoAmount(cryptoValue.toFixed(8))
    }
  }

  const generateQRCode = () => {
    const crypto = cryptoOptions[selectedCrypto]
    let qrData = crypto.address

    if (amount && Number.parseFloat(amount) > 0) {
      const cryptoValue = Number.parseFloat(cryptoAmount)

      switch (selectedCrypto) {
        case "bitcoin":
          qrData = `${crypto.qrPrefix}${crypto.address}?amount=${cryptoValue}`
          break
        case "ethereum":
          const weiAmount = Math.floor(cryptoValue * Math.pow(10, 18))
          qrData = `${crypto.qrPrefix}${crypto.address}?value=${weiAmount}`
          break
        case "algorand":
          const microAlgos = Math.floor(cryptoValue * Math.pow(10, 6))
          qrData = `${crypto.qrPrefix}${crypto.address}?amount=${microAlgos}`
          break
      }
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&bgcolor=FFFFFF&color=000000&margin=10`
    setQrCodeUrl(qrUrl)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: t.messages.copied,
        description: `${label} ${t.messages.copiedToClipboard}`,
      })
    } catch (error) {
      toast({
        title: t.common.error,
        description: t.messages.cannotCopy,
        variant: "destructive",
      })
    }
  }

  const printReceipt = () => {
    const crypto = cryptoOptions[selectedCrypto]
    const receiptContent = `
      CRYPTO STORE LAUSANNE
      Terminal de Paiement
      =====================
      
      Montant: ${amount} CHF
      Crypto: ${cryptoAmount} ${crypto.symbol}
      Taux: ${cryptoPrices[selectedCrypto]?.toFixed(2)} USD
      
      Adresse:
      ${crypto.address}
      
      ${new Date().toLocaleString("fr-CH")}
      =====================
    `

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Reçu de Paiement</title>
            <style>
              body { font-family: monospace; font-size: 12px; margin: 20px; }
              .receipt { width: 300px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="receipt">
              <pre>${receiptContent}</pre>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const simulatePaymentReceived = () => {
    setPaymentStatus("received")
    toast({
      title: "Paiement reçu !",
      description: "Transaction en cours de confirmation...",
    })

    setTimeout(() => {
      setPaymentStatus("confirmed")
      toast({
        title: "Paiement confirmé !",
        description: "Transaction validée sur la blockchain",
      })
    }, 3000)
  }

  const currentCrypto = cryptoOptions[selectedCrypto]
  const currentPrice = cryptoPrices[selectedCrypto]

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="bg-background dark:bg-background">
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t.common.back} au TPE
          </Button>
          <h1 className="text-2xl font-bold text-foreground">💳 {t.tpe.menu.newPayment}</h1>
          <div className="w-32" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Payment Setup */}
          <div className="space-y-6">
            {/* Amount Input */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Montant à encaisser</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount" className="text-foreground">
                    {t.mtPelerin.amountCHF}
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-2xl font-bold text-center bg-background dark:bg-background text-foreground"
                  />
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {["10", "50", "100", "500"].map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(quickAmount)}
                      className="bg-background dark:bg-background"
                    >
                      {quickAmount}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Crypto Selection */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">{t.mtPelerin.cryptocurrency}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <TabsList className="grid w-full grid-cols-3 bg-muted dark:bg-muted">
                    <TabsTrigger value="bitcoin">BTC</TabsTrigger>
                    <TabsTrigger value="ethereum">ETH</TabsTrigger>
                    <TabsTrigger value="algorand">ALGO</TabsTrigger>
                  </TabsList>

                  {Object.entries(cryptoOptions).map(([key, crypto]) => (
                    <TabsContent key={key} value={key} className="mt-4">
                      <div className="flex items-center space-x-4 p-4 bg-muted dark:bg-muted rounded-lg">
                        <div className={`w-12 h-12 ${crypto.color} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-bold text-lg">{crypto.symbol.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{crypto.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {t.priceAlerts.currentPrice}:{" "}
                            {currentPrice ? `$${currentPrice.toFixed(2)}` : t.common.loading}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={fetchCryptoPrices}
                          disabled={loading}
                          className="bg-background dark:bg-background"
                        >
                          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Conversion Display */}
            {amount && cryptoAmount && (
              <Card className="bg-card dark:bg-card">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-bold text-foreground">{amount} CHF</p>
                    <p className="text-muted-foreground">≈</p>
                    <p className="text-2xl font-bold text-primary">
                      {cryptoAmount} {currentCrypto.symbol}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t.mtPelerin.currentRate}: ${currentPrice?.toFixed(2)} USD
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - QR Code & Payment */}
          <div className="space-y-6">
            {/* QR Code */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <QrCode className="mr-2 h-5 w-5" />
                  {t.receive.qrCode} de Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {qrCodeUrl ? (
                  <div className="bg-white p-4 rounded-lg inline-block">
                    <img
                      src={qrCodeUrl || "/placeholder.svg"}
                      alt="QR Code de paiement"
                      className="w-64 h-64 mx-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=256&width=256&text=QR+Code`
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 bg-muted dark:bg-muted rounded-lg flex items-center justify-center mx-auto">
                    <p className="text-muted-foreground">Saisissez un montant</p>
                  </div>
                )}

                {/* Payment Status */}
                <div className="space-y-2">
                  {paymentStatus === "waiting" && (
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      En attente de paiement
                    </Badge>
                  )}
                  {paymentStatus === "received" && (
                    <Badge
                      variant="outline"
                      className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400"
                    >
                      <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      Paiement reçu - Confirmation...
                    </Badge>
                  )}
                  {paymentStatus === "confirmed" && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Paiement confirmé
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(currentCrypto.address, "Adresse")}
                    className="bg-background dark:bg-background"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    {t.receive.copyAddress}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={printReceipt}
                    disabled={!amount}
                    className="bg-background dark:bg-background"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    {t.common.print}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Address Display */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">{t.receive.receiveAddress}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-muted dark:bg-muted rounded-lg break-all text-sm font-mono text-foreground">
                    {currentCrypto.address}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ⚠️ {t.receive.warningText} {currentCrypto.name} ({currentCrypto.symbol}) à cette adresse
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Test Button (for demo) */}
            <Card className="bg-card dark:bg-card border-dashed">
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">Mode démonstration</p>
                <Button
                  onClick={simulatePaymentReceived}
                  disabled={paymentStatus !== "waiting" || !amount}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Simuler réception paiement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
