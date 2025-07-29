"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Wallet,
  Send,
  Download,
  History,
  Settings,
  Eye,
  EyeOff,
  TrendingUp,
  Copy,
  RefreshCw,
  Plus,
  QrCode,
} from "lucide-react"
import { useWalletStore } from "@/store/wallet-store"
import { BlockchainManager } from "@/lib/blockchain-apis"
import { PolygonService, AlgorandService, PriceService } from "@/services/enhanced-blockchain"
import { toast } from "sonner"

interface EnhancedDashboardProps {
  onNavigate: (page: string) => void
}

export function EnhancedDashboard({ onNavigate }: EnhancedDashboardProps) {
  const {
    wallet,
    balances,
    transactions,
    isLoading,
    showBalance,
    updateBalances,
    updateTransactions,
    setLoading,
    toggleBalanceVisibility,
    getPrimaryAddress,
  } = useWalletStore()

  const [priceData, setPriceData] = useState<Record<string, number>>({})
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Services
  const [blockchainManager] = useState(() => new BlockchainManager())
  const [polygonService] = useState(() => new PolygonService())
  const [algorandService] = useState(() => new AlgorandService())
  const [priceService] = useState(() => PriceService.getInstance())

  // Load blockchain data
  const loadData = async (isRefresh = false) => {
    if (!wallet || (!isRefresh && isLoading)) return

    if (isRefresh) {
      setIsRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      console.log("🔄 Chargement des données blockchain...")

      const addresses = {
        eth: getPrimaryAddress("ETH"),
        btc: getPrimaryAddress("BTC"),
        matic: getPrimaryAddress("MATIC"),
        algo: getPrimaryAddress("ALGO"),
      }

      // Load balances in parallel
      const balancePromises = [
        blockchainManager.getAllBalances({
          eth: addresses.eth,
          btc: addresses.btc,
        }),
        polygonService.getBalance(addresses.matic),
        algorandService.getBalance(addresses.algo),
      ]

      const [standardBalances, maticBalance, algoBalance] = await Promise.allSettled(balancePromises)

      // Compile all balances
      const allBalances = []
      
      if (standardBalances.status === "fulfilled") {
        allBalances.push(...standardBalances.value)
      }
      
      if (maticBalance.status === "fulfilled") {
        allBalances.push(maticBalance.value)
      }
      
      if (algoBalance.status === "fulfilled") {
        allBalances.push(algoBalance.value)
      }

      updateBalances(allBalances)

      // Load transactions
      const transactionPromises = [
        blockchainManager.getAllTransactions({
          eth: addresses.eth,
          btc: addresses.btc,
        }),
        polygonService.getTransactions(addresses.matic),
        algorandService.getTransactions(addresses.algo),
      ]

      const transactionResults = await Promise.allSettled(transactionPromises)
      const allTransactions = []

      transactionResults.forEach((result) => {
        if (result.status === "fulfilled") {
          allTransactions.push(...result.value)
        }
      })

      // Sort transactions by timestamp
      allTransactions.sort((a, b) => b.timestamp - a.timestamp)
      updateTransactions(allTransactions.slice(0, 10))

      // Load prices
      const prices = await priceService.getAllPrices()
      setPriceData(prices)

      setLastUpdate(new Date())
      
      if (isRefresh) {
        toast.success("Données mises à jour")
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error)
      toast.error("Erreur lors du chargement des données")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  // Load data on mount and every 30 seconds
  useEffect(() => {
    loadData()
    const interval = setInterval(() => loadData(true), 30000)
    return () => clearInterval(interval)
  }, [wallet])

  // Calculate total portfolio value
  const totalValue = balances.reduce((sum, balance) => {
    return sum + parseFloat(balance.balanceUSD || "0")
  }, 0)

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const balanceVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  }

  if (!wallet) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Wallet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600">Aucun portefeuille trouvé</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CryptoPayPro
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Portefeuille Multi-Blockchain
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadData(true)}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Mise à jour...' : 'Actualiser'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("settings")}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Portfolio Value Card */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 mb-2">Valeur totale du portefeuille</p>
                  <div className="flex items-center gap-4">
                    <AnimatePresence mode="wait">
                      {showBalance ? (
                        <motion.div
                          key="balance-visible"
                          variants={balanceVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="text-4xl font-bold"
                        >
                          ${totalValue.toFixed(2)}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="balance-hidden"
                          variants={balanceVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="text-4xl font-bold"
                        >
                          ••••••
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleBalanceVisibility}
                      className="text-white hover:text-white hover:bg-white/20"
                    >
                      {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                  
                  {lastUpdate && (
                    <p className="text-blue-200 text-sm mt-2">
                      Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <TrendingUp className="h-8 w-8 text-green-300 mb-2" />
                  <p className="text-green-300 font-semibold">+2.4%</p>
                  <p className="text-blue-200 text-sm">24h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: Send, label: "Envoyer", action: () => onNavigate("send"), color: "bg-red-500" },
            { icon: Download, label: "Recevoir", action: () => onNavigate("receive"), color: "bg-green-500" },
            { icon: History, label: "Historique", action: () => onNavigate("history"), color: "bg-blue-500" },
            { icon: QrCode, label: "QR Code", action: () => onNavigate("receive"), color: "bg-purple-500" },
          ].map((action, index) => (
            <motion.div
              key={action.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-200"
                onClick={action.action}
              >
                <CardContent className="p-6 text-center">
                  <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="font-semibold text-sm">{action.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Crypto Balances */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {balances.map((balance, index) => (
            <motion.div
              key={balance.symbol}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      {balance.symbol}
                    </CardTitle>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${priceData[balance.symbol]?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-2xl font-bold">
                        {showBalance ? balance.balance : "••••••"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {showBalance ? `$${balance.balanceUSD}` : "••••••"}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(balance.address)}
                        className="flex-1 gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("send")}
                      >
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Transactions */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transactions récentes</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("history")}
                >
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((tx, index) => (
                    <motion.div
                      key={tx.hash}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.from.toLowerCase() === wallet.accounts.find(acc => acc.address.toLowerCase() === tx.from.toLowerCase())?.address.toLowerCase()
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}>
                          {tx.from.toLowerCase() === wallet.accounts.find(acc => acc.address.toLowerCase() === tx.from.toLowerCase())?.address.toLowerCase()
                            ? <Send className="h-4 w-4" />
                            : <Download className="h-4 w-4" />
                          }
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {tx.from.toLowerCase() === wallet.accounts.find(acc => acc.address.toLowerCase() === tx.from.toLowerCase())?.address.toLowerCase()
                              ? "Envoyé"
                              : "Reçu"
                            }
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(tx.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {showBalance ? `${tx.value} ETH` : "••••••"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {showBalance ? `$${tx.valueUSD}` : "••••••"}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Aucune transaction récente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}