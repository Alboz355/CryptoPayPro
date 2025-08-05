"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, QrCode, Copy, Download, Share2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateCryptoAddress, formatAddress } from "@/lib/wallet-utils"
import type { AppState } from "@/app/page"

interface ReceivePageProps {
  onNavigate: (page: AppState) => void
  walletData: any
}

interface CryptoOption {
  id: string
  name: string
  symbol: string
  color: string
  icon: string
}

export function ReceivePage({ onNavigate, walletData }: ReceivePageProps) {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin")
  const [amount, setAmount] = useState("")
  const [label, setLabel] = useState("")
  const [message, setMessage] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const cryptoOptions: Record<string, CryptoOption> = {
    bitcoin: {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      color: "bg-orange-500",
      icon: "₿",
    },
    ethereum: {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      color: "bg-blue-500",
      icon: "Ξ",
    },
    algorand: {
      id: "algorand",
      name: "Algorand",
      symbol: "ALGO",
      color: "bg-black",
      icon: "A",
    },
  }

  useEffect(() => {
    loadAddress()
  }, [selectedCrypto])

  useEffect(() => {
    if (address) {
      generateQRCode()
    }
  }, [address, amount, label, message])

  const loadAddress = async () => {
    setLoading(true)
    try {
      let cryptoAddress = ""

      // Try to get address from wallet data first
      if (walletData?.addresses?.[selectedCrypto]) {
        cryptoAddress = walletData.addresses[selectedCrypto]
      } else {
        // Generate new address if not available
        cryptoAddress = await generateCryptoAddress(selectedCrypto as "bitcoin" | "ethereum" | "algorand")
      }

      setAddress(cryptoAddress)
    } catch (error) {
      console.error("Error loading address:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger l'adresse",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = () => {
    if (!address) return

    let qrData = address
    const crypto = cryptoOptions[selectedCrypto]

    // Create URI with parameters if amount is specified
    if (amount && Number.parseFloat(amount) > 0) {
      const amountValue = Number.parseFloat(amount)

      switch (selectedCrypto) {
        case "bitcoin":
          qrData = `bitcoin:${address}?amount=${amountValue}`
          if (label) qrData += `&label=${encodeURIComponent(label)}`
          if (message) qrData += `&message=${encodeURIComponent(message)}`
          break
        case "ethereum":
          qrData = `ethereum:${address}?value=${Math.floor(amountValue * Math.pow(10, 18))}`
          break
        case "algorand":
          qrData = `algorand:${address}?amount=${Math.floor(amountValue * Math.pow(10, 6))}`
          break
      }
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
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Adresse ${cryptoOptions[selectedCrypto].name}`,
          text: `Envoyez-moi du ${cryptoOptions[selectedCrypto].name} à cette adresse:`,
          url: address,
        })
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(address, "Adresse")
      }
    } else {
      copyToClipboard(address, "Adresse")
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.href = qrCodeUrl
    link.download = `${cryptoOptions[selectedCrypto].symbol}-address-qr.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "QR Code téléchargé",
      description: "Le QR code a été sauvegardé dans vos téléchargements",
    })
  }

  const currentCrypto = cryptoOptions[selectedCrypto]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => onNavigate("dashboard")}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour au tableau de bord
          </Button>
          <h1 className="text-2xl font-bold text-foreground">💰 Recevoir des cryptomonnaies</h1>
          <div className="w-32" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Crypto Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choisir la cryptomonnaie</CardTitle>
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
                      <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
                        <div className={`w-12 h-12 ${crypto.color} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-bold text-lg">{crypto.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{crypto.name}</h3>
                          <p className="text-sm text-muted-foreground">Recevez des paiements en {crypto.symbol}</p>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle>Détails du paiement (optionnel)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">Montant ({currentCrypto.symbol})</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.00000001"
                    placeholder="0.00000000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="label">Libellé</Label>
                  <Input
                    id="label"
                    placeholder="Ex: Paiement facture #123"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Input
                    id="message"
                    placeholder="Message pour l'expéditeur"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Display */}
            <Card>
              <CardHeader>
                <CardTitle>Votre adresse de réception</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-lg break-all text-sm font-mono">
                      {address || "Adresse non disponible"}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(address, "Adresse")}
                        disabled={!address}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copier
                      </Button>
                      <Button variant="outline" size="sm" onClick={shareAddress} disabled={!address}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Partager
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - QR Code */}
          <div className="space-y-6">
            {/* QR Code Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <QrCode className="mr-2 h-5 w-5" />
                  Code QR
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {qrCodeUrl && address ? (
                  <>
                    <div className="bg-white p-4 rounded-lg inline-block shadow-sm">
                      <img
                        src={qrCodeUrl || "/placeholder.svg"}
                        alt="QR Code de l'adresse"
                        className="w-64 h-64 mx-auto"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `/placeholder.svg?height=256&width=256&text=QR+Code`
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Scannez ce code QR pour envoyer du {currentCrypto.symbol}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm" onClick={downloadQRCode}>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(address, "Adresse")}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copier adresse
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center mx-auto">
                    <p className="text-muted-foreground">{loading ? "Chargement..." : "QR Code non disponible"}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Summary */}
            {amount && (
              <Card>
                <CardHeader>
                  <CardTitle>Résumé du paiement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Montant:</span>
                    <span className="font-semibold">
                      {amount} {currentCrypto.symbol}
                    </span>
                  </div>
                  {label && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Libellé:</span>
                      <span>{label}</span>
                    </div>
                  )}
                  {message && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Message:</span>
                      <span>{message}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adresse:</span>
                    <span className="font-mono text-sm">{formatAddress(address)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Notice */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Vérifiez toujours l'adresse avant d'effectuer un paiement. Les transactions
                en cryptomonnaies sont irréversibles.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}
