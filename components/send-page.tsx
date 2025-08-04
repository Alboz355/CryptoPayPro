"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { AppState } from "@/app/page"
import type { WalletData } from "@/lib/wallet-utils"

interface SendPageProps {
  onNavigate: (page: AppState) => void
  walletData: WalletData | null
}

export function SendPage({ onNavigate, walletData }: SendPageProps) {
  const [selectedCrypto, setSelectedCrypto] = useState("bitcoin")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  const handleSendTransaction = async () => {
    if (!walletData) {
      toast({
        title: "Erreur",
        description: "Portefeuille non chargé.",
        variant: "destructive",
      })
      return
    }

    if (!recipientAddress || !amount || Number(amount) <= 0) {
      toast({
        title: "Erreur de saisie",
        description: "Veuillez remplir tous les champs correctement.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)
    toast({
      title: "Envoi en cours...",
      description: `Envoi de ${amount} ${selectedCrypto.toUpperCase()} à ${recipientAddress}...`,
      duration: 5000,
    })

    try {
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // In a real app, you would interact with blockchain APIs here
      // e.g., using ethers.js for Ethereum, bitcoinjs-lib for Bitcoin, algosdk for Algorand

      toast({
        title: "Transaction réussie !",
        description: `Vous avez envoyé ${amount} ${selectedCrypto.toUpperCase()}.`,
        variant: "success",
      })
      setRecipientAddress("")
      setAmount("")
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error)
      toast({
        title: "Erreur d'envoi",
        description: "La transaction a échoué. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground ios-safe-area">
      {/* Header */}
      <div className="flex items-center p-4 ios-safe-top">
        <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")} className="touch-target mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Envoyer des Cryptos</h1>
      </div>

      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Détails de l'envoi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="crypto-select">Cryptomonnaie</Label>
              <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                <SelectTrigger id="crypto-select">
                  <SelectValue placeholder="Sélectionner une cryptomonnaie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                  <SelectItem value="algorand">Algorand (ALGO)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="recipient-address">Adresse du destinataire</Label>
              <Input
                id="recipient-address"
                placeholder="Saisissez l'adresse du destinataire"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                disabled={isSending}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isSending}
              />
            </div>

            <Button onClick={handleSendTransaction} className="w-full" disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Votre solde</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {walletData?.balances[selectedCrypto as keyof typeof walletData.balances] || "0.00"}{" "}
              {selectedCrypto.toUpperCase()}
            </p>
            <p className="text-sm text-muted-foreground">
              Votre adresse: {walletData?.addresses[selectedCrypto as keyof typeof walletData.addresses] || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
