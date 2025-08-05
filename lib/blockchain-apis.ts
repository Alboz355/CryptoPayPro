import { ErrorCodes, createError } from "./error-handler"

export interface BlockchainBalance {
  address: string
  balance: string
  currency: string
  usdValue?: number
}

export interface Transaction {
  hash: string
  from: string
  to: string
  amount: string
  currency: string
  timestamp: number
  status: "pending" | "confirmed" | "failed"
  blockNumber?: number
  gasUsed?: string
  fee?: string
}

export interface BlockchainAPI {
  getBalance(address: string): Promise<BlockchainBalance>
  getTransactions(address: string, limit?: number): Promise<Transaction[]>
  broadcastTransaction(signedTx: string): Promise<string>
  getTransactionStatus(txHash: string): Promise<Transaction>
}

class EthereumAPI implements BlockchainAPI {
  private baseUrl = "https://api.etherscan.io/api"
  private apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY || ""

  async getBalance(address: string): Promise<BlockchainBalance> {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=account&action=balance&address=${address}&tag=latest&apikey=${this.apiKey}`,
      )

      if (!response.ok) {
        throw createError(ErrorCodes.API_ERROR, "Failed to fetch balance")
      }

      const data = await response.json()

      if (data.status !== "1") {
        throw createError(ErrorCodes.API_ERROR, data.message || "API request failed")
      }

      // Convert Wei to ETH
      const balanceInEth = (Number.parseInt(data.result) / 1e18).toString()

      return {
        address,
        balance: balanceInEth,
        currency: "ETH",
      }
    } catch (error) {
      if (error instanceof Error) {
        throw createError(ErrorCodes.NETWORK_ERROR, error.message)
      }
      throw error
    }
  }

  async getTransactions(address: string, limit = 10): Promise<Transaction[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${this.apiKey}`,
      )

      if (!response.ok) {
        throw createError(ErrorCodes.API_ERROR, "Failed to fetch transactions")
      }

      const data = await response.json()

      if (data.status !== "1") {
        return [] // No transactions found
      }

      return data.result.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        amount: (Number.parseInt(tx.value) / 1e18).toString(),
        currency: "ETH",
        timestamp: Number.parseInt(tx.timeStamp) * 1000,
        status: tx.txreceipt_status === "1" ? "confirmed" : "failed",
        blockNumber: Number.parseInt(tx.blockNumber),
        gasUsed: tx.gasUsed,
        fee: ((Number.parseInt(tx.gasUsed) * Number.parseInt(tx.gasPrice)) / 1e18).toString(),
      }))
    } catch (error) {
      if (error instanceof Error) {
        throw createError(ErrorCodes.NETWORK_ERROR, error.message)
      }
      throw error
    }
  }

  async broadcastTransaction(signedTx: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=proxy&action=eth_sendRawTransaction&hex=${signedTx}&apikey=${this.apiKey}`,
        { method: "POST" },
      )

      if (!response.ok) {
        throw createError(ErrorCodes.API_ERROR, "Failed to broadcast transaction")
      }

      const data = await response.json()

      if (data.error) {
        throw createError(ErrorCodes.TRANSACTION_FAILED, data.error.message)
      }

      return data.result
    } catch (error) {
      if (error instanceof Error) {
        throw createError(ErrorCodes.NETWORK_ERROR, error.message)
      }
      throw error
    }
  }

  async getTransactionStatus(txHash: string): Promise<Transaction> {
    try {
      const response = await fetch(
        `${this.baseUrl}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${this.apiKey}`,
      )

      if (!response.ok) {
        throw createError(ErrorCodes.API_ERROR, "Failed to fetch transaction status")
      }

      const data = await response.json()

      if (data.error) {
        throw createError(ErrorCodes.API_ERROR, data.error.message)
      }

      const tx = data.result
      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        amount: (Number.parseInt(tx.value) / 1e18).toString(),
        currency: "ETH",
        timestamp: Date.now(), // Approximate
        status: tx.blockNumber ? "confirmed" : "pending",
        blockNumber: tx.blockNumber ? Number.parseInt(tx.blockNumber) : undefined,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw createError(ErrorCodes.NETWORK_ERROR, error.message)
      }
      throw error
    }
  }
}

// Mock Bitcoin API for demonstration
class BitcoinAPI implements BlockchainAPI {
  async getBalance(address: string): Promise<BlockchainBalance> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      address,
      balance: (Math.random() * 0.1).toFixed(8),
      currency: "BTC",
    }
  }

  async getTransactions(address: string, limit = 10): Promise<Transaction[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
      hash: `btc_tx_${Date.now()}_${i}`,
      from: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      to: address,
      amount: (Math.random() * 0.01).toFixed(8),
      currency: "BTC",
      timestamp: Date.now() - i * 3600000,
      status: "confirmed" as const,
      blockNumber: 800000 + i,
    }))
  }

  async broadcastTransaction(signedTx: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return `btc_tx_${Date.now()}`
  }

  async getTransactionStatus(txHash: string): Promise<Transaction> {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      hash: txHash,
      from: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      to: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
      amount: "0.00123456",
      currency: "BTC",
      timestamp: Date.now(),
      status: "confirmed",
      blockNumber: 800001,
    }
  }
}

// Mock Algorand API for demonstration
class AlgorandAPI implements BlockchainAPI {
  async getBalance(address: string): Promise<BlockchainBalance> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      address,
      balance: (Math.random() * 100).toFixed(6),
      currency: "ALGO",
    }
  }

  async getTransactions(address: string, limit = 10): Promise<Transaction[]> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    return Array.from({ length: Math.min(limit, 3) }, (_, i) => ({
      hash: `algo_tx_${Date.now()}_${i}`,
      from: "ALGORANDADDRESSEXAMPLE123456789012345678901234567890",
      to: address,
      amount: (Math.random() * 10).toFixed(6),
      currency: "ALGO",
      timestamp: Date.now() - i * 1800000,
      status: "confirmed" as const,
      blockNumber: 25000000 + i,
    }))
  }

  async broadcastTransaction(signedTx: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return `algo_tx_${Date.now()}`
  }

  async getTransactionStatus(txHash: string): Promise<Transaction> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      hash: txHash,
      from: "ALGORANDADDRESSEXAMPLE123456789012345678901234567890",
      to: "ALGORANDADDRESSEXAMPLE098765432109876543210987654321",
      amount: "5.123456",
      currency: "ALGO",
      timestamp: Date.now(),
      status: "confirmed",
      blockNumber: 25000001,
    }
  }
}

export const blockchainAPIs = {
  ethereum: new EthereumAPI(),
  bitcoin: new BitcoinAPI(),
  algorand: new AlgorandAPI(),
}

export async function getWalletBalance(
  address: string,
  currency: "bitcoin" | "ethereum" | "algorand",
): Promise<BlockchainBalance> {
  const api = blockchainAPIs[currency]
  return await api.getBalance(address)
}

export async function getWalletTransactions(
  address: string,
  currency: "bitcoin" | "ethereum" | "algorand",
  limit = 10,
): Promise<Transaction[]> {
  const api = blockchainAPIs[currency]
  return await api.getTransactions(address, limit)
}

export async function broadcastTransaction(
  signedTx: string,
  currency: "bitcoin" | "ethereum" | "algorand",
): Promise<string> {
  const api = blockchainAPIs[currency]
  return await api.broadcastTransaction(signedTx)
}

export async function getTransactionStatus(
  txHash: string,
  currency: "bitcoin" | "ethereum" | "algorand",
): Promise<Transaction> {
  const api = blockchainAPIs[currency]
  return await api.getTransactionStatus(txHash)
}
