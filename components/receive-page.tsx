"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Copy,
  QrCode,
  CheckCircle,
  AlertCircle,
  Bitcoin,
  Coins,
  Wallet,
  ArrowLeft,
  RefreshCw,
  Share2,
} from "lucide-react"
import { generateCryptoAddress, formatAddress, addTransaction } from "@/lib/wallet-utils"
import { useLanguage } from "@/contexts/language-context"
import { toast } from "sonner"

interface ReceivePageProps {
  onBack: () => void
}

export function ReceivePage({ onBack }: ReceivePageProps) {
  const { t } = useLanguage()
  const [selectedCrypto, setSelectedCrypto] = useState<"bitcoin" | "ethereum" | "algorand">("bitcoin")
  const [addresses, setAddresses] = useState<Record<string, string>>({})
  const [customAmount, setCustomAmount] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const cryptoOptions = [
    {
      id: "bitcoin" as const,
      name: "Bitcoin",
      symbol: "BTC",
      icon: Bitcoin,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
      borderColor: "border-orange-200 dark:border-orange-700",
    },
    {
      id: "ethereum" as const,
      name: "Ethereum",
      symbol: "ETH",
      icon: Coins,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-700",
    },
    {
      id: "algorand" as const,
      name: "Algorand",
      symbol: "ALGO",
      icon: Wallet,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-700",
    },
  ]

  const selectedCryptoInfo = cryptoOptions.find((crypto) => crypto.id === selectedCrypto)!

  // Générer les adresses au chargement
  useEffect(() => {
    const generateAddresses = () => {
      setIsGenerating(true)
      try {
        const newAddresses: Record<string, string> = {}
        cryptoOptions.forEach((crypto) => {
          newAddresses[crypto.id] = generateCryptoAddress(crypto.id)
        })
        setAddresses(newAddresses)
      } catch (error) {
        console.error("Erreur lors de la génération des adresses:", error)
        toast.error("Erreur lors de la génération des adresses")
      } finally {
        setIsGenerating(false)
      }
    }

    generateAddresses()
  }, [])

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(address)
      toast.success("Adresse copiée dans le presse-papiers")
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch (error) {
      toast.error("Erreur lors de la copie")
    }
  }

  const handleShareAddress = async () => {
    const address = addresses[selectedCrypto]
    if (!address) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Adresse ${selectedCryptoInfo.name}`,
          text: `Mon adresse ${selectedCryptoInfo.name} pour recevoir des ${selectedCryptoInfo.symbol}`,
          url: address,
        })
      } else {
        await handleCopyAddress(address)
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error)
    }
  }

  const generateQRCodeUrl = (address: string, amount?: string) => {
    let qrData = address
    if (amount && Number.parseFloat(amount) > 0) {
      switch (selectedCrypto) {
        case "bitcoin":
          qrData = `bitcoin:${address}?amount=${amount}`
          break
        case "ethereum":
          qrData = `ethereum:${address}?value=${amount}`
          break
        case "algorand":
          qrData = `algorand:${address}?amount=${amount}`
          break
      }
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`
  }

  const handleRefreshAddress = () => {
    setIsGenerating(true)
    try {
      const newAddress = generateCryptoAddress(selectedCrypto)
      setAddresses((prev) => ({
        ...prev,
        [selectedCrypto]: newAddress,
      }))
      toast.success("Nouvelle adresse générée")
    } catch (error) {
      console.error("Erreur lors de la génération de l'adresse:", error)
      toast.error("Erreur lors de la génération de l'adresse")
    } finally {
      setIsGenerating(false)
    }
  }

  const simulateReceiveTransaction = () => {
    const amount = customAmount || "0.001"
    addTransaction({
      type: "received",
      crypto: selectedCrypto,
      amount,
      address: addresses[selectedCrypto] || "Adresse de test",
      status: "confirmed",
      hash: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    })
    toast.success(`Transaction simulée: +${amount} ${selectedCryptoInfo.symbol}`)
  }

  const currentAddress = addresses[selectedCrypto]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {t.receive.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">Générez une adresse pour recevoir des cryptomonnaies</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sélection de crypto */}
          <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-600" />
                Choisir la cryptomonnaie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedCrypto} onValueChange={(value) => setSelectedCrypto(value as any)}>
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  {cryptoOptions.map((crypto) => {
                    const Icon = crypto.icon
                    return (
                      <TabsTrigger
                        key={crypto.id}
                        value={crypto.id}
                        className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                      >
                        <Icon className="h-4 w-4" />
                        {crypto.symbol}
                      </TabsTrigger>
                    )
                  })}
                </TabsList>

                {cryptoOptions.map((crypto) => {
                  const Icon = crypto.icon
                  return (
                    <TabsContent key={crypto.id} value={crypto.id} className="space-y-4">
                      <div className={`p-6 rounded-xl ${crypto.bgColor} ${crypto.borderColor} border-2 text-center`}>
                        <Icon className={`h-12 w-12 ${crypto.color} mx-auto mb-3`} />
                        <h3 className="text-xl font-semibold mb-2">{crypto.name}</h3>
                        <Badge variant="outline" className={`${crypto.color} border-current`}>
                          {crypto.symbol}
                        </Badge>
                      </div>

                      {/* Montant personnalisé */}
                      <div className="space-y-2">
                        <Label htmlFor="amount">Montant (optionnel)</Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.00000001"
                          placeholder={`0.00 ${crypto.symbol}`}
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="bg-white dark:bg-gray-700"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Spécifiez un montant pour générer un QR code de paiement
                        </p>
                      </div>
                    </TabsContent>
                  )
                })}
              </Tabs>
            </CardContent>
          </Card>

          {/* Adresse et QR Code */}
          <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-teal-600" />
                Adresse de réception
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isGenerating ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">Génération de l'adresse...</p>
                </div>
              ) : currentAddress ? (
                <>
                  {/* QR Code */}
                  <div className="text-center">
                    <div className="inline-block p-4 bg-white rounded-xl shadow-lg">
                      <img
                        src={generateQRCodeUrl(currentAddress, customAmount) || "/placeholder.svg"}
                        alt="QR Code"
                        className="w-48 h-48 mx-auto"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Scannez ce QR code pour envoyer des {selectedCryptoInfo.symbol}
                    </p>
                  </div>

                  {/* Adresse */}
                  <div className="space-y-3">
                    <Label>Adresse {selectedCryptoInfo.name}</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentAddress}
                        readOnly
                        className="font-mono text-sm bg-gray-50 dark:bg-gray-700"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyAddress(currentAddress)}
                        className="shrink-0"
                      >
                        {copiedAddress === currentAddress ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Adresse courte: {formatAddress(currentAddress)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={handleRefreshAddress}
                      disabled={isGenerating}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                      Nouvelle adresse
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleShareAddress}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Share2 className="h-4 w-4" />
                      Partager
                    </Button>
                  </div>

                  {/* Simulation pour les tests */}
                  <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700">
                    <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                      <div className="flex items-center justify-between">
                        <span>Mode test - Simuler une réception</span>
                        <Button
                          size="sm"
                          onClick={simulateReceiveTransaction}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Simuler
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </>
              ) : (
                <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-700">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-800 dark:text-red-200">
                    Erreur lors de la génération de l'adresse. Veuillez réessayer.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8 shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Instructions importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">✅ À faire</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Vérifiez toujours l'adresse avant d'envoyer</li>
                  <li>• Utilisez le QR code pour éviter les erreurs</li>
                  <li>• Conservez une copie de l'adresse</li>
                  <li>• Testez avec un petit montant d'abord</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-red-700 dark:text-red-300">❌ À éviter</h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• N'envoyez jamais d'autres cryptos sur cette adresse</li>
                  <li>• Ne partagez pas votre phrase de récupération</li>
                  <li>• Ne faites pas confiance aux adresses par email</li>
                  <li>• N'utilisez pas d'adresses non vérifiées</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
