"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Lock, Eye, EyeOff, Shield, AlertTriangle } from "lucide-react"
import { useWalletStore } from "@/store/wallet-store"
import { validators } from "@/utils/validation"
import { toast } from "sonner"

export function PinSetupPage() {
  const { setPin: storePinSetter, authenticate } = useWalletStore()
  
  const [pinLength, setPinLength] = useState("4")
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, parseInt(pinLength))
    setPin(numericValue)
    setError("")
  }

  const handleConfirmPinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, parseInt(pinLength))
    setConfirmPin(numericValue)
    setError("")
  }

  const handleSubmit = async () => {
    // Validate PIN
    const validation = validators.pin(pin)
    if (!validation.isValid) {
      setError(validation.error || "PIN invalide")
      return
    }

    if (pin !== confirmPin) {
      setError("Les PINs ne correspondent pas")
      return
    }

    setIsLoading(true)
    
    try {
      // Save PIN and authenticate
      storePinSetter(pin)
      const isAuthenticated = authenticate(pin)
      
      if (isAuthenticated) {
        toast.success("PIN configuré avec succès !")
      } else {
        setError("Erreur lors de la configuration du PIN")
      }
    } catch (error) {
      console.error("Erreur configuration PIN:", error)
      setError("Erreur lors de la configuration du PIN")
    } finally {
      setIsLoading(false)
    }
  }

  const isValid = pin.length === parseInt(pinLength) && pin === confirmPin

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-4"
          >
            <Lock className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Configuration du PIN
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Créez un PIN sécurisé pour protéger votre portefeuille
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Sécurité renforcée
              </CardTitle>
              <CardDescription>
                Votre PIN sera utilisé pour déverrouiller l'application et confirmer les transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* PIN Length Selection */}
              <div className="space-y-3">
                <Label>Longueur du PIN</Label>
                <RadioGroup value={pinLength} onValueChange={setPinLength}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="4digits" />
                    <Label htmlFor="4digits">4 chiffres (standard)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6" id="6digits" />
                    <Label htmlFor="6digits">6 chiffres (recommandé)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="8" id="8digits" />
                    <Label htmlFor="8digits">8 chiffres (maximum)</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* PIN Input */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">Créer un PIN</Label>
                  <div className="relative">
                    <Input
                      id="pin"
                      type={showPin ? "text" : "password"}
                      value={pin}
                      onChange={(e) => handlePinChange(e.target.value)}
                      placeholder={`Entrez ${pinLength} chiffres`}
                      className="pr-10 text-center text-lg tracking-widest"
                      maxLength={parseInt(pinLength)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPin(!showPin)}
                    >
                      {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPin">Confirmer le PIN</Label>
                  <Input
                    id="confirmPin"
                    type={showPin ? "text" : "password"}
                    value={confirmPin}
                    onChange={(e) => handleConfirmPinChange(e.target.value)}
                    placeholder={`Confirmez ${pinLength} chiffres`}
                    className="text-center text-lg tracking-widest"
                    maxLength={parseInt(pinLength)}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* Security Tips */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Conseils de sécurité
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Choisissez un PIN unique et difficile à deviner</li>
                  <li>• Évitez les suites numériques (1234, 5678, etc.)</li>
                  <li>• Ne partagez jamais votre PIN avec qui que ce soit</li>
                  <li>• Changez votre PIN régulièrement</li>
                </ul>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: isValid ? 1.02 : 1 }}
                whileTap={{ scale: isValid ? 0.98 : 1 }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!isValid || isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg"
                >
                  {isLoading ? "Configuration..." : "Configurer le PIN"}
                </Button>
              </motion.div>

              {/* Progress Indicator */}
              <div className="flex justify-center space-x-2">
                {Array.from({ length: parseInt(pinLength) }).map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index < pin.length
                        ? "bg-green-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
