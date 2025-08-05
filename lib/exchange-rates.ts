import { ErrorCodes, createError } from "./error-handler"

export interface ExchangeRate {
  from: string
  to: string
  rate: number
  timestamp: number
}

export interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap?: number
  volume24h?: number
  lastUpdated: number
}

class ExchangeRateService {
  private cache = new Map<string, { data: any; timestamp: number }>()
  private readonly CACHE_DURATION = 60000 // 1 minute

  private isValidCache(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.CACHE_DURATION
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  private getCache(key: string): any {
    const cached = this.cache.get(key)
    return cached ? cached.data : null
  }

  async getCryptoPrice(symbol: string): Promise<CryptoPrice> {
    const cacheKey = `price_${symbol.toLowerCase()}`

    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey)
    }

    try {
      // Using CoinGecko API as fallback
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${this.getCoinGeckoId(symbol)}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`,
      )

      if (!response.ok) {
        throw createError(ErrorCodes.API_ERROR, "Failed to fetch crypto price")
      }

      const data = await response.json()
      const coinId = this.getCoinGeckoId(symbol)
      const coinData = data[coinId]

      if (!coinData) {
        throw createError(ErrorCodes.API_ERROR, `Price data not found for ${symbol}`)
      }

      const price: CryptoPrice = {
        symbol: symbol.toUpperCase(),
        name: this.getCoinName(symbol),
        price: coinData.usd,
        change24h: coinData.usd_24h_change || 0,
        marketCap: coinData.usd_market_cap,
        volume24h: coinData.usd_24h_vol,
        lastUpdated: Date.now(),
      }

      this.setCache(cacheKey, price)
      return price
    } catch (error) {
      // Fallback to mock data if API fails
      console.warn(`Failed to fetch real price for ${symbol}, using mock data`)
      return this.getMockPrice(symbol)
    }
  }

  async getExchangeRate(from: string, to: string): Promise<ExchangeRate> {
    const cacheKey = `rate_${from}_${to}`

    if (this.isValidCache(cacheKey)) {
      return this.getCache(cacheKey)
    }

    try {
      if (this.isCrypto(from) && this.isFiat(to)) {
        const cryptoPrice = await this.getCryptoPrice(from)
        const rate: ExchangeRate = {
          from,
          to,
          rate: cryptoPrice.price,
          timestamp: Date.now(),
        }
        this.setCache(cacheKey, rate)
        return rate
      }

      if (this.isFiat(from) && this.isFiat(to)) {
        const rate = await this.getFiatExchangeRate(from, to)
        this.setCache(cacheKey, rate)
        return rate
      }

      throw createError(ErrorCodes.API_ERROR, `Unsupported exchange rate: ${from} to ${to}`)
    } catch (error) {
      // Fallback to mock rates
      return this.getMockExchangeRate(from, to)
    }
  }

  private async getFiatExchangeRate(from: string, to: string): Promise<ExchangeRate> {
    if (from === to) {
      return { from, to, rate: 1, timestamp: Date.now() }
    }

    // Using exchangerate-api.com as example
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)

    if (!response.ok) {
      throw createError(ErrorCodes.API_ERROR, "Failed to fetch fiat exchange rate")
    }

    const data = await response.json()
    const rate = data.rates[to]

    if (!rate) {
      throw createError(ErrorCodes.API_ERROR, `Exchange rate not found for ${from} to ${to}`)
    }

    return {
      from,
      to,
      rate,
      timestamp: Date.now(),
    }
  }

  private getCoinGeckoId(symbol: string): string {
    const mapping: Record<string, string> = {
      BTC: "bitcoin",
      ETH: "ethereum",
      ALGO: "algorand",
    }
    return mapping[symbol.toUpperCase()] || symbol.toLowerCase()
  }

  private getCoinName(symbol: string): string {
    const mapping: Record<string, string> = {
      BTC: "Bitcoin",
      ETH: "Ethereum",
      ALGO: "Algorand",
    }
    return mapping[symbol.toUpperCase()] || symbol
  }

  private isCrypto(currency: string): boolean {
    return ["BTC", "ETH", "ALGO"].includes(currency.toUpperCase())
  }

  private isFiat(currency: string): boolean {
    return ["USD", "EUR", "CHF", "GBP", "JPY"].includes(currency.toUpperCase())
  }

  private getMockPrice(symbol: string): CryptoPrice {
    const mockPrices: Record<string, CryptoPrice> = {
      BTC: {
        symbol: "BTC",
        name: "Bitcoin",
        price: 45000,
        change24h: 2.5,
        marketCap: 850000000000,
        volume24h: 25000000000,
        lastUpdated: Date.now(),
      },
      ETH: {
        symbol: "ETH",
        name: "Ethereum",
        price: 3200,
        change24h: -1.2,
        marketCap: 380000000000,
        volume24h: 15000000000,
        lastUpdated: Date.now(),
      },
      ALGO: {
        symbol: "ALGO",
        name: "Algorand",
        price: 0.25,
        change24h: 5.8,
        marketCap: 2000000000,
        volume24h: 150000000,
        lastUpdated: Date.now(),
      },
    }

    return (
      mockPrices[symbol.toUpperCase()] || {
        symbol: symbol.toUpperCase(),
        name: symbol,
        price: 1,
        change24h: 0,
        lastUpdated: Date.now(),
      }
    )
  }

  private getMockExchangeRate(from: string, to: string): ExchangeRate {
    const mockRates: Record<string, number> = {
      USD_CHF: 0.92,
      EUR_CHF: 1.05,
      CHF_USD: 1.09,
      CHF_EUR: 0.95,
    }

    const key = `${from}_${to}`
    const rate = mockRates[key] || 1

    return {
      from,
      to,
      rate,
      timestamp: Date.now(),
    }
  }

  async convertAmount(amount: number, from: string, to: string): Promise<number> {
    if (from === to) return amount

    const exchangeRate = await this.getExchangeRate(from, to)
    return amount * exchangeRate.rate
  }

  async getMultiplePrices(symbols: string[]): Promise<CryptoPrice[]> {
    const promises = symbols.map((symbol) => this.getCryptoPrice(symbol))
    return Promise.all(promises)
  }
}

export const exchangeRateService = new ExchangeRateService()

export async function getCryptoPrice(symbol: string): Promise<CryptoPrice> {
  return exchangeRateService.getCryptoPrice(symbol)
}

export async function getExchangeRate(from: string, to: string): Promise<ExchangeRate> {
  return exchangeRateService.getExchangeRate(from, to)
}

export async function convertCurrency(amount: number, from: string, to: string): Promise<number> {
  return exchangeRateService.convertAmount(amount, from, to)
}

export async function getMultipleCryptoPrices(symbols: string[]): Promise<CryptoPrice[]> {
  return exchangeRateService.getMultiplePrices(symbols)
}
