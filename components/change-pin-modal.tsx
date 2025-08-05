"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Shield, AlertCircle, CheckCircle } from "lucide-react"
import { verifyPin } from "@/lib/wallet-utils"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/i18n"

interface ChangePinModalProps {
  isOpen: boolean
  onPinChanged: (newPin: string) => void
  onCancel: () => void
}

export function ChangePinModal({ isOpen, onPinChanged, onCancel }: ChangePinModalProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const [currentPin, setCurrentPin] = useState("")
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [error, setError] = useState("")
  const [isChanging, setIsChanging] = useState(false)

  if (!isOpen) return null

  const handleChangePin = async () => {
    setError("")

    // Vérifications
    if (!currentPin || !newPin || !confirmPin) {
      setError(t.messages.fillAllFields || "Veuillez remplir tous les champs")
      return
    }

    if (newPin.length < 4) {
      setError("Le nouveau PIN doit contenir au moins 4 chiffres")
      return
    }

    if (newPin !== confirmPin) {
      setError("Les nouveaux PINs ne correspondent pas")
      return
    }

    if (currentPin === newPin) {
      setError("Le nouveau PIN doit être différent de l'ancien")
      return
    }

    setIsChanging(true)

    try {
      // Vérifier l'ancien PIN avec hachage sécurisé
      const storedPin = localStorage.getItem("pin-hash")
      if (storedPin && (await verifyPin(currentPin, storedPin))) {
        onPinChanged(newPin)
        setCurrentPin("")
        setNewPin("")
        setConfirmPin("")
      } else {
        setError("Code PIN actuel incorrect")
      }
    } catch (error) {
      setError("Erreur lors de la vérification du PIN")
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-xl">{t.settings.security.changePin}</CardTitle>
                <CardDescription>{t.settings.security.changePinDescription}</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-pin">{t.settings.security.pin} actuel</Label>
            <Input
              id="current-pin"
              type="password"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value)}
              placeholder="Saisissez votre PIN actuel"
              maxLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-pin">Nouveau {t.settings.security.pin}</Label>
            <Input
              id="new-pin"
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Saisissez votre nouveau PIN"
              maxLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-pin">Confirmer le nouveau PIN</Label>
            <Input
              id="confirm-pin"
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Confirmez votre nouveau PIN"
              maxLength={6}
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

          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium">Conseils pour un PIN sécurisé :</p>
                <ul className="mt-1 space-y-1">
                  <li>• Utilisez au moins 4 chiffres</li>
                  <li>• Évitez les séquences simples (1234, 0000)</li>
                  <li>• Ne partagez jamais votre PIN</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              {t.common.cancel}
            </Button>
            <Button
              onClick={handleChangePin}
              disabled={isChanging || !currentPin || !newPin || !confirmPin}
              className="flex-1"
            >
              {isChanging ? "Modification..." : t.settings.security.changePin}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
