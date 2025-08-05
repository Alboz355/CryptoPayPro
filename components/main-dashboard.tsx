"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Send,
  QrCode,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  Settings,
  Bell,
  Eye,
  EyeOff,
  Users,
  DollarSign,
  Target,
  BarChart3,
} from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/i18n"
import type { AppState } from "@/app/page"
import type { UserType } from "@/components/onboarding-page"

interface MainDashboardProps {
  onNavigate: (page: AppState) => void
  onShowMtPelerin?: () => void
  onShowPriceAlert?: () => void
  userType?: UserType | null
}

export function MainDashboard({
  onNavigate,
  onShowMtPelerin,
  onShowPriceAlert,
  userType = "client",
}: MainDashboardProps) {
  const { currency, formatPrice } = useCurrency()
  const { language } = useLanguage()
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

  const t = getTranslation(language)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data
  const portfolioData = [
    { name: "Bitcoin", symbol: "BTC", amount: 0.5, value: 25000, change: 5.2, icon: "₿" },
    { name: "Ethereum", symbol: "ETH", amount: 2.3, value: 4600, change: -2.1, icon: "Ξ" },
    { name: "Algorand", symbol: "ALGO", amount: 1000, value: 320, change: 8.7, icon: "◈" },
  ]

  const recentTransactions = [
    {
      id: 1,
      type: "received",
      crypto: "BTC",
      amount: 0.025,
      value: 1250,
      time: "2 " + t.time.hours + " " + t.time.ago,
      status: "completed",
    },
    {
      id: 2,
      type: "sent",
      crypto: "ETH",
      amount: 0.5,
      value: 1000,
      time: "5 " + t.time.hours + " " + t.time.ago,
      status: "completed",
    },
    {
      id: 3,
      type: "received",
      crypto: "ALGO",
      amount: 500,
      value: 160,
      time: "1 " + t.time.day + " " + t.time.ago,
      status: "pending",
    },
  ]

  const totalBalance = portfolioData.reduce((sum, item) => sum + item.value, 0)

  if (!mounted) {
    return null
  }

  const isProfessional = userType === "merchant"

  return (
    <div className="min-h-screen bg-background dark:bg-background p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isProfessional ? t.dashboard.professionalTitle : t.dashboard.title}
          </h1>
          <p className="text-muted-foreground">
            {isProfessional ? t.dashboard.professionalSubtitle : t.dashboard.subtitle}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onShowPriceAlert?.()}>
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onNavigate("settings")}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium opacity-90">{t.dashboard.totalBalance}</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="text-white hover:bg-white/20"
            >
              {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
          <div className="text-4xl font-bold mb-2">{balanceVisible ? formatPrice(totalBalance) : "••••••"}</div>
          <div className="flex items-center text-sm opacity-90">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12.5% {t.time.thisMonth}
          </div>
        </CardContent>
      </Card>

      {/* Professional Statistics (only for merchants) */}
      {isProfessional && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.dashboard.statistics.monthlyTransactions}</p>
                  <p className="text-2xl font-bold">247</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.dashboard.statistics.volumeExchanged}</p>
                  <p className="text-2xl font-bold">{formatPrice(45230)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.tpe.stats.clients}</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t.dashboard.statistics.monthlyGoal}</p>
                  <p className="text-2xl font-bold">78%</p>
                </div>
                <Target className="h-8 w-8 text-orange-500" />
              </div>
              <Progress value={78} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          variant="outline"
          className="h-20 flex-col space-y-2 bg-card hover:bg-accent"
          onClick={() => onNavigate("send")}
        >
          <Send className="h-6 w-6" />
          <span>{t.dashboard.quickActions.send}</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col space-y-2 bg-card hover:bg-accent"
          onClick={() => onNavigate("receive")}
        >
          <QrCode className="h-6 w-6" />
          <span>{t.dashboard.quickActions.receive}</span>
        </Button>
        <Button
          variant="outline"
          className="h-20 flex-col space-y-2 bg-card hover:bg-accent"
          onClick={() => onShowMtPelerin?.()}
        >
          <ShoppingCart className="h-6 w-6" />
          <span>{t.dashboard.quickActions.buy}</span>
        </Button>
        {isProfessional && (
          <Button
            variant="outline"
            className="h-20 flex-col space-y-2 bg-card hover:bg-accent"
            onClick={() => onNavigate("tpe")}
          >
            <CreditCard className="h-6 w-6" />
            <span>{t.dashboard.quickActions.tpeMode}</span>
          </Button>
        )}
      </div>

      {/* Portfolio & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio */}
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.portfolio}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {portfolioData.map((item) => (
              <div key={item.symbol} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.amount} {item.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(item.value)}</p>
                  <div className="flex items-center text-sm">
                    {item.change > 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={item.change > 0 ? "text-green-500" : "text-red-500"}>
                      {item.change > 0 ? "+" : ""}
                      {item.change}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t.dashboard.recentTransactions}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("history")}>
              {t.dashboard.transactions.viewAll}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === "received" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {tx.type === "received" ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {tx.type === "received" ? t.dashboard.transactions.received : t.dashboard.transactions.sent}{" "}
                      {tx.crypto}
                    </p>
                    <p className="text-sm text-muted-foreground">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {tx.type === "received" ? "+" : "-"}
                    {tx.amount} {tx.crypto}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{formatPrice(tx.value)}</span>
                    <Badge variant={tx.status === "completed" ? "default" : "secondary"} className="text-xs">
                      {tx.status === "completed"
                        ? t.dashboard.transactions.completed
                        : t.dashboard.transactions.pending}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
