"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, QrCode, AlertCircle, Wallet, ArrowDown, RefreshCw } from "lucide-react"
import { generateCryptoAddress } from "@/lib/wallet-utils"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"

interface ReceivePageProps {
  onBack: () => void
}

export function ReceivePage({ onBack }: ReceivePageProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [selectedCrypto, setSelectedCrypto] = useState<"bitcoin" | "ethereum" | "algorand">("bitcoin")
  const [addresses, setAddresses] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cryptoOptions = [
    {
      id: "bitcoin" as const,
      name: "Bitcoin",
      symbol: "BTC",
      color: "bg-orange-500",
      icon: "₿",
    },
    {
      id: "ethereum" as const,
      name: "Ethereum",
      symbol: "ETH",
      color: "bg-blue-500",
      icon: "Ξ",
    },
    {
      id: "algorand" as const,
      name: "Algorand",
      symbol: "ALGO",
      color: "bg-black",
      icon: "A",
    },
  ]

  // Générer les adresses au chargement
  useEffect(() => {
    const generateAddresses = async () => {
      setIsGenerating(true)
      setError(null)

      try {
        const newAddresses: Record<string, string> = {}
        for (const crypto of cryptoOptions) {
          try {
            newAddresses[crypto.id] = await generateCryptoAddress(crypto.id)
          } catch (err) {
            console.error(`Erreur génération adresse ${crypto.id}:`, err)
            newAddresses[crypto.id] = "Erreur de génération"
          }
        }
        setAddresses(newAddresses)
      } catch (err) {
        setError("Erreur lors de la génération des adresses")
        console.error("Erreur génération adresses:", err)
      } finally {
        setIsGenerating(false)
      }
    }

    generateAddresses()
  }, [])

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      toast({
        title: "Adresse copiée !",
        description: "L'adresse a été copiée dans le presse-papiers",
        variant: "default",
      })
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier l'adresse",
        variant: "destructive",
      })
    }
  }

  const handleRegenerateAddress = async (crypto: "bitcoin" | "ethereum" | "algorand") => {
    setIsGenerating(true)
    try {
      // Supprimer l'adresse sauvegardée pour forcer la régénération
      if (typeof window !== "undefined") {
        const savedAddresses = JSON.parse(localStorage.getItem("crypto_addresses") || "{}")
        delete savedAddresses[crypto]
        localStorage.setItem("crypto_addresses", JSON.stringify(savedAddresses))
      }

      const newAddress = await generateCryptoAddress(crypto)
      setAddresses((prev) => ({ ...prev, [crypto]: newAddress }))

      toast({
        title: "Adresse régénérée !",
        description: `Nouvelle adresse ${crypto.toUpperCase()} générée`,
        variant: "default",
      })
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de régénérer l'adresse",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedCryptoInfo = cryptoOptions.find((crypto) => crypto.id === selectedCrypto)
  const currentAddress = addresses[selectedCrypto]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ArrowDown className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {t.receive.title}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Partagez votre adresse pour recevoir des cryptomonnaies
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-700 rounded-t-lg">
            <CardTitle className="text-2xl text-gray-800 dark:text-gray-100">Sélectionnez une cryptomonnaie</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs value={selectedCrypto} onValueChange={(value) => setSelectedCrypto(value as typeof selectedCrypto)}>
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-700">
                {cryptoOptions.map((crypto) => (
                  <TabsTrigger
                    key={crypto.id}
                    value={crypto.id}
                    className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                  >
                    <span className="font-bold text-lg">{crypto.icon}</span>
                    <span className="hidden sm:inline">{crypto.symbol}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {cryptoOptions.map((crypto) => (
                <TabsContent key={crypto.id} value={crypto.id} className="space-y-6">
                  <div className="text-center space-y-4">
                    <div
                      className={`w-20 h-20 ${crypto.color} rounded-full flex items-center justify-center mx-auto shadow-lg`}
                    >
                      <span className="text-3xl font-bold text-white">{crypto.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{crypto.name}</h3>
                      <Badge variant="outline" className="text-lg px-4 py-1">
                        {crypto.symbol}
                      </Badge>
                    </div>
                  </div>

                  {error && (
                    <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-700">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                    </Alert>
                  )}

                  {isGenerating ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300">Génération de l'adresse...</p>
                    </div>
                  ) : currentAddress ? (
                    <div className="space-y-6">
                      {/* QR Code Placeholder */}
                      <div className="bg-white dark:bg-gray-700 p-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-center">
                        <QrCode className="h-32 w-32 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">QR Code pour {crypto.name}</p>
                      </div>

                      {/* Address Display */}
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                            Votre adresse {crypto.name}
                          </h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRegenerateAddress(crypto.id)}
                            disabled={isGenerating}
                            className="text-xs"
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Régénérer
                          </Button>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-4">
                          <p className="font-mono text-sm break-all text-gray-800 dark:text-gray-100">
                            {currentAddress}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleCopyAddress(currentAddress)}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Copier l'adresse
                          </Button>
                        </div>
                      </div>

                      {/* Instructions */}
                      <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700">
                        <Wallet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-800 dark:text-blue-200">
                          <strong>Instructions :</strong>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li>• Partagez cette adresse avec l'expéditeur</li>
                            <li>• Vérifiez toujours l'adresse avant de la communiquer</li>
                            <li>• Cette adresse ne fonctionne que pour {crypto.name}</li>
                          </ul>
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                      <p className="text-red-600 dark:text-red-400">Impossible de générer l'adresse</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>

            {/* Back Button */}
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={onBack}
                className="bg-white/70 dark:bg-gray-700/70 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {t.common.back}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>🔒 Vos adresses sont générées de manière sécurisée</p>
        </div>
      </div>
    </div>
  )
}
