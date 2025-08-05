"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Send,
  Download,
  ShoppingCart,
  CreditCard,
  Bell,
  Settings,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Users,
  BarChart3,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/i18n"
import { CryptoList } from "./crypto-list"
import { RealTimePrices } from "./real-time-prices"
import type { AppState, UserType, WalletData } from "@/app/page"

interface MainDashboardProps {
  userType: UserType | null
  onNavigate: (page: AppState) => void
  walletData: WalletData | null
  onShowMtPelerin: () => void
  onShowPriceAlert: () => void
}

export function MainDashboard({
  userType,
  onNavigate,
  walletData,
  onShowMtPelerin,
  onShowPriceAlert,
}: MainDashboardProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)

  const [totalBalance] = useState(12847.32)
  const [monthlyChange] = useState(8.5)
  const [monthlyTransactions] = useState(47)
  const [monthlyVolume] = useState(8420.5)
  const [monthlyGoal] = useState(75)
  const [clientsCount] = useState(156)

  const recentTransactions = [
    {
      id: "1",
      type: "received" as const,
      crypto: "BTC",
      amount: 0.0234,
      value: 1250.0,
      from: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: "completed" as const,
    },
    {
      id: "2",
      type: "sent" as const,
      crypto: "ETH",
      amount: 0.85,
      value: 2100.0,
      to: "0x742d35Cc6634C0532925a3b8D4C0C8b3C2e1e3e3",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: "completed" as const,
    },
    {
      id: "3",
      type: "received" as const,
      crypto: "ALGO",
      amount: 500,
      value: 125.0,
      from: "ALGO1234567890ABCDEF",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      status: "pending" as const,
    },
  ]

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} ${days === 1 ? "day" : "days"} ago`
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "pending":
        return "Pending"
      case "failed":
        return "Failed"
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {userType === "merchant" ? "Dashboard Professionnel" : "Tableau de Bord"}
            </h1>
            <p className="text-muted-foreground">
              {userType === "merchant" ? "Gérez votre activité crypto" : "Gérez vos cryptomonnaies"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onShowPriceAlert}>
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => onNavigate("settings")}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-2">Solde Total</p>
                <p className="text-3xl font-bold">
                  CHF {totalBalance.toLocaleString("fr-CH", { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {monthlyChange >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-300" />
                  )}
                  <span className={`text-sm ${monthlyChange >= 0 ? "text-green-300" : "text-red-300"}`}>
                    {monthlyChange >= 0 ? "+" : ""}
                    {monthlyChange}% ce mois
                  </span>
                </div>
              </div>
              <div className="text-right">
                <Avatar className="h-12 w-12 mb-2">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>CW</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={() => onNavigate("send")}>
            <Send className="h-6 w-6" />
            <span>Envoyer</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
            onClick={() => onNavigate("receive")}
          >
            <Download className="h-6 w-6" />
            <span>Recevoir</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={onShowMtPelerin}>
            <ShoppingCart className="h-6 w-6" />
            <span>Acheter</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent" onClick={() => onNavigate("tpe")}>
            <CreditCard className="h-6 w-6" />
            <span>Mode TPE</span>
          </Button>
        </div>

        {/* Statistics Cards for Business Users */}
        {userType === "merchant" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transactions mensuelles</p>
                    <p className="text-2xl font-bold">{monthlyTransactions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Volume échangé</p>
                    <p className="text-2xl font-bold">CHF {monthlyVolume.toLocaleString("fr-CH")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clients</p>
                    <p className="text-2xl font-bold">{clientsCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                    <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Objectif mensuel</p>
                    <div className="flex items-center gap-2">
                      <Progress value={monthlyGoal} className="flex-1" />
                      <span className="text-sm font-medium">{monthlyGoal}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio */}
          <Card>
            <CardHeader>
              <CardTitle>Portefeuille</CardTitle>
            </CardHeader>
            <CardContent>
              <CryptoList />
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Transactions Récentes</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => onNavigate("history")}>
                Voir tout
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          tx.type === "received" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                        }`}
                      >
                        {tx.type === "received" ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {tx.type === "received" ? "Reçu" : "Envoyé"} {tx.crypto}
                          </p>
                          {getStatusIcon(tx.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{formatTimeAgo(tx.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {tx.type === "received" ? "+" : "-"}
                        {tx.amount} {tx.crypto}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        CHF {tx.value.toLocaleString("fr-CH", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Prices */}
        <Card>
          <CardHeader>
            <CardTitle>Prix en Temps Réel</CardTitle>
          </CardHeader>
          <CardContent>
            <RealTimePrices />
          </CardContent>
        </Card>

        {/* Wallet Addresses Display */}
        {walletData && (
          <Card>
            <CardHeader>
              <CardTitle>Vos Adresses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Bitcoin (BTC)</p>
                    <p className="text-sm text-muted-foreground font-mono">{walletData.addresses.bitcoin}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Solde</p>
                    <p className="font-medium">{walletData.balances.bitcoin} BTC</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Ethereum (ETH)</p>
                    <p className="text-sm text-muted-foreground font-mono">{walletData.addresses.ethereum}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Solde</p>
                    <p className="font-medium">{walletData.balances.ethereum} ETH</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">Algorand (ALGO)</p>
                    <p className="text-sm text-muted-foreground font-mono">{walletData.addresses.algorand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Solde</p>
                    <p className="font-medium">{walletData.balances.algorand} ALGO</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
