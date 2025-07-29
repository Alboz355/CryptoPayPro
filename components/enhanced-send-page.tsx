"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { 
  Send, 
  ArrowLeft, 
  Wallet, 
  AlertTriangle,
  CheckCircle,
  Zap,
  Clock,
  Turtle,
  Eye,
  EyeOff
} from "lucide-react"
import { useWalletStore } from "@/store/wallet-store"
import { TransactionService } from "@/services/enhanced-blockchain"
import { validators } from "@/utils/validation"
import { toast } from "sonner"

interface EnhancedSendPageProps {
  onNavigate: (page: string) => void
}

interface TransactionEstimate {
  gasLimit: string
  gasPrice: string
  estimatedFee: string
  totalCost: string
}

export function EnhancedSendPage({ onNavigate }: EnhancedSendPageProps) {
  const { wallet, balances, getPrimaryAddress } = useWalletStore()
  
  const [selectedCrypto, setSelectedCrypto] = useState("ETH")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [gasPrice, setGasPrice] = useState(25)
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [estimate, setEstimate] = useState<TransactionEstimate | null>(null)
  const [isEstimating, setIsEstimating] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirmation, setShowConfirmation] = useState(false)

  const transactionService = new TransactionService()

  const supportedCryptos = [
    { symbol: "ETH", name: "Ethereum", color: "bg-blue-500", network: "Ethereum" },
    { symbol: "BTC", name: "Bitcoin", color: "bg-orange-500", network: "Bitcoin" },
    { symbol: "MATIC", name: "Polygon", color: "bg-purple-500", network: "Polygon" },
    { symbol: "ALGO", name: "Algorand", color: "bg-green-500", network: "Algorand" },
  ]

  const selectedCryptoInfo = supportedCryptos.find(crypto => crypto.symbol === selectedCrypto)
  const selectedBalance = balances.find(balance => balance.symbol === selectedCrypto)

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

  // Estimate gas fees when form changes
  useEffect(() => {
    const estimateTransaction = async () => {
      if (!recipientAddress || !amount || !selectedCrypto) return

      // Validate inputs first
      const addressValidation = validators.address(recipientAddress, selectedCrypto)
      const amountValidation = validators.amount(amount, selectedBalance?.balance)
      
      if (!addressValidation.isValid || !amountValidation.isValid) return

      setIsEstimating(true)
      try {
        const fromAddress = getPrimaryAddress(selectedCrypto)
        const estimation = await transactionService.estimateGas(
          selectedCrypto.toLowerCase(),
          fromAddress,
          recipientAddress,
          amount
        )

        const totalCost = (parseFloat(amount) + parseFloat(estimation.estimatedFee)).toFixed(6)
        
        setEstimate({
          ...estimation,
          totalCost
        })
      } catch (error) {
        console.error("Erreur estimation:", error)
      } finally {
        setIsEstimating(false)
      }
    }

    const debounce = setTimeout(estimateTransaction, 500)
    return () => clearTimeout(debounce)
  }, [recipientAddress, amount, selectedCrypto, gasPrice])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate address
    const addressValidation = validators.address(recipientAddress, selectedCrypto)
    if (!addressValidation.isValid) {
      newErrors.address = addressValidation.error || "Adresse invalide"
    }

    // Validate amount
    const amountValidation = validators.amount(amount, selectedBalance?.balance)
    if (!amountValidation.isValid) {
      newErrors.amount = amountValidation.error || "Montant invalide"
    }

    // Check sufficient balance
    if (estimate && selectedBalance) {
      const totalNeeded = parseFloat(estimate.totalCost)
      const availableBalance = parseFloat(selectedBalance.balance)
      
      if (totalNeeded > availableBalance) {
        newErrors.amount = "Solde insuffisant pour couvrir le montant et les frais"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSend = async () => {
    if (!validateForm()) return

    setShowConfirmation(true)
  }

  const confirmTransaction = async () => {
    try {
      // Here you would actually send the transaction
      // For now, we'll just simulate success
      toast.success("Transaction envoyée avec succès !")
      
      // Reset form
      setRecipientAddress("")
      setAmount("")
      setEstimate(null)
      setShowConfirmation(false)
      
      // Navigate back to dashboard
      onNavigate("dashboard")
    } catch (error) {
      console.error("Erreur envoi transaction:", error)
      toast.error("Erreur lors de l'envoi de la transaction")
    }
  }

  const setMaxAmount = () => {
    if (selectedBalance && estimate) {
      const maxAmount = Math.max(0, parseFloat(selectedBalance.balance) - parseFloat(estimate.estimatedFee))
      setAmount(maxAmount.toFixed(6))
    } else if (selectedBalance) {
      // Rough estimate - subtract typical fee
      const roughFee = selectedCrypto === "ETH" ? 0.001 : selectedCrypto === "BTC" ? 0.0001 : 0.001
      const maxAmount = Math.max(0, parseFloat(selectedBalance.balance) - roughFee)
      setAmount(maxAmount.toFixed(6))
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                Envoyer des crypto
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Envoyez des cryptomonnaies de manière sécurisée
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Transaction Form */}
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
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {supportedCryptos.map((crypto) => (
                    <motion.div
                      key={crypto.symbol}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={selectedCrypto === crypto.symbol ? "default" : "outline"}
                        className="w-full h-20 flex flex-col gap-1"
                        onClick={() => setSelectedCrypto(crypto.symbol)}
                      >
                        <div className={`w-6 h-6 rounded-full ${crypto.color}`} />
                        <span className="font-semibold">{crypto.symbol}</span>
                        <span className="text-xs opacity-75">{crypto.network}</span>
                        {selectedBalance && selectedCrypto === crypto.symbol && (
                          <span className="text-xs">
                            {parseFloat(selectedBalance.balance).toFixed(4)}
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recipient Address */}
            <Card>
              <CardHeader>
                <CardTitle>Adresse de destination</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipient">
                    Adresse {selectedCryptoInfo?.name}
                  </Label>
                  <Input
                    id="recipient"
                    placeholder={`Entrez l'adresse ${selectedCrypto}...`}
                    value={recipientAddress}
                    onChange={(e) => {
                      setRecipientAddress(e.target.value)
                      if (errors.address) {
                        setErrors({ ...errors, address: "" })
                      }
                    }}
                    className={`mt-2 ${errors.address ? 'border-red-500' : ''}`}
                  />
                  {errors.address && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.address}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Amount */}
            <Card>
              <CardHeader>
                <CardTitle>Montant à envoyer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amount">
                    Montant ({selectedCrypto})
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value)
                        if (errors.amount) {
                          setErrors({ ...errors, amount: "" })
                        }
                      }}
                      className={`mt-2 pr-16 ${errors.amount ? 'border-red-500' : ''}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={setMaxAmount}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                    >
                      MAX
                    </Button>
                  </div>
                  {errors.amount && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      {errors.amount}
                    </div>
                  )}
                  {selectedBalance && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Disponible: {parseFloat(selectedBalance.balance).toFixed(6)} {selectedCrypto}
                      {selectedBalance.balanceUSD !== "0.00" && (
                        <span> (${selectedBalance.balanceUSD})</span>
                      )}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gas Settings */}
            {(selectedCrypto === "ETH" || selectedCrypto === "MATIC") && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Paramètres de frais</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAdvanced(!isAdvanced)}
                      className="gap-2"
                    >
                      {isAdvanced ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isAdvanced ? "Simple" : "Avancé"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isAdvanced ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Vitesse de transaction</Label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                          <Button
                            variant={gasPrice <= 20 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setGasPrice(15)}
                            className="flex flex-col gap-1 h-16"
                          >
                            <Turtle className="h-4 w-4" />
                            <span className="text-xs">Lent</span>
                            <span className="text-xs">~15 gwei</span>
                          </Button>
                          <Button
                            variant={gasPrice > 20 && gasPrice <= 30 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setGasPrice(25)}
                            className="flex flex-col gap-1 h-16"
                          >
                            <Clock className="h-4 w-4" />
                            <span className="text-xs">Standard</span>
                            <span className="text-xs">~25 gwei</span>
                          </Button>
                          <Button
                            variant={gasPrice > 30 ? "default" : "outline"}
                            size="sm"
                            onClick={() => setGasPrice(35)}
                            className="flex flex-col gap-1 h-16"
                          >
                            <Zap className="h-4 w-4" />
                            <span className="text-xs">Rapide</span>
                            <span className="text-xs">~35 gwei</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label>Prix du gas (gwei): {gasPrice}</Label>
                        <Slider
                          value={[gasPrice]}
                          onValueChange={(value) => setGasPrice(value[0])}
                          max={100}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={!recipientAddress || !amount || Object.keys(errors).length > 0}
              className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 text-white py-6 text-lg"
            >
              Continuer l'envoi
            </Button>
          </motion.div>

          {/* Right Column - Transaction Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Transaction Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Résumé de la transaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!amount || !recipientAddress ? (
                  <div className="text-center py-8">
                    <Send className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Remplissez le formulaire pour voir le résumé
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">De:</span>
                      <span className="font-mono text-sm">
                        {getPrimaryAddress(selectedCrypto).slice(0, 6)}...
                        {getPrimaryAddress(selectedCrypto).slice(-4)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">À:</span>
                      <span className="font-mono text-sm">
                        {recipientAddress.slice(0, 6)}...{recipientAddress.slice(-4)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Montant:</span>
                      <span className="font-semibold">
                        {amount} {selectedCrypto}
                      </span>
                    </div>
                    
                    {estimate && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Frais réseau:</span>
                          <span>
                            {estimate.estimatedFee} {selectedCrypto}
                          </span>
                        </div>
                        
                        <div className="border-t pt-4">
                          <div className="flex justify-between font-semibold">
                            <span>Total:</span>
                            <span>
                              {estimate.totalCost} {selectedCrypto}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    
                    {isEstimating && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-sm text-gray-600 mt-2">Estimation des frais...</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-orange-600">
                  ⚠️ Vérifications importantes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    Vérifiez l'adresse de destination
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    Confirmez le montant à envoyer
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    Vérifiez les frais de transaction
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                    Les transactions sont irréversibles
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Confirmer la transaction</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Veuillez vérifier les détails avant d'envoyer
                </p>
              </div>

              <div className="space-y-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>Montant:</span>
                  <span className="font-semibold">{amount} {selectedCrypto}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frais:</span>
                  <span>{estimate?.estimatedFee} {selectedCrypto}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold">{estimate?.totalCost} {selectedCrypto}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  onClick={confirmTransaction}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Confirmer l'envoi
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}