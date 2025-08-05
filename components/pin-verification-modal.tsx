"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Shield, AlertCircle } from "lucide-react"
import { verifyPin } from "@/lib/wallet-utils"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/i18n"

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
  description = "Veuillez saisir votre code PIN",
}: PinVerificationModalProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  if (!isOpen) return null

  const handleVerifyPin = async () => {
    setError("")

    if (!pin) {
      setError("Veuillez saisir votre code PIN")
      return
    }

    setIsVerifying(true)

    try {
      const storedPin = localStorage.getItem("pin-hash")
      if (storedPin && (await verifyPin(pin, storedPin))) {
        onVerified()
        setPin("")
      } else {
        setError("Code PIN incorrect")
      }
    } catch (error) {
      setError("Erreur lors de la vérification du PIN")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerifyPin()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">{t.settings.security.pin}</Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="••••••"
              maxLength={6}
              className="text-center text-2xl tracking-widest"
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              {t.common.cancel}
            </Button>
            <Button onClick={handleVerifyPin} disabled={isVerifying || !pin} className="flex-1">
              {isVerifying ? "Vérification..." : t.common.confirm}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
