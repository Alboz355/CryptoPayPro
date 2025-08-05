"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Store, Wallet, Shield, Smartphone, Globe, ArrowRight } from "lucide-react"
import type { UserType } from "@/components/onboarding-page"

interface UserTypeSelectionProps {
  onUserTypeSelected: (userType: UserType) => void
}

export function UserTypeSelection({ onUserTypeSelected }: UserTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(null)

  const userTypes = [
    {
      type: "client" as UserType,
      title: "Particulier",
      description: "Pour un usage personnel",
      icon: Users,
      color: "from-blue-500 to-cyan-600",
      features: [
        "Gestion personnelle de cryptos",
        "Interface simplifiée",
        "Transactions rapides",
        "Alertes de prix",
        "Portefeuille sécurisé",
      ],
    },
    {
      type: "merchant" as UserType,
      title: "Professionnel",
      description: "Pour les entreprises et commerçants",
      icon: Store,
      color: "from-green-500 to-emerald-600",
      features: [
        "Terminal de paiement (TPE)",
        "Gestion de la TVA",
        "Rapports détaillés",
        "Facturation intégrée",
        "API pour intégrations",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Crypto Wallet
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Choisissez votre type d'utilisation
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Sélectionnez le mode qui correspond le mieux à vos besoins pour une expérience optimisée
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {userTypes.map((userType) => {
            const Icon = userType.icon
            const isSelected = selectedType === userType.type

            return (
              <Card
                key={userType.type}
                className={`cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                  isSelected ? "ring-4 ring-blue-500 shadow-2xl scale-105" : "hover:scale-102 shadow-lg"
                } bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-0`}
                onClick={() => setSelectedType(userType.type)}
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${userType.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-800 dark:text-gray-100">{userType.title}</CardTitle>
                  <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                    {userType.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {userType.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {isSelected && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <Badge
                        variant="outline"
                        className="w-full justify-center py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-700"
                      >
                        <span className="text-blue-700 dark:text-blue-300 font-medium">✓ Sélectionné</span>
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-white/70 dark:bg-gray-800/70 rounded-xl backdrop-blur-sm">
            <Shield className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Sécurité maximale</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Chiffrement de niveau bancaire et stockage local sécurisé
            </p>
          </div>
          <div className="text-center p-6 bg-white/70 dark:bg-gray-800/70 rounded-xl backdrop-blur-sm">
            <Smartphone className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Multi-plateforme</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Accessible depuis tous vos appareils en toute sécurité
            </p>
          </div>
          <div className="text-center p-6 bg-white/70 dark:bg-gray-800/70 rounded-xl backdrop-blur-sm">
            <Globe className="h-12 w-12 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Multi-crypto</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Support Bitcoin, Ethereum, Algorand et plus encore
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={() => selectedType && onUserTypeSelected(selectedType)}
            disabled={!selectedType}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuer
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          {!selectedType && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Veuillez sélectionner un type d'utilisation pour continuer
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>🔒 Vos données restent privées et sont stockées localement sur votre appareil</p>
        </div>
      </div>
    </div>
  )
}
