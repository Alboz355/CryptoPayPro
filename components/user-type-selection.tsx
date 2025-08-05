"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Store, Wallet, Shield, Globe, Smartphone, CreditCard, BarChart3 } from "lucide-react"

export type UserType = "client" | "merchant"

interface UserTypeSelectionProps {
  onUserTypeSelected: (userType: UserType) => void
}

export function UserTypeSelection({ onUserTypeSelected }: UserTypeSelectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-xl">
              <Wallet className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Crypto Wallet
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choisissez votre profil d'utilisation pour personnaliser votre expérience crypto
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge
              variant="outline"
              className="bg-white/70 dark:bg-gray-800/70 border-emerald-200 dark:border-emerald-700"
            >
              <Shield className="h-4 w-4 mr-1 text-emerald-600" />
              <span className="text-emerald-700 dark:text-emerald-300">Sécurisé</span>
            </Badge>
            <Badge variant="outline" className="bg-white/70 dark:bg-gray-800/70 border-teal-200 dark:border-teal-700">
              <Globe className="h-4 w-4 mr-1 text-teal-600" />
              <span className="text-teal-700 dark:text-teal-300">Multi-crypto</span>
            </Badge>
            <Badge variant="outline" className="bg-white/70 dark:bg-gray-800/70 border-cyan-200 dark:border-cyan-700">
              <Smartphone className="h-4 w-4 mr-1 text-cyan-600" />
              <span className="text-cyan-700 dark:text-cyan-300">Mobile-first</span>
            </Badge>
          </div>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Client Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl hover:scale-105">
            <CardHeader className="text-center pb-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-t-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <User className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Client Personnel</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">Gérez vos cryptomonnaies personnelles</p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">Portefeuille personnel</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Stockez et gérez vos Bitcoin, Ethereum et Algorand en toute sécurité
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">Sécurité maximale</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Phrase de récupération de 12 mots et chiffrement local
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Smartphone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">Interface intuitive</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Envoyez, recevez et suivez vos transactions facilement
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => onUserTypeSelected("client")}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <User className="h-5 w-5 mr-2" />
                Choisir Client Personnel
              </Button>
            </CardContent>
          </Card>

          {/* Merchant Card */}
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl hover:scale-105">
            <CardHeader className="text-center pb-6 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-t-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Store className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Commerçant</CardTitle>
              <p className="text-gray-600 dark:text-gray-300">Acceptez les paiements crypto dans votre commerce</p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CreditCard className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">Terminal de paiement</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Interface TPE pour accepter les paiements crypto en magasin
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">Suivi des ventes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Historique des transactions et statistiques de vente
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">Multi-devises</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Acceptez BTC, ETH, ALGO avec conversion automatique
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => onUserTypeSelected("merchant")}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Store className="h-5 w-5 mr-2" />
                Choisir Commerçant
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🔒 Vos données sont chiffrées et stockées localement sur votre appareil
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-gray-400 dark:text-gray-500">
            <span>✓ Open Source</span>
            <span>✓ Sans serveur</span>
            <span>✓ Confidentialité totale</span>
          </div>
        </div>
      </div>
    </div>
  )
}
