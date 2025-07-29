"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  QrCode, 
  Copy, 
  ArrowLeft, 
  Wallet, 
  Share,
  Download,
  Check
} from "lucide-react"
import { useWalletStore } from "@/store/wallet-store"
import { toast } from "sonner"
import QRCode from "react-qr-code"

interface EnhancedReceivePageProps {
  onNavigate: (page: string) => void
}

export function EnhancedReceivePage({ onNavigate }: EnhancedReceivePageProps) {
  const { wallet, getPrimaryAddress } = useWalletStore()
  
  const [selectedCrypto, setSelectedCrypto] = useState("ETH")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [copied, setCopied] = useState(false)

  if (!wallet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Aucun portefeuille trouvé</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const supportedCryptos = [
    { symbol: "ETH", name: "Ethereum", color: "bg-blue-500" },
    { symbol: "BTC", name: "Bitcoin", color: "bg-orange-500" },
    { symbol: "MATIC", name: "Polygon", color: "bg-purple-500" },
    { symbol: "ALGO", name: "Algorand", color: "bg-green-500" },
  ]

  const selectedCryptoInfo = supportedCryptos.find(crypto => crypto.symbol === selectedCrypto)
  const address = getPrimaryAddress(selectedCrypto)

  // Generate QR code data with amount if specified
  const generateQRData = () => {
    let qrData = address

    // Add amount if specified for compatible formats
    if (amount && selectedCrypto === "ETH") {
      qrData = `ethereum:${address}?value=${parseFloat(amount) * 1e18}`
    } else if (amount && selectedCrypto === "BTC") {
      qrData = `bitcoin:${address}?amount=${amount}`
    }
    
    return qrData
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Adresse copiée dans le presse-papiers")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Impossible de copier l'adresse")
    }
  }

  const shareAddress = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Recevoir ${selectedCrypto}`,
          text: `Mon adresse ${selectedCryptoInfo?.name}: ${address}`,
          url: `${selectedCrypto.toLowerCase()}:${address}`
        })
      } catch (error) {
        // User cancelled or share failed
        copyToClipboard(address)
      }
    } else {
      copyToClipboard(address)
    }
  }

  const downloadQR = () => {
    const svg = document.getElementById("qr-code")
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        
        const pngFile = canvas.toDataURL("image/png")
        const downloadLink = document.createElement("a")
        downloadLink.download = `${selectedCrypto}-address-qr.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }
      
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Recevoir des crypto
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Partagez votre adresse pour recevoir des paiements
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Crypto Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Choisir la cryptomonnaie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {supportedCryptos.map((crypto) => (
                    <motion.div
                      key={crypto.symbol}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={selectedCrypto === crypto.symbol ? "default" : "outline"}
                        className="w-full h-16 flex flex-col gap-1"
                        onClick={() => setSelectedCrypto(crypto.symbol)}
                      >
                        <div className={`w-6 h-6 rounded-full ${crypto.color}`} />
                        <span className="font-semibold">{crypto.symbol}</span>
                        <span className="text-xs opacity-75">{crypto.name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Amount (Optional) */}
            <Card>
              <CardHeader>
                <CardTitle>Montant (optionnel)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">Montant à recevoir</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Le montant sera inclus dans le QR code
                  </p>
                </div>

                <div>
                  <Label htmlFor="note">Note (optionnelle)</Label>
                  <Input
                    id="note"
                    placeholder="Description du paiement..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Display */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className={selectedCryptoInfo?.color}>
                    {selectedCrypto}
                  </Badge>
                  Votre adresse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="font-mono text-sm break-all">
                    {address}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(address)}
                    className="flex-1 gap-2"
                    variant={copied ? "default" : "outline"}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copier
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={shareAddress}
                    variant="outline"
                    className="gap-2"
                  >
                    <Share className="h-4 w-4" />
                    Partager
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - QR Code */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* QR Code Display */}
                <div className="flex justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <QRCode
                      id="qr-code"
                      value={generateQRData()}
                      size={256}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      viewBox="0 0 256 256"
                    />
                  </div>
                </div>

                {/* QR Actions */}
                <div className="space-y-3">
                  <Button
                    onClick={downloadQR}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger le QR Code
                  </Button>

                  <Button
                    onClick={() => copyToClipboard(generateQRData())}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copier le lien QR
                  </Button>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Comment utiliser ce QR Code
                  </h3>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Faites scanner ce QR code par l'expéditeur</li>
                    <li>• L'adresse sera automatiquement remplie</li>
                    {amount && <li>• Le montant ({amount} {selectedCrypto}) est inclus</li>}
                    <li>• Vérifiez toujours l'adresse avant de confirmer</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">
                  ⚠️ Conseils de sécurité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    Vérifiez toujours que l'adresse affichée est correcte
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    Ne partagez jamais vos clés privées ou phrase mnémonique
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    Utilisez uniquement des réseaux sécurisés pour partager
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    Attendez les confirmations avant de considérer le paiement reçu
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}