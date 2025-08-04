"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, QrCode, CheckCircle, Clock, DollarSign, Calculator, Receipt, Smartphone } from "lucide-react"

interface PaymentData {
  amount: string
  currency: "CHF" | "EUR" | "USD"
  cryptoCurrency: "BTC" | "ETH" | "ALGO"
  customer?: {
    name: string
    email: string
    phone: string
  }
  description: string
}

// Taux de change simulés
const mockRates = {
  BTC: { CHF: 43000, EUR: 40000, USD: 42000 },
  ETH: { CHF: 2400, EUR: 2200, USD: 2300 },
  ALGO: { CHF: 0.32, EUR: 0.29, USD: 0.31 },
}

export function TPEPaymentPage() {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: "",
    currency: "CHF",
    cryptoCurrency: "BTC",
    description: "",
  })
  const [currentStep, setCurrentStep] = useState<"setup" | "confirm" | "processing" | "completed">("setup")
  const [qrCodeData, setQrCodeData] = useState("")
  const [processingTime, setProcessingTime] = useState(0)

  const calculateCryptoAmount = () => {
    if (!paymentData.amount) return "0"
    const fiatAmount = Number.parseFloat(paymentData.amount)
    const rate = mockRates[paymentData.cryptoCurrency][paymentData.currency]
    const cryptoAmount = fiatAmount / rate

    switch (paymentData.cryptoCurrency) {
      case "BTC":
        return cryptoAmount.toFixed(8)
      case "ETH":
        return cryptoAmount.toFixed(6)
      case "ALGO":
        return cryptoAmount.toFixed(2)
      default:
        return "0"
    }
  }

  const handleStartPayment = () => {
    if (!paymentData.amount || Number.parseFloat(paymentData.amount) <= 0) {
      return
    }

    // Générer QR code simulé
    const cryptoAmount = calculateCryptoAmount()
    setQrCodeData(`${paymentData.cryptoCurrency}:${cryptoAmount}`)
    setCurrentStep("confirm")
  }

  const handleConfirmPayment = () => {
    setCurrentStep("processing")
    setProcessingTime(0)

    // Simulation du traitement
    const interval = setInterval(() => {
      setProcessingTime((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setCurrentStep("completed")
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleNewPayment = () => {
    setPaymentData({
      amount: "",
      currency: "CHF",
      cryptoCurrency: "BTC",
      description: "",
    })
    setCurrentStep("setup")
    setProcessingTime(0)
    setQrCodeData("")
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">💳 Paiement Crypto</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Accepter des paiements en cryptomonnaies</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">🟢 Terminal Actif</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Configuration du paiement */}
        <div className="lg:col-span-2">
          {currentStep === "setup" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Configuration du Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="amount">Montant *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={paymentData.amount}
                      onChange={(e) =>
                        setPaymentData((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      className="text-2xl font-bold text-right"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currency">Devise</Label>
                    <Select
                      value={paymentData.currency}
                      onValueChange={(value: "CHF" | "EUR" | "USD") =>
                        setPaymentData((prev) => ({ ...prev, currency: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CHF">CHF - Franc Suisse</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="USD">USD - Dollar US</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="crypto">Cryptomonnaie</Label>
                  <Select
                    value={paymentData.cryptoCurrency}
                    onValueChange={(value: "BTC" | "ETH" | "ALGO") =>
                      setPaymentData((prev) => ({ ...prev, cryptoCurrency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BTC">₿ Bitcoin (BTC)</SelectItem>
                      <SelectItem value="ETH">Ξ Ethereum (ETH)</SelectItem>
                      <SelectItem value="ALGO">◈ Algorand (ALGO)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentData.amount && (
                  <Alert>
                    <Calculator className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Montant crypto:</strong> {calculateCryptoAmount()} {paymentData.cryptoCurrency}
                      <br />
                      <strong>Taux:</strong> 1 {paymentData.cryptoCurrency} ={" "}
                      {mockRates[paymentData.cryptoCurrency][paymentData.currency].toLocaleString()}{" "}
                      {paymentData.currency}
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="description">Description (optionnelle)</Label>
                  <Textarea
                    id="description"
                    placeholder="Description du paiement..."
                    value={paymentData.description}
                    onChange={(e) =>
                      setPaymentData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleStartPayment}
                    disabled={!paymentData.amount || Number.parseFloat(paymentData.amount) <= 0}
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Générer QR Code
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "confirm" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Confirmation du Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                {/* QR Code simulé */}
                <div className="bg-white p-8 rounded-lg border-2 border-gray-200 inline-block">
                  <div className="w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-white" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">QR Code: {qrCodeData}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {paymentData.amount} {paymentData.currency}
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    = {calculateCryptoAmount()} {paymentData.cryptoCurrency}
                  </p>
                </div>

                <Alert>
                  <Smartphone className="h-4 w-4" />
                  <AlertDescription>
                    Demandez au client de scanner ce QR code avec son portefeuille crypto
                  </AlertDescription>
                </Alert>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep("setup")}>
                    Retour
                  </Button>
                  <Button onClick={handleConfirmPayment} className="flex-1 bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmer la Transaction
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "processing" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Traitement en Cours
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

                <div>
                  <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Vérification de la Transaction
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Attente de confirmation sur le réseau...</p>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${processingTime}%` }}
                  ></div>
                </div>

                <p className="text-sm text-gray-500">Progression: {processingTime}%</p>
              </CardContent>
            </Card>
          )}

          {currentStep === "completed" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Paiement Réussi
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                <div>
                  <p className="text-2xl font-bold text-green-600 mb-2">Transaction Confirmée</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Le paiement de {paymentData.amount} {paymentData.currency} a été reçu avec succès
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Montant:</span>
                    <span className="font-semibold">
                      {calculateCryptoAmount()} {paymentData.cryptoCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Équivalent:</span>
                    <span className="font-semibold">
                      {paymentData.amount} {paymentData.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais réseau:</span>
                    <span className="font-semibold text-green-600">Gratuit</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline">
                    <Receipt className="h-4 w-4 mr-2" />
                    Imprimer Reçu
                  </Button>
                  <Button onClick={handleNewPayment} className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Nouveau Paiement
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel d'informations */}
        <div className="space-y-4">
          {/* Taux actuels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Taux Actuels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(mockRates).map(([crypto, rates]) => (
                <div key={crypto} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="font-semibold">{crypto}</span>
                  <span className="text-sm">
                    {rates[paymentData.currency].toLocaleString()} {paymentData.currency}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <p className="text-sm">Saisissez le montant à recevoir</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <p className="text-sm">Choisissez la cryptomonnaie</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <p className="text-sm">Générez le QR code</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <p className="text-sm">Le client scanne et paye</p>
              </div>
            </CardContent>
          </Card>

          {/* Statut système */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statut Système</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Réseau Bitcoin</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">🟢 Actif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Réseau Ethereum</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">🟢 Actif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Prix Crypto</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">🟢 Sync</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
