"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  CreditCard,
  Search,
  Receipt,
  History,
  Settings,
  Calculator,
  Users,
  FileText,
  BarChart3,
  Printer,
  Wifi,
  Battery,
  Clock,
} from "lucide-react"
import { TPESearchPage } from "@/components/tpe-search-page"
import { TPEBillingPage } from "@/components/tpe-billing-page"
import { TPEPaymentPage } from "@/components/tpe-payment-page"
import { TPEConversionPage } from "@/components/tpe-conversion-page"
import { TPEHistoryPage } from "@/components/tpe-history-page"
import { TPESettingsPage } from "@/components/tpe-settings-page"
import { TPEVatManagement } from "@/components/tpe-vat-management"
import type { AppState } from "@/app/page"

interface TPEDashboardProps {
  currentPage: AppState
  onNavigate: (page: AppState) => void
  onExitTPE: () => void
  walletData: any
}

export function TPEDashboard({ currentPage, onNavigate, onExitTPE, walletData }: TPEDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  })

  const renderStatusBar = () => (
    <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center text-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Wifi className="h-4 w-4 text-green-400" />
          <span>En ligne</span>
        </div>
        <div className="flex items-center gap-1">
          <Printer className="h-4 w-4 text-blue-400" />
          <span>Imprimante OK</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{currentTime.toLocaleTimeString("fr-CH")}</span>
        </div>
        <div className="flex items-center gap-1">
          <Battery className="h-4 w-4 text-green-400" />
          <span>85%</span>
        </div>
      </div>
    </div>
  )

  const renderTPEMenu = () => (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {renderStatusBar()}

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🏪 Terminal de Paiement</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Mode TPE - Crypto Store Lausanne</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Opérationnel
            </Badge>
            <Button variant="outline" onClick={onExitTPE}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quitter TPE
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ventes Aujourd'hui</p>
                  <p className="text-2xl font-bold text-green-600">2,450 CHF</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
                  <p className="text-2xl font-bold text-blue-600">18</p>
                </div>
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Clients</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Taux Moyen</p>
                  <p className="text-2xl font-bold text-orange-600">7.7%</p>
                </div>
                <Calculator className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Menu */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Nouveau Paiement */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-green-500 to-green-600 text-white"
            onClick={() => onNavigate("tpe-payment")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Nouveau Paiement</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-green-100">Encaisser un paiement crypto</p>
            </CardContent>
          </Card>

          {/* Recherche Client */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("tpe-search")}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Recherche Client</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Trouver un client existant</p>
            </CardContent>
          </Card>

          {/* Facturation */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("tpe-billing")}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <Receipt className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Facturation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Créer et gérer les factures</p>
            </CardContent>
          </Card>

          {/* Conversion */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate("tpe-conversion")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                <Calculator className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <CardTitle>Conversion</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Calculateur crypto/fiat</p>
            </CardContent>
          </Card>

          {/* Historique */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("tpe-history")}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                <History className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <CardTitle>Historique</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Consulter les transactions</p>
            </CardContent>
          </Card>

          {/* Gestion TVA */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate("tpe-vat-management")}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle>Gestion TVA</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Configuration et rapports</p>
            </CardContent>
          </Card>

          {/* Statistiques */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("tpe-settings")}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              </div>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Rapports et analyses</p>
            </CardContent>
          </Card>

          {/* Paramètres */}
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate("tpe-settings")}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Settings className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              </div>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 dark:text-gray-400">Configuration du TPE</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "tpe":
        return renderTPEMenu()
      case "tpe-search":
        return <TPESearchPage onNavigate={onNavigate} onBack={() => onNavigate("tpe")} />
      case "tpe-billing":
        return <TPEBillingPage onNavigate={onNavigate} onBack={() => onNavigate("tpe")} />
      case "tpe-payment":
        return <TPEPaymentPage onNavigate={onNavigate} onBack={() => onNavigate("tpe")} walletData={walletData} />
      case "tpe-conversion":
        return <TPEConversionPage onNavigate={onNavigate} onBack={() => onNavigate("tpe")} />
      case "tpe-history":
        return <TPEHistoryPage onNavigate={onNavigate} onBack={() => onNavigate("tpe")} />
      case "tpe-settings":
        return <TPESettingsPage onNavigate={onNavigate} onBack={() => onNavigate("tpe")} />
      case "tpe-vat-management":
        return <TPEVatManagement onNavigate={onNavigate} onBack={() => onNavigate("tpe")} />
      default:
        return renderTPEMenu()
    }
  }

  return renderCurrentPage()
}
