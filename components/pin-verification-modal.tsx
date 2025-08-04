"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Shield, AlertCircle } from "lucide-react"

interface PinVerificationModalProps {
  isOpen: boolean
  onVerified: () => void
  onCancel: () => void
  title: string
  description: string
}

export function PinVerificationModal({ isOpen, onVerified, onCancel, title, description }: PinVerificationModalProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  if (!isOpen) return null

  const handleVerify = async () => {
    if (!pin) {
      setError("Veuillez saisir votre code PIN")
      return
    }

    setIsVerifying(true)
    setError("")

    // Simuler la vérification
    setTimeout(() => {
      const storedPin = localStorage.getItem("pin-hash")
      if (storedPin && btoa(pin) === storedPin) {
        onVerified()
      } else {
        setError("Code PIN incorrect")
      }
      setIsVerifying(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify()
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
            <Label htmlFor="pin">Code PIN</Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Saisissez votre code PIN"
              maxLength={6}
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
              Annuler
            </Button>
            <Button onClick={handleVerify} disabled={isVerifying || !pin} className="flex-1">
              {isVerifying ? "Vérification..." : "Vérifier"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
