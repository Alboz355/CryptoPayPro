"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Download,
  Filter,
  Eye,
  Receipt,
  TrendingUp,
  DollarSign,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

interface Transaction {
  id: string
  date: string
  time: string
  customer: string
  type: "payment" | "refund" | "conversion"
  cryptoAmount: string
  cryptoSymbol: string
  fiatAmount: string
  fiatCurrency: string
  status: "completed" | "pending" | "failed"
  invoice?: string
  rate: string
}

// Données de test
const mockTransactions: Transaction[] = [
  {
    id: "TX001",
    date: "2024-01-15",
    time: "14:30",
    customer: "Marie Dubois",
    type: "payment",
    cryptoAmount: "0.05",
    cryptoSymbol: "BTC",
    fiatAmount: "2,150.00",
    fiatCurrency: "CHF",
    status: "completed",
    invoice: "INV-001",
    rate: "43,000.00",
  },
  {
    id: "TX002",
    date: "2024-01-15",
    time: "13:45",
    customer: "Jean Martin",
    type: "conversion",
    cryptoAmount: "5.2",
    cryptoSymbol: "ETH",
    fiatAmount: "12,480.00",
    fiatCurrency: "CHF",
    status: "completed",
    rate: "2,400.00",
  },
  {
    id: "TX003",
    date: "2024-01-15",
    time: "12:20",
    customer: "Anna Schmidt",
    type: "payment",
    cryptoAmount: "1000",
    cryptoSymbol: "ALGO",
    fiatAmount: "320.00",
    fiatCurrency: "CHF",
    status: "pending",
    invoice: "INV-002",
    rate: "0.32",
  },
  {
    id: "TX004",
    date: "2024-01-14",
    time: "16:15",
    customer: "Pierre Müller",
    type: "refund",
    cryptoAmount: "0.02",
    cryptoSymbol: "BTC",
    fiatAmount: "860.00",
    fiatCurrency: "CHF",
    status: "completed",
    invoice: "INV-003",
    rate: "43,000.00",
  },
]

export function TPEHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedDate, setSelectedDate] = useState("")

  // Filtrer les transactions
  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch =
      tx.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || tx.type === filterType
    const matchesStatus = filterStatus === "all" || tx.status === filterStatus
    const matchesDate = !selectedDate || tx.date === selectedDate

    return matchesSearch && matchesType && matchesStatus && matchesDate
  })

  // Statistiques
  const totalVolume = mockTransactions
    .filter((tx) => tx.status === "completed")
    .reduce((sum, tx) => sum + Number.parseFloat(tx.fiatAmount.replace(",", "")), 0)

  const completedTransactions = mockTransactions.filter((tx) => tx.status === "completed").length
  const pendingTransactions = mockTransactions.filter((tx) => tx.status === "pending").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <ArrowDownRight className="h-4 w-4 text-green-600" />
      case "refund":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case "conversion":
        return <CreditCard className="h-4 w-4 text-blue-600" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const exportTransactions = () => {
    // Simulation d'export CSV
    const csv = [
      ["ID", "Date", "Heure", "Client", "Type", "Crypto", "Montant Crypto", "Montant Fiat", "Devise", "Statut"].join(
        ",",
      ),
      ...filteredTransactions.map((tx) =>
        [
          tx.id,
          tx.date,
          tx.time,
          tx.customer,
          tx.type,
          tx.cryptoSymbol,
          tx.cryptoAmount,
          tx.fiatAmount,
          tx.fiatCurrency,
          tx.status,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Historique des Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Consultez et analysez toutes vos transactions</p>
        </div>
        <Button onClick={exportTransactions} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Volume Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalVolume.toLocaleString()} CHF</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{mockTransactions.length}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Terminées</p>
                <p className="text-2xl font-bold text-green-600">{completedTransactions}</p>
              </div>
              <ArrowDownRight className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">En Attente</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingTransactions}</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher client ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous types</SelectItem>
                <SelectItem value="payment">Paiements</SelectItem>
                <SelectItem value="conversion">Conversions</SelectItem>
                <SelectItem value="refund">Remboursements</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white dark:bg-gray-800"
            />

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setFilterType("all")
                setFilterStatus("all")
                setSelectedDate("")
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Transactions ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">{getTypeIcon(transaction.type)}</div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">{transaction.id}</span>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status === "completed" && "✅ Terminé"}
                          {transaction.status === "pending" && "⏳ En attente"}
                          {transaction.status === "failed" && "❌ Échoué"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.customer} • {transaction.date} {transaction.time}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {transaction.cryptoAmount} {transaction.cryptoSymbol}
                      </span>
                      <span className="text-gray-500">→</span>
                      <span className="font-bold text-lg text-green-600">
                        {transaction.fiatAmount} {transaction.fiatCurrency}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Taux: {transaction.rate} {transaction.fiatCurrency}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {transaction.invoice && (
                      <Button variant="outline" size="sm">
                        <Receipt className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune transaction trouvée</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
