"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, QrCode, Copy, Share2, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatAddress } from "@/lib/wallet-utils"
import type { AppState } from "@/app/page"

interface ReceivePageProps {
  onNavigate: (page: AppState) => void
  walletData: any
}

export function ReceivePage({ onNavigate, walletData }: ReceivePageProps) {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin")
  const [amount, setAmount] = useState("")
  const [label, setLabel] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const { toast } = useToast()

  const cryptoOptions = {
    bitcoin: {
      name: "Bitcoin",
      symbol: "BTC",
      color: "bg-orange-500",
      address: walletData?.addresses?.bitcoin || "",
      prefix: "bitcoin:",
    },
    ethereum: {
      name: "Ethereum",
      symbol: "ETH",
      color: "bg-blue-500",
      address: walletData?.addresses?.ethereum || "",
      prefix: "ethereum:",
    },
    algorand: {
      name: "Algorand",
      symbol: "ALGO",
      color: "bg-black",
      address: walletData?.addresses?.algorand || "",
      prefix: "algorand:",
    },
  }

  useEffect(() => {
    generateQRCode()
  }, [selectedCrypto, amount, label])

  const generateQRCode = () => {
    const crypto = cryptoOptions[selectedCrypto as keyof typeof cryptoOptions]
    if (!crypto?.address) return

    let qrData = crypto.address

    // Add amount and label if provided
    const params = new URLSearchParams()
    if (amount && Number.parseFloat(amount) > 0) {
      params.append("amount", amount)
    }
    if (label.trim()) {
      params.append("label", label.trim())
    }

    if (params.toString()) {
      qrData = `${crypto.prefix}${crypto.address}?${params.toString()}`
    }

    // Generate QR code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}&bgcolor=FFFFFF&color=000000&margin=10`
    setQrCodeUrl(qrUrl)
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copié !",
        description: `${label} copié dans le presse-papiers`,
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier dans le presse-papiers",
        variant: "destructive",
      })
    }
  }

  const shareAddress = async () => {
    const crypto = cryptoOptions[selectedCrypto as keyof typeof cryptoOptions]
    if (!crypto?.address) return

    const shareData = {
      title: `Adresse ${crypto.name}`,
      text: `Mon adresse ${crypto.name} pour recevoir des paiements`,
      url: crypto.address,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await copyToClipboard(crypto.address, "Adresse")
      }
    } catch (error) {
      console.error("Erreur lors du partage:", error)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `qr-code-${selectedCrypto}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const currentCrypto = cryptoOptions[selectedCrypto as keyof typeof cryptoOptions]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => onNavigate("dashboard")} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Recevoir</h1>
            <p className="text-gray-600 dark:text-gray-400">Générez une adresse pour recevoir des cryptomonnaies</p>
          </div>
          <div className="w-20" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Settings */}
          <div className="space-y-6">
            {/* Crypto Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Cryptomonnaie</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="bitcoin">BTC</TabsTrigger>
                    <TabsTrigger value="ethereum">ETH</TabsTrigger>
                    <TabsTrigger value="algorand">ALGO</TabsTrigger>
                  </TabsList>

                  {Object.entries(cryptoOptions).map(([key, crypto]) => (
                    <TabsContent key={key} value={key} className="mt-4">
                      <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className={`w-12 h-12 ${crypto.color} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-bold text-lg">{crypto.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{crypto.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{formatAddress(crypto.address)}</p>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Optional Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Paramètres optionnels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">Montant (optionnel)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.00000001"
                    placeholder="0.00000000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Spécifiez un montant pour pré-remplir la transaction</p>
                </div>

                <div>
                  <Label htmlFor="label">Libellé (optionnel)</Label>
                  <Input
                    id="label"
                    placeholder="Description du paiement"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Ajoutez une description pour identifier le paiement</p>
                </div>
              </CardContent>
            </Card>

            {/* Address Display */}
            <Card>
              <CardHeader>
                <CardTitle>Adresse de réception</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-mono break-all">{currentCrypto?.address}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentCrypto?.address || "", "Adresse")}
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copier
                    </Button>
                    <Button variant="outline" size="sm" onClick={shareAddress} className="flex-1 bg-transparent">
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </Button>
                  </div>

                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      ⚠️ Envoyez uniquement du {currentCrypto?.name} ({currentCrypto?.symbol}) à cette adresse. L'envoi
                      d'autres cryptomonnaies pourrait entraîner une perte définitive.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - QR Code */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="h-5 w-5 mr-2" />
                  Code QR
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {qrCodeUrl ? (
                  <div className="bg-white p-6 rounded-lg inline-block shadow-sm">
                    <img
                      src={qrCodeUrl || "/placeholder.svg"}
                      alt="QR Code"
                      className="w-64 h-64 mx-auto"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=256&width=256&text=QR+Code`
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-64 h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mx-auto">
                    <p className="text-gray-500">Génération du QR code...</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Badge variant="outline" className="mb-2">
                    {currentCrypto?.name} ({currentCrypto?.symbol})
                  </Badge>

                  {amount && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Montant: {amount} {currentCrypto?.symbol}
                    </p>
                  )}

                  {label && <p className="text-sm text-gray-600 dark:text-gray-400">Libellé: {label}</p>}
                </div>

                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(currentCrypto?.address || "", "Adresse")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copier adresse
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadQRCode} disabled={!qrCodeUrl}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">1</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Partagez cette adresse ou ce QR code avec la personne qui souhaite vous envoyer des{" "}
                      {currentCrypto?.name}
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">2</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Les fonds apparaîtront dans votre portefeuille une fois la transaction confirmée sur la blockchain
                    </p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">3</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Vous pouvez réutiliser cette adresse pour plusieurs transactions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
