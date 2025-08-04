"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Store, Wallet, CheckCircle, ArrowRight } from "lucide-react"

export type UserType = "client" | "merchant"

interface UserTypeSelectionProps {
  onUserTypeSelected: (userType: UserType) => void
}

interface UserTypeOption {
  type: UserType
  title: string
  subtitle: string
  description: string
  icon: React.ComponentType<any>
  features: string[]
  color: string
  bgGradient: string
  badge?: string
}

const userTypes: UserTypeOption[] = [
  {
    type: "client",
    title: "Utilisateur Personnel",
    subtitle: "Gérez vos cryptos",
    description: "Parfait pour gérer votre portefeuille personnel de cryptomonnaies",
    icon: User,
    features: [
      "Portfolio personnel",
      "Envoi/Réception",
      "Suivi des prix",
      "Historique détaillé",
      "Sécurité maximale",
      "Interface intuitive",
    ],
    color: "from-blue-500 to-purple-500",
    bgGradient: "from-blue-50 to-purple-50",
    badge: "Recommandé",
  },
  {
    type: "merchant",
    title: "Commerçant/Entreprise",
    subtitle: "Acceptez les paiements crypto",
    description: "Solution professionnelle pour accepter les paiements en cryptomonnaies",
    icon: Store,
    features: [
      "Terminal de paiement",
      "Gestion clientèle",
      "Facturation avancée",
      "Statistiques détaillées",
      "Conversion automatique",
      "Support multi-crypto",
    ],
    color: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
    badge: "Pro",
  },
]

export function UserTypeSelection({ onUserTypeSelected }: UserTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(null)
  const [isConfirming, setIsConfirming] = useState(false)

  const handleSelection = (type: UserType) => {
    setSelectedType(type)
    setIsConfirming(true)
  }

  const confirmSelection = () => {
    if (selectedType) {
      onUserTypeSelected(selectedType)
    }
  }

  const goBack = () => {
    setSelectedType(null)
    setIsConfirming(false)
  }

  if (isConfirming && selectedType) {
    const selectedOption = userTypes.find((option) => option.type === selectedType)!

    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${selectedOption.bgGradient} dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4`}
      >
        <div className="w-full max-w-2xl">
          <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <div
                className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${selectedOption.color} shadow-xl`}
              >
                <selectedOption.icon className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                Confirmation de votre choix
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{selectedOption.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedOption.description}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h4 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Fonctionnalités incluses :</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedOption.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note :</strong> Vous pourrez toujours changer ce paramètre plus tard dans les réglages de
                  l'application.
                </p>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={goBack} className="flex-1 bg-transparent">
                  Retour
                </Button>
                <Button
                  onClick={confirmSelection}
                  className={`flex-1 bg-gradient-to-r ${selectedOption.color} hover:opacity-90 text-white`}
                >
                  Confirmer
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shadow-2xl">
            <Wallet className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Comment allez-vous utiliser l'application ?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choisissez votre profil pour personnaliser votre expérience
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {userTypes.map((option) => (
            <Card
              key={option.type}
              className="shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleSelection(option.type)}
            >
              <CardHeader className="text-center pb-4">
                <div className="relative">
                  <div
                    className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${option.color} shadow-lg group-hover:scale-110 transition-transform duration-200`}
                  >
                    <option.icon className="h-8 w-8 text-white" />
                  </div>
                  {option.badge && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-400 text-white">
                      {option.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">{option.title}</CardTitle>
                <p className={`text-lg font-semibold bg-gradient-to-r ${option.color} bg-clip-text text-transparent`}>
                  {option.subtitle}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 dark:text-gray-400 text-center">{option.description}</p>

                <div className="space-y-3">
                  {option.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full h-12 text-base font-medium bg-gradient-to-r ${option.color} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-200 group-hover:scale-105`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelection(option.type)
                  }}
                >
                  Choisir ce profil
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>🇨🇭 Vous pourrez modifier ce choix à tout moment dans les paramètres</p>
        </div>
      </div>
    </div>
  )
}
