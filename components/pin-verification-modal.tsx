"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, AlertCircle, X } from "lucide-react"
import { verifyPin } from "@/lib/wallet-utils"
import { useToast } from "@/hooks/use-toast"

interface PinVerificationModalProps {
  isOpen: boolean
  onVerified: () => void
  onCancel: () => void
  title?: string
  description?: string
}

export function PinVerificationModal({
  isOpen,
  onVerified,
  onCancel,
  title = "Vérification PIN",
  description = "Veuillez saisir votre code PIN pour continuer",
}: PinVerificationModalProps) {
  const [pin, setPin] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setPin("")
      setError("")
      setAttempts(0)
    }
  }, [isOpen])

  const handlePinInput = (digit: string) => {
    if (pin.length < 6) {
      const newPin = pin + digit
      setPin(newPin)
      setError("")

      if (newPin.length === 6) {
        setTimeout(() => handleVerifyPin(newPin), 300)
      }
    }
  }

  const handleBackspace = () => {
    setPin(pin.slice(0, -1))
    setError("")
  }

  const handleVerifyPin = async (pinToVerify: string) => {
    setIsVerifying(true)
    try {
      const storedPin = localStorage.getItem("userPin")
      if (!storedPin) {
        setError("Aucun code PIN configuré")
        setPin("")
        return
      }

      const isValid = await verifyPin(pinToVerify, storedPin)
      if (isValid) {
        toast({
          title: "Accès autorisé",
          description: "Code PIN correct",
        })
        onVerified()
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        setError(`Code PIN incorrect (${newAttempts}/3 tentatives)`)
        setPin("")

        if (newAttempts >= 3) {
          toast({
            title: "Trop de tentatives",
            description: "Accès bloqué temporairement",
            variant: "destructive",
          })
          onCancel()
        }
      }
    } catch (error) {
      console.error("Error verifying PIN:", error)
      setError("Erreur de vérification")
      setPin("")
    } finally {
      setIsVerifying(false)
    }
  }

  const renderPinDots = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <div
        key={index}
        className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
          index < pin.length
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
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {keys.flat().map((key, index) => {
          if (key === "") {
            return <div key={index} />
          }

          return (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className={`h-14 text-lg font-semibold transition-all duration-200 ${
                key === "⌫"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40"
                  : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-600 hover:scale-105"
              }`}
              onClick={() => (key === "⌫" ? handleBackspace() : handlePinInput(key))}
              disabled={isVerifying || attempts >= 3}
            >
              {key}
            </Button>
          )
        })}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => !isVerifying && onCancel()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-purple-500 dark:to-pink-600 rounded-full">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <DialogTitle className="text-slate-900 dark:text-white">{title}</DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isVerifying}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription className="text-slate-600 dark:text-slate-300">{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center space-x-3">{renderPinDots()}</div>

          {renderKeypad()}

          {isVerifying && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-purple-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-300">Vérification...</p>
            </div>
          )}

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onCancel}
              disabled={isVerifying}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
