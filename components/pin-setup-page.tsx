"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { hashPin } from "@/lib/wallet-utils"
import { useToast } from "@/hooks/use-toast"

interface PinSetupPageProps {
  onPinCreated: (pin: string) => void
}

export function PinSetupPage({ onPinCreated }: PinSetupPageProps) {
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [step, setStep] = useState<"create" | "confirm">("create")
  const [isCreating, setIsCreating] = useState(false)
  const { toast } = useToast()

  const handlePinInput = (digit: string) => {
    if (step === "create") {
      if (pin.length < 6) {
        const newPin = pin + digit
        setPin(newPin)
        if (newPin.length === 6) {
          setTimeout(() => setStep("confirm"), 300)
        }
      }
    } else {
      if (confirmPin.length < 6) {
        const newConfirmPin = confirmPin + digit
        setConfirmPin(newConfirmPin)
        if (newConfirmPin.length === 6) {
          setTimeout(() => handleCreatePin(pin, newConfirmPin), 300)
        }
      }
    }
  }

  const handleBackspace = () => {
    if (step === "create") {
      setPin(pin.slice(0, -1))
    } else {
      setConfirmPin(confirmPin.slice(0, -1))
    }
  }

  const handleCreatePin = async (originalPin: string, confirmedPin: string) => {
    if (originalPin !== confirmedPin) {
      toast({
        title: "Erreur",
        description: "Les codes PIN ne correspondent pas. Veuillez réessayer.",
        variant: "destructive",
      })
      setPin("")
      setConfirmPin("")
      setStep("create")
      return
    }

    if (originalPin.length !== 6) {
      toast({
        title: "Erreur",
        description: "Le code PIN doit contenir 6 chiffres.",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const hashedPin = await hashPin(originalPin)
      localStorage.setItem("userPin", hashedPin)
      onPinCreated(hashedPin)
      toast({
        title: "Code PIN créé",
        description: "Votre code PIN a été configuré avec succès.",
      })
    } catch (error) {
      console.error("Error creating PIN:", error)
      toast({
        title: "Erreur",
        description: "Impossible de créer le code PIN. Veuillez réessayer.",
        variant: "destructive",
      })
      setPin("")
      setConfirmPin("")
      setStep("create")
    } finally {
      setIsCreating(false)
    }
  }

  const renderPinDots = (currentPin: string) => {
    return Array.from({ length: 6 }, (_, index) => (
      <div
        key={index}
        className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
          index < currentPin.length
            ? "bg-gradient-to-r from-blue-500 to-purple-600 dark:from-purple-500 dark:to-pink-600 border-blue-500 dark:border-purple-500 scale-110"
            : "border-slate-300 dark:border-slate-600 bg-transparent"
        }`}
      />
    ))
  }

  const renderKeypad = () => {
    const keys = [
      ["1", "2", "3"],
      ["4", "5", "6"],
      ["7", "8", "9"],
      ["", "0", "⌫"],
    ]

    return (
      <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
        {keys.flat().map((key, index) => {
          if (key === "") {
            return <div key={index} />
          }

          return (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className={`h-16 text-xl font-semibold transition-all duration-200 ${
                key === "⌫"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
                  : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 hover:scale-105"
              }`}
              onClick={() => (key === "⌫" ? handleBackspace() : handlePinInput(key))}
              disabled={isCreating}
            >
              {key}
            </Button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-purple-500 dark:to-pink-600 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Code PIN de Sécurité</h1>
          <p className="text-slate-600 dark:text-slate-300">
            {step === "create"
              ? "Créez un code PIN à 6 chiffres pour sécuriser votre portefeuille"
              : "Confirmez votre code PIN"}
          </p>
        </div>

        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 text-slate-900 dark:text-white">
              {step === "create" ? (
                <>
                  <Shield className="w-5 h-5 text-blue-600 dark:text-purple-400" />
                  <span>Créer le PIN</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span>Confirmer le PIN</span>
                </>
              )}
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              {step === "create" ? "Choisissez 6 chiffres faciles à retenir" : "Saisissez à nouveau votre code PIN"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {step === "create" && (
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  Ce code PIN sera requis pour accéder à votre portefeuille et effectuer des transactions sensibles.
                </AlertDescription>
              </Alert>
            )}

            {step === "confirm" && pin !== confirmPin && confirmPin.length > 0 && (
              <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  Les codes PIN ne correspondent pas. Veuillez réessayer.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center space-x-3">{renderPinDots(step === "create" ? pin : confirmPin)}</div>

            {renderKeypad()}

            {isCreating && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-purple-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-300">Configuration du code PIN...</p>
              </div>
            )}

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setPin("")
                  setConfirmPin("")
                  setStep("create")
                }}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                disabled={isCreating}
              >
                Recommencer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
