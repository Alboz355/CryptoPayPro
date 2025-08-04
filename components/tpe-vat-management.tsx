"use client"

import { useState } from "react"
import { ArrowLeft, FileText, Download, Calculator, TrendingUp, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TPEVatManagementProps {
  onNavigate: (page: string) => void
  onBack: () => void
}

export function TPEVatManagement({ onNavigate, onBack }: TPEVatManagementProps) {
  const [vatRates, setVatRates] = useState([
    { id: 1, name: "Taux normal", rate: 7.7, active: true },
    { id: 2, name: "Taux réduit", rate: 2.5, active: true },
    { id: 3, name: "Taux spécial", rate: 3.7, active: true },
    { id: 4, name: "Exonéré", rate: 0, active: true },
  ])

  const [selectedPeriod, setSelectedPeriod] = useState("current-month")
  const [newRate, setNewRate] = useState({ name: "", rate: "" })

  // Données simulées pour les rapports
  const vatReport = {
    totalSales: 15420.5,
    totalVat: 1186.78,
    breakdown: [
      { rate: 7.7, sales: 12000.0, vat: 924.0 },
      { rate: 2.5, sales: 2000.0, vat: 50.0 },
      { rate: 3.7, sales: 1420.5, vat: 52.56 },
      { rate: 0, sales: 0.0, vat: 0.0 },
    ],
  }

  const transactions = [
    { id: 1, date: "2024-01-15", amount: 150.0, vat: 11.55, rate: 7.7, description: "Vente produit A" },
    { id: 2, date: "2024-01-15", amount: 80.0, vat: 2.0, rate: 2.5, description: "Vente produit B" },
    { id: 3, date: "2024-01-14", amount: 200.0, vat: 15.4, rate: 7.7, description: "Vente produit C" },
    { id: 4, date: "2024-01-14", amount: 45.5, vat: 1.68, rate: 3.7, description: "Vente produit D" },
  ]

  const addVatRate = () => {
    if (newRate.name && newRate.rate) {
      const rate = {
        id: Date.now(),
        name: newRate.name,
        rate: Number.parseFloat(newRate.rate),
        active: true,
      }
      setVatRates([...vatRates, rate])
      setNewRate({ name: "", rate: "" })
    }
  }

  const toggleVatRate = (id: number) => {
    setVatRates(vatRates.map((rate) => (rate.id === id ? { ...rate, active: !rate.active } : rate)))
  }

  const exportReport = (format: "csv" | "pdf") => {
    // Simulation d'export
    const data =
      format === "csv"
        ? "Date,Montant,TVA,Taux,Description\n" +
          transactions.map((t) => `${t.date},${t.amount},${t.vat},${t.rate}%,"${t.description}"`).join("\n")
        : "Rapport PDF généré"

    const blob = new Blob([data], { type: format === "csv" ? "text/csv" : "application/pdf" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rapport-tva-${selectedPeriod}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion TVA</h1>
            <p className="text-sm text-gray-600">Configuration et rapports TVA</p>
          </div>
        </div>
        <Calculator className="h-8 w-8 text-blue-600" />
      </div>

      <Tabs defaultValue="rates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="rates">Taux TVA</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Configuration des taux */}
        <TabsContent value="rates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Taux de TVA configurés
              </CardTitle>
              <CardDescription>Gérez les différents taux de TVA applicables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vatRates.map((rate) => (
                  <div key={rate.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={rate.active ? "default" : "secondary"}>{rate.rate}%</Badge>
                      <span className="font-medium">{rate.name}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toggleVatRate(rate.id)}>
                      {rate.active ? "Désactiver" : "Activer"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ajouter un nouveau taux</CardTitle>
              <CardDescription>Créez un nouveau taux de TVA personnalisé</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rate-name">Nom du taux</Label>
                  <Input
                    id="rate-name"
                    placeholder="Ex: Taux hôtellerie"
                    value={newRate.name}
                    onChange={(e) => setNewRate({ ...newRate, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate-value">Taux (%)</Label>
                  <Input
                    id="rate-value"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 3.7"
                    value={newRate.rate}
                    onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={addVatRate} className="w-full">
                Ajouter le taux
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rapports TVA */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Résumé TVA
              </CardTitle>
              <CardDescription>
                <div className="flex items-center gap-4 mt-2">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-48">
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportReport("csv")}>
                      <Download className="h-4 w-4 mr-2" />
                      CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportReport("pdf")}>
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">Total des ventes HT</div>
                    <div className="text-2xl font-bold text-blue-600">{vatReport.totalSales.toFixed(2)} CHF</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600">Total TVA collectée</div>
                    <div className="text-2xl font-bold text-green-600">{vatReport.totalVat.toFixed(2)} CHF</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Répartition par taux</h4>
                  {vatReport.breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{item.rate}%</Badge>
                        <span className="text-sm">Ventes: {item.sales.toFixed(2)} CHF</span>
                      </div>
                      <span className="font-medium">{item.vat.toFixed(2)} CHF</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions détaillées */}
        <TabsContent value="transactions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Transactions récentes
              </CardTitle>
              <CardDescription>Détail des transactions avec TVA</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Montant HT</TableHead>
                    <TableHead className="text-right">Taux</TableHead>
                    <TableHead className="text-right">TVA</TableHead>
                    <TableHead className="text-right">Total TTC</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString("fr-CH")}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell className="text-right">{transaction.amount.toFixed(2)} CHF</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">{transaction.rate}%</Badge>
                      </TableCell>
                      <TableCell className="text-right">{transaction.vat.toFixed(2)} CHF</TableCell>
                      <TableCell className="text-right font-medium">
                        {(transaction.amount + transaction.vat).toFixed(2)} CHF
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
