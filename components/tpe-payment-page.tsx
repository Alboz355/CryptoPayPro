"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  CreditCard,
  Calculator,
  QrCode,
  Printer,
  Check,
  AlertTriangle,
  Smartphone,
  Banknote,
  Receipt,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, generateTransactionId } from "@/lib/wallet-utils"
import { convertCurrency, getCryptoPrice } from "@/lib/exchange-rates"
import { walletStorage } from "@/lib/storage"
import type { AppState, WalletData } from "@/app/page"

interface TPEPaymentPageProps {
  onNavigate: (page: AppState) => void
  onBack: () => void
  walletData: WalletData | null
}

interface PaymentItem {
  id: string
  name: string
  price: number
  quantity: number
  vatRate: number
}

interface PaymentMethod {
  id: string
  name: string
  icon: any
  type: "card" | "crypto" | "cash"
}

export function TPEPaymentPage({ onNavigate, onBack, walletData }: TPEPaymentPageProps) {
  const [items, setItems] = useState<PaymentItem[]>([])
  const [currentItem, setCurrentItem] = useState({ name: "", price: "", quantity: 1 })
  const [selectedCurrency, setSelectedCurrency] = useState("CHF")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failed">("idle")
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [receiptData, setReceiptData] = useState<any>(null)

  const paymentMethods: PaymentMethod[] = [
    { id: "card", name: "Carte bancaire", icon: CreditCard, type: "card" },
    { id: "contactless", name: "Sans contact", icon: Smartphone, type: "card" },
    { id: "bitcoin", name: "Bitcoin", icon: QrCode, type: "crypto" },
    { id: "ethereum", name: "Ethereum", icon: QrCode, type: "crypto" },
    { id: "cash", name: "Espèces", icon: Banknote, type: "cash" },
  ]

  const currencies = [
    { code: "CHF", symbol: "CHF", name: "Franc suisse" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "USD", symbol: "$", name: "Dollar américain" },
  ]

  useEffect(() => {
    loadExchangeRates()
  }, [selectedCurrency])

  const loadExchangeRates = async () => {
    try {
      const rates: Record<string, number> = {}

      if (selectedCurrency !== "CHF") {
        rates["CHF"] = await convertCurrency(1, selectedCurrency, "CHF")
      }

      // Load crypto prices
      const btcPrice = await getCryptoPrice("BTC")
      const ethPrice = await getCryptoPrice("ETH")

      rates["BTC"] = await convertCurrency(btcPrice.price, "USD", selectedCurrency)
      rates["ETH"] = await convertCurrency(ethPrice.price, "USD", selectedCurrency)

      setExchangeRates(rates)
    } catch (error) {
      console.error("Failed to load exchange rates:", error)
    }
  }

  const addItem = () => {
    if (!currentItem.name || !currentItem.price) {
      setError("Veuillez remplir tous les champs")
      return
    }

    const price = Number.parseFloat(currentItem.price)
    if (isNaN(price) || price <= 0) {
      setError("Prix invalide")
      return
    }

    const newItem: PaymentItem = {
      id: generateTransactionId(),
      name: currentItem.name,
      price: price,
      quantity: currentItem.quantity,
      vatRate: 7.7, // TVA suisse par défaut
    }

    setItems([...items, newItem])
    setCurrentItem({ name: "", price: "", quantity: 1 })
    setError("")
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return
    setItems(items.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const calculateVAT = () => {
    return items.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity
      return sum + (itemTotal * item.vatRate) / 100
    }, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT()
  }

  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      setError("Veuillez sélectionner un mode de paiement")
      return
    }

    if (items.length === 0) {
      setError("Aucun article dans le panier")
      return
    }

    setIsLoading(true)
    setPaymentStatus("processing")
    setError("")

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const transactionId = generateTransactionId()
      const total = calculateTotal()

      const receipt = {
        id: transactionId,
        timestamp: Date.now(),
        items: items,
        subtotal: calculateSubtotal(),
        vat: calculateVAT(),
        total: total,
        currency: selectedCurrency,
        paymentMethod: selectedPaymentMethod,
        status: "completed",
      }

      // Save transaction
      await walletStorage.saveTransaction({
        id: transactionId,
        hash: transactionId,
        from: "customer",
        to: "merchant",
        amount: total.toString(),
        currency: selectedCurrency,
        timestamp: Date.now(),
        status: "confirmed",
      })

      setReceiptData(receipt)
      setPaymentStatus("success")
    } catch (error) {
      setPaymentStatus("failed")
      setError("Erreur lors du traitement du paiement")
    } finally {
      setIsLoading(false)
    }
  }

  const printReceipt = () => {
    if (!receiptData) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const receiptHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu - ${receiptData.id}</title>
          <style>
            body { font-family: monospace; font-size: 12px; margin: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .total { border-top: 1px solid #000; margin-top: 10px; padding-top: 10px; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>CryptoPay TPE</h2>
            <p>Reçu de paiement</p>
            <p>${new Date(receiptData.timestamp).toLocaleString("fr-CH")}</p>
            <p>Transaction: ${receiptData.id}</p>
          </div>
          
          <div class="items">
            ${receiptData.items
              .map(
                (item: PaymentItem) => `
              <div class="item">
                <span>${item.name} x${item.quantity}</span>
                <span>${formatCurrency(item.price * item.quantity, selectedCurrency)}</span>
              </div>
            `,
              )
              .join("")}
          </div>
          
          <div class="total">
            <div class="item">
              <span>Sous-total:</span>
              <span>${formatCurrency(receiptData.subtotal, selectedCurrency)}</span>
            </div>
            <div class="item">
              <span>TVA (7.7%):</span>
              <span>${formatCurrency(receiptData.vat, selectedCurrency)}</span>
            </div>
            <div class="item">
              <span>Total:</span>
              <span>${formatCurrency(receiptData.total, selectedCurrency)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Mode de paiement: ${receiptData.paymentMethod.name}</p>
            <p>Merci de votre achat!</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(receiptHtml)
    printWindow.document.close()
    printWindow.print()
  }

  const resetPayment = () => {
    setItems([])
    setSelectedPaymentMethod(null)
    setPaymentStatus("idle")
    setReceiptData(null)
    setError("")
  }

  if (paymentStatus === "success" && receiptData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-green-600">Paiement réussi</CardTitle>
              <CardDescription>Transaction #{receiptData.id.slice(-8)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Résumé de la commande</h3>
                <div className="space-y-2">
                  {receiptData.items.map((item: PaymentItem) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span>{formatCurrency(item.price * item.quantity, selectedCurrency)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Sous-total:</span>
                    <span>{formatCurrency(receiptData.subtotal, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TVA:</span>
                    <span>{formatCurrency(receiptData.vat, selectedCurrency)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(receiptData.total, selectedCurrency)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={printReceipt} variant="outline" className="flex-1 bg-transparent">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimer
                </Button>
                <Button onClick={resetPayment} className="flex-1">
                  Nouveau paiement
                </Button>
              </div>

              <Button onClick={onBack} variant="outline" className="w-full bg-transparent">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour au menu
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Header */}
      <div className="bg-card dark:bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour au TPE</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <CreditCard className="mr-2 h-6 w-6" />
                Nouveau Paiement
              </h1>
              <p className="text-muted-foreground">Traitement sécurisé des paiements</p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center space-x-2">
            {["amount", "client", "payment", "confirmation"].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    paymentStatus === "success" && receiptData
                      ? "bg-primary text-primary-foreground"
                      : index < ["amount", "client", "payment", "confirmation"].indexOf("payment")
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < ["amount", "client", "payment", "confirmation"].indexOf("payment") ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < 3 && (
                  <div
                    className={`w-8 h-0.5 ${
                      index < ["amount", "client", "payment", "confirmation"].indexOf("payment")
                        ? "bg-green-500"
                        : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Items and payment */}
          <div className="space-y-6">
            {/* Add item */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5" />
                  Ajouter un article
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Nom de l'article</Label>
                    <Input
                      id="itemName"
                      value={currentItem.name}
                      onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                      placeholder="Ex: Café"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itemPrice">Prix unitaire</Label>
                    <Input
                      id="itemPrice"
                      type="number"
                      step="0.01"
                      value={currentItem.price}
                      onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantité</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={currentItem.quantity}
                      onChange={(e) =>
                        setCurrentItem({ ...currentItem, quantity: Number.parseInt(e.target.value) || 1 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Devise</Label>
                    <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={addItem} className="w-full">
                  Ajouter à la commande
                </Button>
              </CardContent>
            </Card>

            {/* Payment methods */}
            <Card>
              <CardHeader>
                <CardTitle>Mode de paiement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    return (
                      <Button
                        key={method.id}
                        variant={selectedPaymentMethod?.id === method.id ? "default" : "outline"}
                        onClick={() => setSelectedPaymentMethod(method)}
                        className="h-16 flex-col"
                      >
                        <Icon className="h-6 w-6 mb-1" />
                        <span className="text-xs">{method.name}</span>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Cart and total */}
          <div className="space-y-6">
            {/* Cart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Receipt className="mr-2 h-5 w-5" />
                  Commande ({items.length} article{items.length !== 1 ? "s" : ""})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun article dans la commande</p>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(item.price, selectedCurrency)} × {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => removeItem(item.id)}>
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Total */}
            {items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Total</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total:</span>
                      <span>{formatCurrency(calculateSubtotal(), selectedCurrency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA (7.7%):</span>
                      <span>{formatCurrency(calculateVAT(), selectedCurrency)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>{formatCurrency(calculateTotal(), selectedCurrency)}</span>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={processPayment}
                    disabled={isLoading || !selectedPaymentMethod || items.length === 0}
                    className="w-full h-12"
                  >
                    {isLoading ? (
                      <>
                        <ArrowLeft className="mr-2 h-4 w-4 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Payer {formatCurrency(calculateTotal(), selectedCurrency)}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
