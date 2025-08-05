"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  ArrowLeft,
  Search,
  Download,
  Filter,
  Eye,
  Printer,
  Calendar,
  CreditCard,
  TrendingUp,
  Users,
  DollarSign,
} from "lucide-react"

interface Transaction {
  id: string
  date: string
  time: string
  customer: string
  amount: number
  currency: string
  type: "crypto-buy" | "crypto-sell" | "conversion"
  status: "completed" | "pending" | "failed"
  paymentMethod: string
  fee: number
  reference: string
}

interface TPEHistoryPageProps {
  onNavigate: (page: string) => void
  onBack: () => void
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN001",
    date: "2024-01-15",
    time: "14:30:25",
    customer: "Marie Dubois",
    amount: 150.0,
    currency: "CHF",
    type: "crypto-buy",
    status: "completed",
    paymentMethod: "Carte bancaire",
    fee: 3.75,
    reference: "REF-2024-001",
  },
  {
    id: "TXN002",
    date: "2024-01-15",
    time: "13:45:12",
    customer: "Jean Martin",
    amount: 75.5,
    currency: "CHF",
    type: "crypto-sell",
    status: "completed",
    paymentMethod: "Espèces",
    fee: 1.89,
    reference: "REF-2024-002",
  },
  {
    id: "TXN003",
    date: "2024-01-15",
    time: "12:20:45",
    customer: "Anna Schmidt",
    amount: 200.0,
    currency: "CHF",
    type: "conversion",
    status: "pending",
    paymentMethod: "Virement",
    fee: 5.0,
    reference: "REF-2024-003",
  },
  {
    id: "TXN004",
    date: "2024-01-14",
    time: "16:15:30",
    customer: "Pierre Müller",
    amount: 89.25,
    currency: "CHF",
    type: "crypto-buy",
    status: "failed",
    paymentMethod: "Carte bancaire",
    fee: 2.23,
    reference: "REF-2024-004",
  },
]

export function TPEHistoryPage({ onNavigate, onBack }: TPEHistoryPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterDate, setFilterDate] = useState("all")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      searchTerm === "" ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || transaction.type === filterType
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "crypto-buy":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "crypto-sell":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "conversion":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "crypto-buy":
        return "Achat Crypto"
      case "crypto-sell":
        return "Vente Crypto"
      case "conversion":
        return "Conversion"
      default:
        return type
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé"
      case "pending":
        return "En attente"
      case "failed":
        return "Échoué"
      default:
        return status
    }
  }

  const exportData = () => {
    const csvContent = [
      "Date,Heure,Client,Montant,Devise,Type,Statut,Méthode,Frais,Référence",
      ...filteredTransactions.map(
        (t) =>
          `${t.date},${t.time},${t.customer},${t.amount},${t.currency},${getTypeLabel(t.type)},${getStatusLabel(t.status)},${t.paymentMethod},${t.fee},${t.reference}`,
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `historique-tpe-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const printReceipt = (transaction: Transaction) => {
    // Logique d'impression du reçu
    console.log("Impression du reçu pour:", transaction.id)
  }

  // Calculs des statistiques
  const totalAmount = filteredTransactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0)

  const totalFees = filteredTransactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.fee, 0)

  const completedCount = filteredTransactions.filter((t) => t.status === "completed").length
  const uniqueCustomers = new Set(filteredTransactions.map((t) => t.customer)).size

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Header avec bouton retour */}
      <div className="bg-card dark:bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour au TPE</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">📊 Historique des Transactions</h1>
              <p className="text-muted-foreground">Consultez et gérez l'historique des paiements</p>
            </div>
          </div>
          <Button onClick={exportData} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Statistiques rapides */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card dark:bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Encaissé</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalAmount.toFixed(2)} CHF</p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedCount}</p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Clients Uniques</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{uniqueCustomers}</p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card dark:bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Frais Totaux</p>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{totalFees.toFixed(2)} CHF</p>
                </div>
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="mb-6 bg-card dark:bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Filter className="h-5 w-5" />
              Filtres de recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background dark:bg-background"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-background dark:bg-background">
                  <SelectValue placeholder="Type de transaction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="crypto-buy">Achat Crypto</SelectItem>
                  <SelectItem value="crypto-sell">Vente Crypto</SelectItem>
                  <SelectItem value="conversion">Conversion</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-background dark:bg-background">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="failed">Échoué</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterDate} onValueChange={setFilterDate}>
                <SelectTrigger className="bg-background dark:bg-background">
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("all")
                  setFilterStatus("all")
                  setFilterDate("all")
                }}
                className="bg-background dark:bg-background"
              >
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des transactions */}
        <Card className="bg-card dark:bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Transactions ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Aucune transaction trouvée</h3>
                  <p className="text-muted-foreground">
                    Modifiez vos critères de recherche pour voir plus de résultats
                  </p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow bg-background dark:bg-background"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-medium text-foreground">
                          {new Date(transaction.date).toLocaleDateString("fr-CH")}
                        </div>
                        <div className="text-xs text-muted-foreground">{transaction.time}</div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">{transaction.customer}</span>
                          <Badge className={getTypeColor(transaction.type)}>{getTypeLabel(transaction.type)}</Badge>
                          <Badge className={getStatusColor(transaction.status)}>
                            {getStatusLabel(transaction.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.paymentMethod} • Réf: {transaction.reference}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">
                          {transaction.amount.toFixed(2)} {transaction.currency}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Frais: {transaction.fee.toFixed(2)} {transaction.currency}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Dialog
                          open={showDetails && selectedTransaction?.id === transaction.id}
                          onOpenChange={(open) => {
                            setShowDetails(open)
                            if (open) setSelectedTransaction(transaction)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card dark:bg-card max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-foreground">Détails de la transaction</DialogTitle>
                            </DialogHeader>
                            {selectedTransaction && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">ID Transaction</Label>
                                    <p className="text-foreground">{selectedTransaction.id}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Référence</Label>
                                    <p className="text-foreground">{selectedTransaction.reference}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Date et Heure</Label>
                                    <p className="text-foreground">
                                      {selectedTransaction.date} à {selectedTransaction.time}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Client</Label>
                                    <p className="text-foreground">{selectedTransaction.customer}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Montant</Label>
                                    <p className="text-foreground font-bold">
                                      {selectedTransaction.amount.toFixed(2)} {selectedTransaction.currency}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Frais</Label>
                                    <p className="text-foreground">
                                      {selectedTransaction.fee.toFixed(2)} {selectedTransaction.currency}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                                    <Badge className={getTypeColor(selectedTransaction.type)}>
                                      {getTypeLabel(selectedTransaction.type)}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                                    <Badge className={getStatusColor(selectedTransaction.status)}>
                                      {getStatusLabel(selectedTransaction.status)}
                                    </Badge>
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium text-muted-foreground">
                                      Méthode de paiement
                                    </Label>
                                    <p className="text-foreground">{selectedTransaction.paymentMethod}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2 pt-4">
                                  <Button onClick={() => printReceipt(selectedTransaction)} className="flex-1">
                                    <Printer className="h-4 w-4 mr-2" />
                                    Imprimer Reçu
                                  </Button>
                                  <Button variant="outline" onClick={() => setShowDetails(false)} className="flex-1">
                                    Fermer
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => printReceipt(transaction)}
                          disabled={transaction.status !== "completed"}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
