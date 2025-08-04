// Service pour récupérer les prix des cryptomonnaies en temps réel

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  image: string
}

class CryptoPriceService {
  private static instance: CryptoPriceService
  private cache: Map<string, { data: CryptoPrice[]; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 60000 // 1 minute

  static getInstance(): CryptoPriceService {
    if (!CryptoPriceService.instance) {
      CryptoPriceService.instance = new CryptoPriceService()
    }
    return CryptoPriceService.instance
  }

  async getCryptoPrices(): Promise<CryptoPrice[]> {
    const cacheKey = "crypto-prices"
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&ids=bitcoin,ethereum,algorand&order=market_cap_desc&per_page=10&page=1&sparkline=false",
      )

      if (!response.ok) {
        throw new Error("Failed to fetch crypto prices")
      }

      const data: CryptoPrice[] = await response.json()

      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      return data
    } catch (error) {
      console.error("Error fetching crypto prices:", error)

      // Données de fallback
      const fallbackData: CryptoPrice[] = [
        {
          id: "bitcoin",
          symbol: "btc",
          name: "Bitcoin",
          current_price: 65000,
          market_cap: 1280000000000,
          market_cap_rank: 1,
          price_change_percentage_24h: 2.5,
          image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
        },
        {
          id: "ethereum",
          symbol: "eth",
          name: "Ethereum",
          current_price: 3200,
          market_cap: 385000000000,
          market_cap_rank: 2,
          price_change_percentage_24h: -1.2,
          image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
        },
        {
          id: "algorand",
          symbol: "algo",
          name: "Algorand",
          current_price: 0.25,
          market_cap: 2000000000,
          market_cap_rank: 45,
          price_change_percentage_24h: 5.8,
          image: "https://assets.coingecko.com/coins/images/4380/large/download.png",
        },
      ]

      this.cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() })
      return fallbackData
    }
  }

  async getCryptoPrice(cryptoId: string): Promise<CryptoPrice | null> {
    const prices = await this.getCryptoPrices()
    return prices.find((price) => price.id === cryptoId) || null
  }

  formatMarketCap(marketCap: number): string {
    if (marketCap >= 1e12) {
      return `${(marketCap / 1e12).toFixed(2)}T €`
    } else if (marketCap >= 1e9) {
      return `${(marketCap / 1e9).toFixed(2)}B €`
    } else if (marketCap >= 1e6) {
      return `${(marketCap / 1e6).toFixed(2)}M €`
    } else {
      return `${marketCap.toLocaleString()} €`
    }
  }
}

export const cryptoPriceService = CryptoPriceService.getInstance()
