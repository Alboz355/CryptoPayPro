"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Download, Plus, TrendingUp, TrendingDown } from "lucide-react"
import { ReceiveModal } from "./receive-modal"

interface CryptoAsset {
  symbol: string
  name: string
  balance: string
  balanceUSD: string
  change24h: number
  logo: string
  address: string
  network: string
}

interface CryptoListProps {
  walletData: any
  onSend: (crypto: string) => void
}

export function CryptoList({ walletData, onSend }: CryptoListProps) {
  const [showAll, setShowAll] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoAsset | null>(null)
  const [showReceiveModal, setShowReceiveModal] = useState(false)

  // Liste complète des cryptos supportées avec adresses correctes
  const allCryptos: CryptoAsset[] = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      balance: "0.00000000",
      balanceUSD: "0.00",
      change24h: 2.5,
      logo: "₿",
      address: walletData?.addresses?.bitcoin || "",
      network: "Bitcoin",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      balance: "0.000000",
      balanceUSD: "0.00",
      change24h: 1.8,
      logo: "Ξ",
      address: walletData?.addresses?.ethereum || "",
      network: "Ethereum",
    },
    {
      symbol: "USDT",
      name: "Tether",
      balance: "0.00",
      balanceUSD: "0.00",
      change24h: 0.01,
      logo: "₮",
      address: walletData?.addresses?.ethereum || "",
      network: "Ethereum",
    },
    {
      symbol: "ALGO",
      name: "Algorand",
      balance: "0.000000",
      balanceUSD: "0.00",
      change24h: -1.2,
      logo: "◈",
      address: walletData?.addresses?.algorand || "",
      network: "Algorand",
    },
    {
      symbol: "MATIC",
      name: "Polygon",
      balance: "0.000000",
      balanceUSD: "0.00",
      change24h: 3.4,
      logo: "⬟",
      address: walletData?.addresses?.ethereum || "", // Même adresse que ETH
      network: "Polygon",
    },
    {
      symbol: "ADA",
      name: "Cardano",
      balance: "0.000000",
      balanceUSD: "0.00",
      change24h: -0.8,
      logo: "₳",
      address:
        "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt6yr7f398jnfrmr0x4e9a6vdgnrljs53xqv8", // Adresse Cardano exemple
      network: "Cardano",
    },
    {
      symbol: "SOL",
      name: "Solana",
      balance: "0.000000",
      balanceUSD: "0.00",
      change24h: 4.2,
      logo: "◎",
      address: "DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKK", // Adresse Solana exemple
      network: "Solana",
    },
    {
      symbol: "DOT",
      name: "Polkadot",
      balance: "0.000000",
      balanceUSD: "0.00",
      change24h: 1.9,
      logo: "●",
      address: "15oF4uVJwmo4TdGW7VfQxNLavjCXviqxT9S1MgbjMNHr6Sp5", // Adresse Polkadot exemple
      network: "Polkadot",
    },
    {
      symbol: "AVAX",
      name: "Avalanche",
      balance: "0.000000",
      balanceUSD: "0.00",
      change24h: 2.1,
      logo: "▲",
      address: "X-avax1x459sj0ssxzlf9q5n6c5qjjy8k8c8v5v6v5v6v", // Adresse Avalanche exemple
      network: "Avalanche",
    },
  ]

  // Afficher les 4 premiers par défaut, tous si showAll est true
  const displayedCryptos = showAll ? allCryptos : allCryptos.slice(0, 4)

  const handleReceive = (crypto: CryptoAsset) => {
    setSelectedCrypto(crypto)
    setShowReceiveModal(true)
  }

  const handleSend = (crypto: CryptoAsset) => {
    onSend(crypto.symbol)
  }

  // Fonction pour formater l'adresse selon le type
  const formatAddress = (address: string, symbol: string) => {
    if (!address) return "Adresse non disponible"

    switch (symbol) {
      case "BTC":
        return address.length > 20 ? `${address.slice(0, 8)}...${address.slice(-8)}` : address
      case "ETH":
      case "USDT":
      case "MATIC":
        return address.length > 20 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address
      case "ALGO":
        return address.length > 20 ? `${address.slice(0, 8)}...${address.slice(-8)}` : address
      default:
        return address.length > 20 ? `${address.slice(0, 8)}...${address.slice(-8)}` : address
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Mes cryptomonnaies</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:text-blue-700"
            >
              {showAll ? "Voir moins" : "Voir plus"}
              {!showAll && <Plus className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {displayedCryptos.map((crypto) => (
            <div
              key={crypto.symbol}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
            >
              {/* Logo et infos */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {crypto.logo}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{crypto.name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {crypto.network}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-600">
                      {crypto.balance} {crypto.symbol}
                    </p>
                    <div className="flex items-center space-x-1">
                      {crypto.change24h >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs ${crypto.change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {crypto.change24h.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  {/* Afficher l'adresse formatée */}
                  <p className="text-xs text-gray-500 font-mono">{formatAddress(crypto.address, crypto.symbol)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <div className="text-right mr-3">
                  <p className="font-medium">${crypto.balanceUSD}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReceive(crypto)}
                  className="flex items-center space-x-1"
                >
                  <Download className="h-3 w-3" />
                  <span className="hidden sm:inline">Recevoir</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSend(crypto)}
                  className="flex items-center space-x-1"
                >
                  <Send className="h-3 w-3" />
                  <span className="hidden sm:inline">Envoyer</span>
                </Button>
              </div>
            </div>
          ))}

          {!showAll && allCryptos.length > 4 && (
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">+{allCryptos.length - 4} autres cryptomonnaies disponibles</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de réception */}
      {showReceiveModal && selectedCrypto && (
        <ReceiveModal
          crypto={selectedCrypto}
          onClose={() => {
            setShowReceiveModal(false)
            setSelectedCrypto(null)
          }}
        />
      )}
    </>
  )
}
