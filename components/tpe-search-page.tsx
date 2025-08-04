"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, User, Phone, Mail, MapPin, CreditCard, Clock, Edit, History, UserPlus } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  totalTransactions: number
  totalVolume: number
  lastTransaction: string
  status: "active" | "inactive"
  avatar?: string
  joinDate: string
}

// Données de test
const mockCustomers: Customer[] = [
  {
    id: "CUST001",
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "+41 79 123 45 67",
    address: "Rue de la Paix 15, 1003 Lausanne",
    totalTransactions: 12,
    totalVolume: 25680.5,
    lastTransaction: "2024-01-15 14:30",
    status: "active",
    joinDate: "2023-08-15",
  },
  {
    id: "CUST002",
    name: "Jean Martin",
    email: "jean.martin@email.com",
    phone: "+41 79 234 56 78",
    address: "Avenue du Léman 8, 1005 Lausanne",
    totalTransactions: 8,
    totalVolume: 15420.0,
    lastTransaction: "2024-01-15 13:45",
    status: "active",
    joinDate: "2023-09-22",
  },
  {
    id: "CUST003",
    name: "Anna Schmidt",
    email: "anna.schmidt@email.com",
    phone: "+41 79 345 67 89",
    address: "Chemin des Fleurs 22, 1004 Lausanne",
    totalTransactions: 5,
    totalVolume: 8950.75,
    lastTransaction: "2024-01-15 12:20",
    status: "active",
    joinDate: "2023-10-10",
  },
  {
    id: "CUST004",
    name: "Pierre Müller",
    email: "pierre.muller@email.com",
    phone: "+41 79 456 78 90",
    address: "Route de Berne 33, 1010 Lausanne",
    totalTransactions: 15,
    totalVolume: 42150.25,
    lastTransaction: "2024-01-14 16:15",
    status: "inactive",
    joinDate: "2023-07-05",
  },
]

export function TPESearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)

  // Filtrer les clients
  const filteredCustomers = mockCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
    // Ici, on pourrait naviguer vers la page de paiement avec ce client pré-sélectionné
    console.log("Client sélectionné:", customer)
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🔍 Recherche Client</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Trouvez rapidement vos clients existants</p>
        </div>
        <Button onClick={() => setShowNewCustomerForm(!showNewCustomerForm)} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Nouveau Client
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Panel de recherche */}
        <div className="lg:col-span-1 space-y-4">
          {/* Barre de recherche */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email, téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Liste des clients */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Clients ({filteredCustomers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <div
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        selectedCustomer?.id === customer.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                              {customer.name}
                            </p>
                            <Badge className={`text-xs ${getStatusColor(customer.status)}`}>
                              {customer.status === "active" ? "🟢" : "⚪"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{customer.email}</p>
                          <p className="text-xs text-gray-500">{customer.totalTransactions} transactions</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun client trouvé</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de détails */}
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-2xl">
                        {selectedCustomer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCustomer.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400">ID: {selectedCustomer.id}</p>
                      <Badge className={getStatusColor(selectedCustomer.status)}>
                        {selectedCustomer.status === "active" ? "🟢 Actif" : "⚪ Inactif"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <History className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="info">Informations</TabsTrigger>
                    <TabsTrigger value="stats">Statistiques</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="space-y-4 mt-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Mail className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                            <p className="font-medium text-gray-900 dark:text-white">{selectedCustomer.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Téléphone</p>
                            <p className="font-medium text-gray-900 dark:text-white">{selectedCustomer.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Adresse</p>
                            <p className="font-medium text-gray-900 dark:text-white">{selectedCustomer.address}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Client depuis</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(selectedCustomer.joinDate).toLocaleDateString("fr-CH")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="stats" className="space-y-4 mt-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4 text-center">
                          <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {selectedCustomer.totalTransactions}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Transactions</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <CreditCard className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {selectedCustomer.totalVolume.toLocaleString()} CHF
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Volume Total</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4 text-center">
                          <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {selectedCustomer.lastTransaction.split(" ")[0]}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Dernière Transaction</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Moyenne par Transaction</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                          {(selectedCustomer.totalVolume / selectedCustomer.totalTransactions).toLocaleString()} CHF
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          Basé sur {selectedCustomer.totalTransactions} transactions
                        </p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="actions" className="space-y-4 mt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Button className="w-full h-16 bg-green-600 hover:bg-green-700">
                        <div className="text-center">
                          <CreditCard className="h-6 w-6 mx-auto mb-1" />
                          <div>Nouveau Paiement</div>
                        </div>
                      </Button>

                      <Button variant="outline" className="w-full h-16 bg-transparent">
                        <div className="text-center">
                          <History className="h-6 w-6 mx-auto mb-1" />
                          <div>Voir Historique</div>
                        </div>
                      </Button>

                      <Button variant="outline" className="w-full h-16 bg-transparent">
                        <div className="text-center">
                          <Mail className="h-6 w-6 mx-auto mb-1" />
                          <div>Envoyer Email</div>
                        </div>
                      </Button>

                      <Button variant="outline" className="w-full h-16 bg-transparent">
                        <div className="text-center">
                          <Edit className="h-6 w-6 mx-auto mb-1" />
                          <div>Modifier Profil</div>
                        </div>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sélectionnez un Client</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Recherchez et sélectionnez un client pour voir ses détails
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
