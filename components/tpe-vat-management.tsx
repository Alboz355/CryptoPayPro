"use client"

import { useState } from "react"
import { ArrowLeft, FileText, Download, Calculator, TrendingUp, Settings, Plus, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface TPEVatManagementProps {
  onNavigate: (page: string) => void
  onBack: () => void
}

interface VatRate {
  id: number
  name: string
  rate: number
  active: boolean
  description?: string
  category: string
}

interface VatTransaction {
  id: string
  date: string
  description: string
  amount: number
  vatRate: number
  vatAmount: number
  category: string
  customer?: string
}

export function TPEVatManagement({ onNavigate, onBack }: TPEVatManagementProps) {
  const [vatRates, setVatRates] = useState<VatRate[]>([
    { id: 1, name: "Taux normal", rate: 7.7, active: true, description: "Taux standard suisse", category: "standard" },
    {
      id: 2,
      name: "Taux réduit",
      rate: 2.5,
      active: true,
      description: "Produits de première nécessité",
      category: "reduced",
    },
    {
      id: 3,
      name: "Taux spécial hôtellerie",
      rate: 3.7,
      active: true,
      description: "Services d'hébergement",
      category: "special",
    },
    { id: 4, name: "Exonéré", rate: 0, active: true, description: "Produits exonérés de TVA", category: "exempt" },
  ])

  const [selectedPeriod, setSelectedPeriod] = useState("current-month")
  const [newRate, setNewRate] = useState({
    name: "",
    rate: "",
    description: "",
    category: "standard",
  })
  const [editingRate, setEditingRate] = useState<VatRate | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  // Données simulées pour les transactions
  const vatTransactions: VatTransaction[] = [
    {
      id: "T001",
      date: "2024-01-15",
      description: "Vente Bitcoin",
      amount: 150.0,
      vatRate: 7.7,
      vatAmount: 11.55,
      category: "crypto",
      customer: "Marie Dubois",
    },
    {
      id: "T002",
      date: "2024-01-15",
      description: "Conversion ETH",
      amount: 80.0,
      vatRate: 7.7,
      vatAmount: 6.16,
      category: "crypto",
      customer: "Jean Martin",
    },
    {
      id: "T003",
      date: "2024-01-14",
      description: "Service conseil",
      amount: 200.0,
      vatRate: 7.7,
      vatAmount: 15.4,
      category: "service",
    },
    {
      id: "T004",
      date: "2024-01-14",
      description: "Formation crypto",
      amount: 45.5,
      vatRate: 2.5,
      vatAmount: 1.14,
      category: "education",
    },
  ]

  // Données simulées pour les rapports
  const vatReport = {
    totalSales: 15420.5,
    totalVat: 1186.78,
    breakdown: [
      { rate: 7.7, sales: 12000.0, vat: 924.0, transactions: 15 },
      { rate: 2.5, sales: 2000.0, vat: 50.0, transactions: 3 },
      { rate: 3.7, sales: 1420.5, vat: 52.56, transactions: 2 },
      { rate: 0, sales: 0.0, vat: 0.0, transactions: 0 },
    ],
  }

  const addVatRate = () => {
    if (newRate.name && newRate.rate) {
      const rate: VatRate = {
        id: Date.now(),
        name: newRate.name,
        rate: Number.parseFloat(newRate.rate),
        active: true,
        description: newRate.description,
        category: newRate.category,
      }
      setVatRates([...vatRates, rate])
      setNewRate({ name: "", rate: "", description: "", category: "standard" })
      setShowAddDialog(false)
    }
  }

  const updateVatRate = () => {
    if (editingRate) {
      setVatRates(vatRates.map((rate) => (rate.id === editingRate.id ? editingRate : rate)))
      setEditingRate(null)
      setShowEditDialog(false)
    }
  }

  const toggleVatRate = (id: number) => {
    setVatRates(vatRates.map((rate) => (rate.id === id ? { ...rate, active: !rate.active } : rate)))
  }

  const deleteVatRate = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce taux de TVA ?")) {
      setVatRates(vatRates.filter((rate) => rate.id !== id))
    }
  }

  const exportReport = (format: "csv" | "pdf") => {
    const data =
      format === "csv"
        ? "Date,Description,Montant HT,Taux TVA,Montant TVA,Total TTC,Catégorie,Client\n" +
          vatTransactions
            .map(
              (t) =>
                `${t.date},"${t.description}",${t.amount},${t.vatRate}%,${t.vatAmount},${(t.amount + t.vatAmount).toFixed(2)},${t.category},"${t.customer || ""}"`,
            )
            .join("\n")
        : "Rapport PDF généré"

    const blob = new Blob([data], { type: format === "csv" ? "text/csv" : "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rapport-tva-${selectedPeriod}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "standard":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "reduced":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "special":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "exempt":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      standard: "Standard",
      reduced: "Réduit",
      special: "Spécial",
      exempt: "Exonéré",
    }
    return labels[category] || category
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Header avec bouton retour */}
      <div className="bg-card dark:bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour au TPE</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <Calculator className="mr-2 h-6 w-6" />
                Gestion TVA
              </h1>
              <p className="text-muted-foreground">Configuration et rapports TVA avancés</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => exportReport("csv")} variant="outline" className="bg-background dark:bg-background">
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button onClick={() => exportReport("pdf")} variant="outline" className="bg-background dark:bg-background">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        <Tabs defaultValue="rates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-muted dark:bg-muted">
            <TabsTrigger value="rates">Taux TVA</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Configuration des taux */}
          <TabsContent value="rates" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">Taux de TVA configurés</h2>
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Taux
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card dark:bg-card">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau taux de TVA</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="rate-name">Nom du taux</Label>
                      <Input
                        id="rate-name"
                        placeholder="Ex: Taux hôtellerie"
                        value={newRate.name}
                        onChange={(e) => setNewRate({ ...newRate, name: e.target.value })}
                        className="bg-background dark:bg-background"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rate-value">Taux (%)</Label>
                        <Input
                          id="rate-value"
                          type="number"
                          step="0.1"
                          placeholder="Ex: 3.7"
                          value={newRate.rate}
                          onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
                          className="bg-background dark:bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rate-category">Catégorie</Label>
                        <Select
                          value={newRate.category}
                          onValueChange={(value) => setNewRate({ ...newRate, category: value })}
                        >
                          <SelectTrigger className="bg-background dark:bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="reduced">Réduit</SelectItem>
                            <SelectItem value="special">Spécial</SelectItem>
                            <SelectItem value="exempt">Exonéré</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate-description">Description</Label>
                      <Textarea
                        id="rate-description"
                        placeholder="Description du taux de TVA"
                        value={newRate.description}
                        onChange={(e) => setNewRate({ ...newRate, description: e.target.value })}
                        className="bg-background dark:bg-background"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={addVatRate} className="flex-1">
                        Ajouter
                      </Button>
                      <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                        Annuler
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {vatRates.map((rate) => (
                <Card key={rate.id} className="bg-card dark:bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-lg font-bold px-3 py-1">
                            {rate.rate}%
                          </Badge>
                          <Badge className={getCategoryColor(rate.category)}>{getCategoryLabel(rate.category)}</Badge>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{rate.name}</h3>
                          {rate.description && <p className="text-sm text-muted-foreground">{rate.description}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={rate.active} onCheckedChange={() => toggleVatRate(rate.id)} />
                        <Dialog
                          open={showEditDialog && editingRate?.id === rate.id}
                          onOpenChange={(open) => {
                            setShowEditDialog(open)
                            if (open) setEditingRate(rate)
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card dark:bg-card">
                            <DialogHeader>
                              <DialogTitle>Modifier le taux de TVA</DialogTitle>
                            </DialogHeader>
                            {editingRate && (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Nom du taux</Label>
                                  <Input
                                    id="edit-name"
                                    value={editingRate.name}
                                    onChange={(e) => setEditingRate({ ...editingRate, name: e.target.value })}
                                    className="bg-background dark:bg-background"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-rate">Taux (%)</Label>
                                    <Input
                                      id="edit-rate"
                                      type="number"
                                      step="0.1"
                                      value={editingRate.rate}
                                      onChange={(e) =>
                                        setEditingRate({ ...editingRate, rate: Number.parseFloat(e.target.value) })
                                      }
                                      className="bg-background dark:bg-background"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-category">Catégorie</Label>
                                    <Select
                                      value={editingRate.category}
                                      onValueChange={(value) => setEditingRate({ ...editingRate, category: value })}
                                    >
                                      <SelectTrigger className="bg-background dark:bg-background">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="standard">Standard</SelectItem>
                                        <SelectItem value="reduced">Réduit</SelectItem>
                                        <SelectItem value="special">Spécial</SelectItem>
                                        <SelectItem value="exempt">Exonéré</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    value={editingRate.description || ""}
                                    onChange={(e) => setEditingRate({ ...editingRate, description: e.target.value })}
                                    className="bg-background dark:bg-background"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={updateVatRate} className="flex-1">
                                    Sauvegarder
                                  </Button>
                                  <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                                    Annuler
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteVatRate(rate.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Rapports TVA */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <TrendingUp className="h-5 w-5" />
                      Résumé TVA
                    </CardTitle>
                    <CardDescription>Période sélectionnée: {selectedPeriod}</CardDescription>
                  </div>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-48 bg-background dark:bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current-month">Mois en cours</SelectItem>
                      <SelectItem value="last-month">Mois dernier</SelectItem>
                      <SelectItem value="current-quarter">Trimestre en cours</SelectItem>
                      <SelectItem value="last-quarter">Trimestre dernier</SelectItem>
                      <SelectItem value="current-year">Année en cours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-muted-foreground">Total des ventes HT</div>
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {vatReport.totalSales.toFixed(2)} CHF
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-sm text-muted-foreground">Total TVA collectée</div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {vatReport.totalVat.toFixed(2)} CHF
                      </div>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-sm text-muted-foreground">Total TTC</div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {(vatReport.totalSales + vatReport.totalVat).toFixed(2)} CHF
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Répartition par taux</h4>
                    {vatReport.breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted dark:bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{item.rate}%</Badge>
                          <div className="text-sm">
                            <div className="text-foreground">Ventes: {item.sales.toFixed(2)} CHF</div>
                            <div className="text-muted-foreground">{item.transactions} transactions</div>
                          </div>
                        </div>
                        <span className="font-medium text-foreground">{item.vat.toFixed(2)} CHF</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Graphique des tendances */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Évolution mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted dark:bg-muted rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Graphique des tendances TVA</p>
                    <p className="text-sm">Fonctionnalité à venir</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions détaillées */}
          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <FileText className="h-5 w-5" />
                  Transactions avec TVA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead className="text-right">Montant HT</TableHead>
                      <TableHead className="text-right">Taux</TableHead>
                      <TableHead className="text-right">TVA</TableHead>
                      <TableHead className="text-right">Total TTC</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vatTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.date).toLocaleDateString("fr-CH")}</TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>{transaction.customer || "-"}</TableCell>
                        <TableCell className="text-right">{transaction.amount.toFixed(2)} CHF</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">{transaction.vatRate}%</Badge>
                        </TableCell>
                        <TableCell className="text-right">{transaction.vatAmount.toFixed(2)} CHF</TableCell>
                        <TableCell className="text-right font-medium">
                          {(transaction.amount + transaction.vatAmount).toFixed(2)} CHF
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor(transaction.category)}>{transaction.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Paramètres TVA */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Settings className="h-5 w-5" />
                  Paramètres TVA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Calcul automatique de la TVA</Label>
                    <p className="text-sm text-muted-foreground">
                      Calculer automatiquement la TVA sur les transactions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Affichage des prix TTC</Label>
                    <p className="text-sm text-muted-foreground">Afficher les prix toutes taxes comprises</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Impression détaillée TVA</Label>
                    <p className="text-sm text-muted-foreground">Inclure le détail TVA sur les reçus</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-vat">Taux TVA par défaut</Label>
                  <Select defaultValue="7.7">
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {vatRates
                        .filter((rate) => rate.active)
                        .map((rate) => (
                          <SelectItem key={rate.id} value={rate.rate.toString()}>
                            {rate.name} ({rate.rate}%)
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vat-number">Numéro de TVA</Label>
                  <Input
                    id="vat-number"
                    placeholder="CHE-123.456.789 TVA"
                    className="bg-background dark:bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accounting-period">Période comptable</Label>
                  <Select defaultValue="quarterly">
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                      <SelectItem value="quarterly">Trimestrielle</SelectItem>
                      <SelectItem value="yearly">Annuelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Sauvegarde et export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sauvegarde automatique des rapports</Label>
                    <p className="text-sm text-muted-foreground">Sauvegarder automatiquement les rapports TVA</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="export-format">Format d'export par défaut</Label>
                  <Select defaultValue="csv">
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter la configuration TVA
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
