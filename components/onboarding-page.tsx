"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Shield, Smartphone, Users, Store } from "lucide-react"
import { generateWallet } from "@/lib/wallet-utils"

export type UserType = "individual" | "business"

interface OnboardingPageProps {
  onWalletCreated: (wallet: any, userType: UserType) => void
}

export function OnboardingPage({ onWalletCreated }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null)
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)

  const steps = [
    {
      title: "Bienvenue dans votre portefeuille crypto",
      description: "Gérez vos cryptomonnaies en toute sécurité",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <Wallet className="mx-auto h-16 w-16 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Portefeuille Crypto Sécurisé</h2>
            <p className="text-muted-foreground">
              Stockez, envoyez et recevez vos cryptomonnaies avec une sécurité de niveau bancaire
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <Shield className="mx-auto h-8 w-8 text-green-500 mb-2" />
              <h3 className="font-semibold">Sécurisé</h3>
              <p className="text-sm text-muted-foreground">Chiffrement de niveau militaire</p>
            </div>
            <div className="text-center p-4">
              <Smartphone className="mx-auto h-8 w-8 text-blue-500 mb-2" />
              <h3 className="font-semibold">Mobile</h3>
              <p className="text-sm text-muted-foreground">Accès depuis n'importe où</p>
            </div>
            <div className="text-center p-4">
              <Users className="mx-auto h-8 w-8 text-purple-500 mb-2" />
              <h3 className="font-semibold">Support</h3>
              <p className="text-sm text-muted-foreground">Assistance 24/7</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Choisissez votre type d'utilisation",
      description: "Sélectionnez le mode qui correspond à vos besoins",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card
              className={`cursor-pointer transition-all ${
                selectedUserType === "individual" ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedUserType("individual")}
            >
              <CardHeader className="text-center">
                <Users className="mx-auto h-12 w-12 text-blue-500 mb-2" />
                <CardTitle>Particulier</CardTitle>
                <CardDescription>Pour un usage personnel</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Gestion personnelle de cryptos</li>
                  <li>• Interface simplifiée</li>
                  <li>• Transactions rapides</li>
                  <li>• Alertes de prix</li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                selectedUserType === "business" ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedUserType("business")}
            >
              <CardHeader className="text-center">
                <Store className="mx-auto h-12 w-12 text-green-500 mb-2" />
                <CardTitle>Professionnel</CardTitle>
                <CardDescription>Pour les entreprises</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Terminal de paiement (TPE)</li>
                  <li>• Gestion de la TVA</li>
                  <li>• Rapports détaillés</li>
                  <li>• API pour intégrations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "Cryptomonnaies supportées",
      description: "Gérez plusieurs cryptomonnaies dans un seul portefeuille",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">₿</span>
                </div>
                <CardTitle>Bitcoin</CardTitle>
                <Badge variant="secondary">BTC</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  La première et plus connue des cryptomonnaies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">Ξ</span>
                </div>
                <CardTitle>Ethereum</CardTitle>
                <Badge variant="secondary">ETH</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">Plateforme pour les contrats intelligents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <CardTitle>Algorand</CardTitle>
                <Badge variant="secondary">ALGO</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">Blockchain rapide et écologique</p>
              </CardContent>
            </Card>
          </div>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCreateWallet = async () => {
    if (!selectedUserType) return

    setIsCreatingWallet(true)
    try {
      // Simuler la création du portefeuille
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const wallet = generateWallet()
      const walletData = {
        mnemonic: wallet.mnemonic,
        addresses: wallet.addresses,
        balances: {
          bitcoin: "0.00234",
          ethereum: "0.5678",
          algorand: "1250.75",
        },
        accounts: [],
      }

      onWalletCreated(walletData, selectedUserType)
    } catch (error) {
      console.error("Erreur création portefeuille:", error)
    } finally {
      setIsCreatingWallet(false)
    }
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full mx-1 ${index <= currentStep ? "bg-primary" : "bg-gray-300"}`}
              />
            ))}
          </div>
          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStepData.content}

          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              Précédent
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext} disabled={currentStep === 1 && !selectedUserType}>
                Suivant
              </Button>
            ) : (
              <Button
                onClick={handleCreateWallet}
                disabled={!selectedUserType || isCreatingWallet}
                className="min-w-[120px]"
              >
                {isCreatingWallet ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Création...
                  </div>
                ) : (
                  "Créer le portefeuille"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
