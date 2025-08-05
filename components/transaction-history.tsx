"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/i18n"
import type { AppState } from "@/app/page"

interface TransactionHistoryProps {
  onNavigate: (page: AppState) => void
}

interface Transaction {
  id: string
  type: "sent" | "received"
  crypto: string
  amount: number
  value: number
  address: string
  timestamp: Date
  status: "completed" | "pending" | "failed"
  hash: string
}

export function TransactionHistory({ onNavigate }: TransactionHistoryProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [cryptoFilter, setCryptoFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [periodFilter, setPeriodFilter] = useState("all")

  useEffect(() => {
    // Charger les transactions depuis localStorage ou API
    loadTransactions()
  }, [])

  useEffect(() => {
    // Appliquer les filtres
    applyFilters()
  }, [transactions, searchTerm, typeFilter, cryptoFilter, statusFilter, periodFilter])

  const loadTransactions = () => {
    // Charger depuis localStorage ou utiliser des données par défaut
    const savedTransactions = localStorage.getItem("transaction-history")
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions).map((tx: any) => ({
          ...tx,
          timestamp: new Date(tx.timestamp),
        }))
        setTransactions(parsed)
      } catch (error) {
        console.error("Erreur chargement transactions:", error)
        setTransactions([])
      }
    } else {
      setTransactions([])
    }
  }

  const applyFilters = () => {
    let filtered = [...transactions]

    // Filtre de recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.crypto.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtre par type
    if (typeFilter !== "all") {
      filtered = filtered.filter((tx) => tx.type === typeFilter)
    }

    // Filtre par crypto
    if (cryptoFilter !== "all") {
      filtered = filtered.filter((tx) => tx.crypto === cryptoFilter)
    }

    // Filtre par statut
    if (statusFilter !== "all") {
      filtered = filtered.filter((tx) => tx.status === statusFilter)
    }

    // Filtre par période
    if (periodFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (periodFilter) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
      }

      if (periodFilter !== "all") {
        filtered = filtered.filter((tx) => tx.timestamp >= filterDate)
      }
    }

    // Trier par date (plus récent en premier)
    filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    setFilteredTransactions(filtered)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setCryptoFilter("all")
    setStatusFilter("all")
    setPeriodFilter("all")
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Date", "Type", "Crypto", "Montant", "Valeur CHF", "Adresse", "Statut", "Hash"],
      ...filteredTransactions.map((tx) => [
        tx.timestamp.toLocaleDateString("fr-CH"),
        tx.type === "sent" ? t.dashboard.transactions.sent : t.dashboard.transactions.received,
        tx.crypto,
        tx.amount.toString(),
        tx.value.toFixed(2),
        tx.address,
        getStatusText(tx.status),
        tx.hash,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? t.time.minute : t.time.minutes} ${t.time.ago}`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} ${hours === 1 ? t.time.hour : t.time.hours} ${t.time.ago}`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} ${days === 1 ? t.time.day : t.time.days} ${t.time.ago}`
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
        return t.dashboard.transactions.completed
      case "pending":
        return t.dashboard.transactions.pending
      case "failed":
        return t.dashboard.transactions.failed
      default:
        return status
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => onNavigate("dashboard")}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t.common.back}
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{t.history.title}</h1>
              <p className="text-muted-foreground">{t.history.subtitle}</p>
            </div>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            {t.history.exportCSV}
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              {t.history.filters.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t.history.filters.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.history.filters.allTypes}</SelectItem>
                  <SelectItem value="sent">{t.history.filters.sent}</SelectItem>
                  <SelectItem value="received">{t.history.filters.received}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={cryptoFilter} onValueChange={setCryptoFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.history.filters.allCryptos}</SelectItem>
                  <SelectItem value="BTC">Bitcoin</SelectItem>
                  <SelectItem value="ETH">Ethereum</SelectItem>
                  <SelectItem value="ALGO">Algorand</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.history.filters.allStatuses}</SelectItem>
                  <SelectItem value="completed">{t.history.filters.completed}</SelectItem>
                  <SelectItem value="pending">{t.history.filters.pending}</SelectItem>
                  <SelectItem value="failed">{t.history.filters.failed}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.history.filters.allPeriods}</SelectItem>
                  <SelectItem value="today">{t.history.filters.today}</SelectItem>
                  <SelectItem value="week">{t.history.filters.thisWeek}</SelectItem>
                  <SelectItem value="month">{t.history.filters.thisMonth}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-muted-foreground">
                {filteredTransactions.length} {filteredTransactions.length === 1 ? "transaction" : "transactions"}
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                {t.history.filters.reset}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardContent className="p-0">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t.history.noTransactions}</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ||
                  typeFilter !== "all" ||
                  cryptoFilter !== "all" ||
                  statusFilter !== "all" ||
                  periodFilter !== "all"
                    ? t.history.noTransactionsFiltered
                    : t.history.noTransactionsDescription}
                </p>
                {(searchTerm ||
                  typeFilter !== "all" ||
                  cryptoFilter !== "all" ||
                  statusFilter !== "all" ||
                  periodFilter !== "all") && (
                  <Button variant="outline" onClick={resetFilters}>
                    {t.history.filters.reset}
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y">
                {filteredTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
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

                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">
                              {tx.type === "received"
                                ? t.dashboard.transactions.received
                                : t.dashboard.transactions.sent}{" "}
                              {tx.crypto}
                            </p>
                            {getStatusIcon(tx.status)}
                            <Badge variant={getStatusBadgeVariant(tx.status)}>{getStatusText(tx.status)}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatTimeAgo(tx.timestamp)} • {tx.address.slice(0, 10)}...{tx.address.slice(-6)}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {tx.hash.slice(0, 16)}...{tx.hash.slice(-8)}
                          </p>
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
