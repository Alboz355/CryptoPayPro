"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Wallet,
  Send,
  Download,
  Settings,
  History,
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Bell,
  CreditCard,
  Scan,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react"
import { CryptoList } from "@/components/crypto-list"
import { RealTimePrices } from "@/components/real-time-prices"
import { NetworkSelector } from "@/components/network-selector"
import type { AppState } from "@/app/page"
import type { UserType } from "@/components/onboarding-page"

interface MainDashboardProps {
  onNavigate: (page: AppState) => void
  walletData: any
  onShowMtPelerin: () => void
  onShowPriceAlert: () => void
  userType: UserType | null
}

export function MainDashboard({
  onNavigate,
  walletData,
  onShowMtPelerin,
  onShowPriceAlert,
  userType,
}: MainDashboardProps) {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [selectedNetwork, setSelectedNetwork] = useState("mainnet")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Données de démonstration pour le portfolio
  const portfolioData = {
    totalBalance: "1,247.85",
    totalBalanceUSD: "1,247.85",
    change24h: "+5.2",
    changePercent: "+2.1%",
    cryptos: [
      {
        symbol: "BTC",
        name: "Bitcoin",
        balance: "0.00125000",
        fiatValue: "52.50",
        change: "+2.1%",
        changePositive: true,
        icon: "₿",
      },
      {
        symbol: "ETH",
        name: "Ethereum",
        balance: "0.05000000",
        fiatValue: "125.75",
        change: "+1.8%",
        changePositive: true,
        icon: "Ξ",
      },
      {
        symbol: "ALGO",
        name: "Algorand",
        balance: "100.00000000",
        fiatValue: "18.50",
        change: "-0.5%",
        changePositive: false,
        icon: "Ⱥ",
      },
    ],
  }

  const recentTransactions = [
    {
      id: "1",
      type: "receive" as const,
      crypto: "BTC",
      amount: "+0.00125000",
      fiatAmount: "+$52.50",
      timestamp: "Il y a 2h",
      status: "completed" as const,
    },
    {
      id: "2",
      type: "send" as const,
      crypto: "ETH",
      amount: "-0.01000000",
      fiatAmount: "-$25.15",
      timestamp: "Il y a 1j",
      status: "completed" as const,
    },
    {
      id: "3",
      type: "receive" as const,
      crypto: "ALGO",
      amount: "+50.00000000",
      fiatAmount: "+$9.25",
      timestamp: "Il y a 2j",
      status: "pending" as const,
    },
  ]

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simuler un rafraîchissement
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userType === "merchant" ? "Dashboard Professionnel" : "Mon Portefeuille"}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {userType === "merchant"
                    ? "Gestion crypto pour votre entreprise"
                    : "Gérez vos cryptomonnaies en toute sécurité"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <NetworkSelector selectedNetwork={selectedNetwork} onNetworkChange={setSelectedNetwork} />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Actualiser</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate("settings")}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Paramètres</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Portfolio Overview */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">Portfolio Total</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                      {balanceVisible ? `$${portfolioData.totalBalance}` : "••••••"}
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Badge
                        variant="secondary"
                        className={`${portfolioData.change24h.startsWith("+") ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"}`}
                      >
                        {portfolioData.change24h.startsWith("+") ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {portfolioData.changePercent}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">24h</span>
                    </div>
                  </div>

                  {/* Répartition du portfolio */}
                  <div className="space-y-3">
                    {portfolioData.cryptos.map((crypto, index) => (
                      <div
                        key={crypto.symbol}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {crypto.icon}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{crypto.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {balanceVisible ? crypto.balance : "••••••"} {crypto.symbol}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {balanceVisible ? `$${crypto.fiatValue}` : "••••"}
                          </div>
                          <div className={`text-sm ${crypto.changePositive ? "text-green-600" : "text-red-600"}`}>
                            {crypto.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => onNavigate("send")}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                  >
                    <Send className="h-6 w-6" />
                    <span className="text-sm">Envoyer</span>
                  </Button>

                  <Button
                    onClick={() => onNavigate("receive")}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                  >
                    <Download className="h-6 w-6" />
                    <span className="text-sm">Recevoir</span>
                  </Button>

                  <Button
                    onClick={onShowMtPelerin}
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                  >
                    <CreditCard className="h-6 w-6" />
                    <span className="text-sm">Acheter</span>
                  </Button>

                  {userType === "merchant" && (
                    <Button
                      onClick={() => onNavigate("tpe")}
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    >
                      <Scan className="h-6 w-6" />
                      <span className="text-sm">Mode TPE</span>
                    </Button>
                  )}

                  {userType === "client" && (
                    <Button
                      onClick={onShowPriceAlert}
                      className="h-20 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    >
                      <Bell className="h-6 w-6" />
                      <span className="text-sm">Créer Alerte</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Transactions récentes */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">Transactions Récentes</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate("history")}
                    className="flex items-center space-x-2"
                  >
                    <History className="h-4 w-4" />
                    <span>Voir tout</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${tx.type === "receive" ? "bg-green-100 dark:bg-green-900/20" : "bg-blue-100 dark:bg-blue-900/20"}`}
                        >
                          {tx.type === "receive" ? (
                            <ArrowDownLeft
                              className={`h-4 w-4 ${tx.type === "receive" ? "text-green-600" : "text-blue-600"}`}
                            />
                          ) : (
                            <ArrowUpRight
                              className={`h-4 w-4 ${tx.type === "receive" ? "text-green-600" : "text-blue-600"}`}
                            />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {tx.type === "receive" ? "Reçu" : "Envoyé"} {tx.crypto}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{tx.timestamp}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-semibold ${tx.type === "receive" ? "text-green-600" : "text-gray-900 dark:text-white"}`}
                        >
                          {tx.amount}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{tx.fiatAmount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prix en temps réel */}
            <RealTimePrices />

            {/* Liste des cryptos */}
            <CryptoList />

            {/* Statistiques rapides */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Transactions ce mois</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Volume échangé</span>
                  <span className="font-semibold">$2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Gain/Perte</span>
                  <span className="font-semibold text-green-600">+$127.50</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Objectif mensuel</span>
                    <span className="text-gray-600 dark:text-gray-400">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
