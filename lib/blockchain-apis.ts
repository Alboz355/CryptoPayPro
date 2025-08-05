// Services pour interagir avec les APIs blockchain - VERSION SÉCURISÉE

import { cryptoService } from "./crypto-prices"

export interface BlockchainBalance {
  symbol: string
  balance: string
  balanceUSD: string
  address: string
}

export interface BlockchainTransaction {
  hash: string
  from: string
  to: string
  value: string
  valueUSD: string
  timestamp: number
  confirmations: number
  status: "confirmed" | "pending" | "failed"
  fee: string
  blockNumber?: number
}

export interface NetworkFees {
  slow: string
  standard: string
  fast: string
}

export interface CryptoBalance {
  bitcoin: string
  ethereum: string
  algorand: string
}

// Service Ethereum sécurisé avec clé d'API depuis les variables d'environnement
export class EthereumService {
  private infuraKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || ""
  private infuraUrl = `https://mainnet.infura.io/v3/${this.infuraKey}`

  async getBalance(address: string): Promise<BlockchainBalance> {
    try {
      console.log(`⚡ Récupération du solde ETH pour: ${address}`)

      if (!this.infuraKey) {
        throw new Error("Clé API Infura manquante")
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const balanceResponse = await fetch(this.infuraUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getBalance",
          params: [address, "latest"],
          id: 1,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!balanceResponse.ok) {
        throw new Error(`HTTP ${balanceResponse.status}`)
      }

      const balanceData = await balanceResponse.json()

      if (balanceData.error) {
        throw new Error(balanceData.error.message)
      }

      // Convertir de Wei en ETH
      const balanceWei = Number.parseInt(balanceData.result, 16)
      const balanceETH = (balanceWei / 1e18).toFixed(6)

      // Obtenir le prix ETH en temps réel
      const prices = await cryptoService.getCryptoPrices()
      const ethPrice = prices.find((p) => p.id === "ethereum")?.current_price || 2650
      const balanceUSD = (Number.parseFloat(balanceETH) * ethPrice).toFixed(2)

      console.log(`✅ Solde ETH récupéré: ${balanceETH} ETH ($${balanceUSD})`)

      return {
        symbol: "ETH",
        balance: balanceETH,
        balanceUSD: balanceUSD,
        address: address,
      }
    } catch (error) {
      console.log(`⚠️ Fallback ETH pour ${address}:`, error.message)
      return {
        symbol: "ETH",
        balance: "0.000000",
        balanceUSD: "0.00",
        address: address,
      }
    }
  }

  async getTransactions(address: string): Promise<BlockchainTransaction[]> {
    try {
      console.log(`⚡ Récupération des transactions ETH...`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      const response = await fetch(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&page=1&offset=5`,
        {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        },
      )

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error("API indisponible")
      }

      const data = await response.json()

      if (data.status !== "1" || !data.result) {
        return []
      }

      // Obtenir le prix ETH en temps réel
      const prices = await cryptoService.getCryptoPrices()
      const ethPrice = prices.find((p) => p.id === "ethereum")?.current_price || 2650

      return data.result.slice(0, 5).map((tx: any) => {
        const valueETH = (Number.parseInt(tx.value) / 1e18).toFixed(6)
        const valueUSD = (Number.parseFloat(valueETH) * ethPrice).toFixed(2)
        const feeETH = ((Number.parseInt(tx.gasUsed || "0") * Number.parseInt(tx.gasPrice || "0")) / 1e18).toFixed(6)

        return {
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: valueETH,
          valueUSD: valueUSD,
          timestamp: Number.parseInt(tx.timeStamp) * 1000,
          confirmations: Number.parseInt(tx.confirmations || "0"),
          status: tx.txreceipt_status === "1" ? "confirmed" : "failed",
          fee: feeETH,
          blockNumber: Number.parseInt(tx.blockNumber || "0"),
        } as BlockchainTransaction
      })
    } catch (error) {
      console.log("⚠️ Pas de transactions ETH disponibles")
      return []
    }
  }

  async getNetworkFees(): Promise<NetworkFees> {
    return {
      slow: "20 gwei",
      standard: "25 gwei",
      fast: "30 gwei",
    }
  }
}

// Service Bitcoin avec prix en temps réel
export class BitcoinService {
  async getBalance(address: string): Promise<BlockchainBalance> {
    try {
      console.log(`⚡ Récupération du solde BTC pour: ${address}`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      const balanceSatoshis = data.balance || 0
      const balanceBTC = (balanceSatoshis / 1e8).toFixed(8)

      // Obtenir le prix BTC en temps réel
      const prices = await cryptoService.getCryptoPrices()
      const btcPrice = prices.find((p) => p.id === "bitcoin")?.current_price || 43000
      const balanceUSD = (Number.parseFloat(balanceBTC) * btcPrice).toFixed(2)

      console.log(`✅ Solde BTC récupéré: ${balanceBTC} BTC ($${balanceUSD})`)

      return {
        symbol: "BTC",
        balance: balanceBTC,
        balanceUSD: balanceUSD,
        address: address,
      }
    } catch (error) {
      console.log(`⚠️ Fallback BTC pour ${address}:`, error.message)
      return {
        symbol: "BTC",
        balance: "0.00000000",
        balanceUSD: "0.00",
        address: address,
      }
    }
  }

  async getTransactions(address: string): Promise<BlockchainTransaction[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?limit=5`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error("API indisponible")
      }

      const data = await response.json()

      if (!data.txs || !Array.isArray(data.txs)) {
        return []
      }

      // Obtenir le prix BTC en temps réel
      const prices = await cryptoService.getCryptoPrices()
      const btcPrice = prices.find((p) => p.id === "bitcoin")?.current_price || 43000

      return data.txs.slice(0, 5).map((tx: any) => {
        let value = 0
        let isIncoming = false

        if (tx.outputs && Array.isArray(tx.outputs)) {
          tx.outputs.forEach((output: any) => {
            if (output.addresses && output.addresses.includes(address)) {
              value += output.value || 0
              isIncoming = true
            }
          })
        }

        if (!isIncoming && tx.inputs && Array.isArray(tx.inputs)) {
          tx.inputs.forEach((input: any) => {
            if (input.addresses && input.addresses.includes(address)) {
              value -= input.output_value || 0
            }
          })
        }

        const valueBTC = Math.abs(value / 1e8).toFixed(8)
        const valueUSD = (Number.parseFloat(valueBTC) * btcPrice).toFixed(2)
        const feeBTC = ((tx.fees || 0) / 1e8).toFixed(8)

        return {
          hash: tx.hash || "unknown",
          from: tx.inputs?.[0]?.addresses?.[0] || "Unknown",
          to: tx.outputs?.[0]?.addresses?.[0] || "Unknown",
          value: valueBTC,
          valueUSD: valueUSD,
          timestamp: tx.received ? new Date(tx.received).getTime() : Date.now(),
          confirmations: tx.confirmations || 0,
          status: (tx.confirmations || 0) > 0 ? "confirmed" : "pending",
          fee: feeBTC,
          blockNumber: tx.block_height || 0,
        } as BlockchainTransaction
      })
    } catch (error) {
      console.log("⚠️ Pas de transactions BTC disponibles")
      return []
    }
  }

  async getNetworkFees(): Promise<NetworkFees> {
    return {
      slow: "10 sat/vB",
      standard: "20 sat/vB",
      fast: "30 sat/vB",
    }
  }
}

// Service ERC-20 avec prix en temps réel
export class ERC20Service {
  private infuraKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || ""
  private infuraUrl = `https://mainnet.infura.io/v3/${this.infuraKey}`
  private usdtContract = "0xdAC17F958D2ee523a2206206994597C13D831ec7"

  async getUSDTBalance(address: string): Promise<BlockchainBalance> {
    try {
      if (!this.infuraKey) {
        throw new Error("Clé API Infura manquante")
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch(this.infuraUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_call",
          params: [
            {
              to: this.usdtContract,
              data: `0x70a08231000000000000000000000000${address.slice(2)}`,
            },
            "latest",
          ],
          id: 1,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error.message)
      }

      const balanceHex = data.result || "0x0"
      const balanceWei = Number.parseInt(balanceHex, 16)
      const balanceUSDT = (balanceWei / 1e6).toFixed(2)

      return {
        symbol: "USDT",
        balance: balanceUSDT,
        balanceUSD: balanceUSDT,
        address: address,
      }
    } catch (error) {
      console.log(`⚠️ Fallback USDT pour ${address}`)
      return {
        symbol: "USDT",
        balance: "0.00",
        balanceUSD: "0.00",
        address: address,
      }
    }
  }

  async getUSDTTransactions(address: string): Promise<BlockchainTransaction[]> {
    return []
  }
}

// Service Algorand avec prix en temps réel
export class AlgorandService {
  async getBalance(address: string): Promise<BlockchainBalance> {
    try {
      console.log(`⚡ Récupération du solde ALGO pour: ${address}`)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      const response = await fetch(`https://api.algoexplorer.io/v2/account/${address}`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      const balanceMicroAlgos = data.amount || 0
      const balanceALGO = (balanceMicroAlgos / 1e6).toFixed(6)

      // Obtenir le prix ALGO en temps réel
      const prices = await cryptoService.getCryptoPrices()
      const algoPrice = prices.find((p) => p.id === "algorand")?.current_price || 1.5
      const balanceUSD = (Number.parseFloat(balanceALGO) * algoPrice).toFixed(2)

      console.log(`✅ Solde ALGO récupéré: ${balanceALGO} ALGO ($${balanceUSD})`)

      return {
        symbol: "ALGO",
        balance: balanceALGO,
        balanceUSD: balanceUSD,
        address: address,
      }
    } catch (error) {
      console.log(`⚠️ Fallback ALGO pour ${address}:`, error.message)
      return {
        symbol: "ALGO",
        balance: "0.000000",
        balanceUSD: "0.00",
        address: address,
      }
    }
  }

  async getTransactions(address: string): Promise<BlockchainTransaction[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000)

      const response = await fetch(`https://api.algoexplorer.io/v2/account/${address}/transactions`, {
        headers: { Accept: "application/json" },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error("API indisponible")
      }

      const data = await response.json()

      if (!data.transactions || !Array.isArray(data.transactions)) {
        return []
      }

      // Obtenir le prix ALGO en temps réel
      const prices = await cryptoService.getCryptoPrices()
      const algoPrice = prices.find((p) => p.id === "algorand")?.current_price || 1.5

      return data.transactions.slice(0, 5).map((tx: any) => {
        const valueALGO = (tx.amount / 1e6).toFixed(6)
        const valueUSD = (Number.parseFloat(valueALGO) * algoPrice).toFixed(2)
        const feeALGO = (tx.fee / 1e6).toFixed(6)

        return {
          hash: tx.id,
          from: tx.sender,
          to: tx.receiver,
          value: valueALGO,
          valueUSD: valueUSD,
          timestamp: tx.round_time * 1000,
          confirmations: tx.confirmed_round || 0,
          status: tx.confirmed_round > 0 ? "confirmed" : "pending",
          fee: feeALGO,
          blockNumber: tx.round || 0,
        } as BlockchainTransaction
      })
    } catch (error) {
      console.log("⚠️ Pas de transactions ALGO disponibles")
      return []
    }
  }

  async getNetworkFees(): Promise<NetworkFees> {
    return {
      slow: "0.001 algo",
      standard: "0.002 algo",
      fast: "0.003 algo",
    }
  }
}

// Service principal avec prix en temps réel
export class BlockchainManager {
  private ethereumService = new EthereumService()
  private bitcoinService = new BitcoinService()
  private erc20Service = new ERC20Service()
  private algorandService = new AlgorandService()

  async getAllBalances(addresses: { bitcoin: string; ethereum: string; algorand: string }): Promise<CryptoBalance> {
    console.log("⚡ === CHARGEMENT DES SOLDES AVEC PRIX TEMPS RÉEL ===")

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout global")), 5000)
      })

      const balancePromises = [
        this.ethereumService.getBalance(addresses.ethereum).catch(() => ({
          symbol: "ETH",
          balance: "0.000000",
          balanceUSD: "0.00",
          address: addresses.ethereum,
        })),
        this.bitcoinService.getBalance(addresses.bitcoin).catch(() => ({
          symbol: "BTC",
          balance: "0.00000000",
          balanceUSD: "0.00",
          address: addresses.bitcoin,
        })),
        this.erc20Service.getUSDTBalance(addresses.ethereum).catch(() => ({
          symbol: "USDT",
          balance: "0.00",
          balanceUSD: "0.00",
          address: addresses.ethereum,
        })),
        this.algorandService.getBalance(addresses.algorand).catch(() => ({
          symbol: "ALGO",
          balance: "0.000000",
          balanceUSD: "0.00",
          address: addresses.algorand,
        })),
      ]

      const results = await Promise.race([Promise.all(balancePromises), timeoutPromise])

      console.log("✅ Soldes chargés avec prix temps réel:", results)
      return {
        bitcoin: results.find((balance) => balance.symbol === "BTC")?.balance || "0.00000000",
        ethereum: results.find((balance) => balance.symbol === "ETH")?.balance || "0.000000000000000000",
        algorand: results.find((balance) => balance.symbol === "ALGO")?.balance || "0.000000",
      }
    } catch (error) {
      console.log("⚠️ Utilisation des soldes par défaut:", error.message)

      return {
        bitcoin: "0.00000000",
        ethereum: "0.000000000000000000",
        algorand: "0.000000",
      }
    }
  }

  async getAllTransactions(addresses: { bitcoin: string; ethereum: string; algorand: string }): Promise<
    BlockchainTransaction[]
  > {
    console.log("⚡ Chargement des transactions...")

    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Timeout transactions")), 3000)
      })

      const transactionPromises = [
        this.ethereumService.getTransactions(addresses.ethereum).catch(() => []),
        this.bitcoinService.getTransactions(addresses.bitcoin).catch(() => []),
        this.algorandService.getTransactions(addresses.algorand).catch(() => []),
      ]

      const results = await Promise.race([Promise.all(transactionPromises), timeoutPromise])
      const allTransactions: BlockchainTransaction[] = []
      results.forEach((txs) => allTransactions.push(...txs))

      allTransactions.sort((a, b) => b.timestamp - a.timestamp)
      return allTransactions.slice(0, 10)
    } catch (error) {
      console.log("⚠️ Pas de transactions disponibles")
      return []
    }
  }

  async getNetworkFees(): Promise<{ eth: NetworkFees; btc: NetworkFees; algo: NetworkFees }> {
    return {
      eth: { slow: "20 gwei", standard: "25 gwei", fast: "30 gwei" },
      btc: { slow: "10 sat/vB", standard: "20 sat/vB", fast: "30 sat/vB" },
      algo: { slow: "0.001 algo", standard: "0.002 algo", fast: "0.003 algo" },
    }
  }
}

export async function fetchBalances(addresses: {
  bitcoin: string
  ethereum: string
  algorand: string
}): Promise<CryptoBalance> {
  const manager = new BlockchainManager()
  return await manager.getAllBalances(addresses)
}

export async function sendTransaction(
  crypto: "bitcoin" | "ethereum" | "algorand",
  senderAddress: string,
  recipientAddress: string,
  amount: string,
  privateKey: string,
): Promise<{ txId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  console.log(`Simulating sending ${amount} ${crypto} from ${senderAddress} to ${recipientAddress}`)

  return { txId: `simulated_tx_${Date.now()}` }
}
