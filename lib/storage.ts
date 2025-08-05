import { ErrorCodes, createError } from "./error-handler"

export interface StorageData {
  [key: string]: any
}

export interface WalletStorage {
  addresses: {
    bitcoin: string
    ethereum: string
    algorand: string
  }
  balances: {
    bitcoin: string
    ethereum: string
    algorand: string
  }
  transactions: Array<{
    id: string
    hash: string
    from: string
    to: string
    amount: string
    currency: string
    timestamp: number
    status: string
  }>
  settings: {
    currency: string
    language: string
    notifications: boolean
    biometric: boolean
  }
  clients: Array<{
    id: string
    name: string
    email: string
    phone: string
    address: string
    createdAt: number
  }>
  version: string
}

class SecureStorage {
  private readonly STORAGE_KEY = "cryptopay_wallet"
  private readonly VERSION = "1.0.0"

  private encrypt(data: string): string {
    // Simple encryption for demo - in production use proper encryption
    return btoa(data)
  }

  private decrypt(encryptedData: string): string {
    try {
      return atob(encryptedData)
    } catch (error) {
      throw createError(ErrorCodes.ENCRYPTION_ERROR, "Failed to decrypt data")
    }
  }

  async save(key: string, data: any): Promise<void> {
    try {
      const serialized = JSON.stringify(data)
      const encrypted = this.encrypt(serialized)

      if (typeof window !== "undefined") {
        localStorage.setItem(`${this.STORAGE_KEY}_${key}`, encrypted)
      }
    } catch (error) {
      throw createError(ErrorCodes.STORAGE_ERROR, "Failed to save data")
    }
  }

  async load<T>(key: string): Promise<T | null> {
    try {
      if (typeof window === "undefined") {
        return null
      }

      const encrypted = localStorage.getItem(`${this.STORAGE_KEY}_${key}`)
      if (!encrypted) {
        return null
      }

      const decrypted = this.decrypt(encrypted)
      return JSON.parse(decrypted) as T
    } catch (error) {
      throw createError(ErrorCodes.STORAGE_ERROR, "Failed to load data")
    }
  }

  async remove(key: string): Promise<void> {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem(`${this.STORAGE_KEY}_${key}`)
      }
    } catch (error) {
      throw createError(ErrorCodes.STORAGE_ERROR, "Failed to remove data")
    }
  }

  async clear(): Promise<void> {
    try {
      if (typeof window !== "undefined") {
        const keys = Object.keys(localStorage).filter((key) => key.startsWith(this.STORAGE_KEY))
        keys.forEach((key) => localStorage.removeItem(key))
      }
    } catch (error) {
      throw createError(ErrorCodes.STORAGE_ERROR, "Failed to clear storage")
    }
  }

  async exists(key: string): Promise<boolean> {
    if (typeof window === "undefined") {
      return false
    }
    return localStorage.getItem(`${this.STORAGE_KEY}_${key}`) !== null
  }
}

class WalletStorageManager {
  private storage = new SecureStorage()

  async saveWalletData(data: Partial<WalletStorage>): Promise<void> {
    const existing = await this.loadWalletData()
    const updated = { ...existing, ...data, version: this.storage["VERSION"] }
    await this.storage.save("wallet", updated)
  }

  async loadWalletData(): Promise<WalletStorage> {
    const data = await this.storage.load<WalletStorage>("wallet")

    if (!data) {
      return this.getDefaultWalletData()
    }

    // Handle version migration if needed
    if (data.version !== this.storage["VERSION"]) {
      return this.migrateWalletData(data)
    }

    return data
  }

  private getDefaultWalletData(): WalletStorage {
    return {
      addresses: {
        bitcoin: "",
        ethereum: "",
        algorand: "",
      },
      balances: {
        bitcoin: "0",
        ethereum: "0",
        algorand: "0",
      },
      transactions: [],
      settings: {
        currency: "CHF",
        language: "fr",
        notifications: true,
        biometric: false,
      },
      clients: [],
      version: this.storage["VERSION"],
    }
  }

  private migrateWalletData(oldData: any): WalletStorage {
    // Handle data migration between versions
    const defaultData = this.getDefaultWalletData()

    return {
      ...defaultData,
      ...oldData,
      version: this.storage["VERSION"],
    }
  }

  async saveTransaction(transaction: any): Promise<void> {
    const walletData = await this.loadWalletData()
    walletData.transactions.unshift(transaction)

    // Keep only last 100 transactions
    if (walletData.transactions.length > 100) {
      walletData.transactions = walletData.transactions.slice(0, 100)
    }

    await this.saveWalletData(walletData)
  }

  async getTransactions(limit = 50): Promise<any[]> {
    const walletData = await this.loadWalletData()
    return walletData.transactions.slice(0, limit)
  }

  async saveClient(client: any): Promise<void> {
    const walletData = await this.loadWalletData()
    const existingIndex = walletData.clients.findIndex((c) => c.id === client.id)

    if (existingIndex >= 0) {
      walletData.clients[existingIndex] = client
    } else {
      walletData.clients.push(client)
    }

    await this.saveWalletData(walletData)
  }

  async getClients(): Promise<any[]> {
    const walletData = await this.loadWalletData()
    return walletData.clients
  }

  async removeClient(clientId: string): Promise<void> {
    const walletData = await this.loadWalletData()
    walletData.clients = walletData.clients.filter((c) => c.id !== clientId)
    await this.saveWalletData(walletData)
  }

  async updateSettings(settings: Partial<WalletStorage["settings"]>): Promise<void> {
    const walletData = await this.loadWalletData()
    walletData.settings = { ...walletData.settings, ...settings }
    await this.saveWalletData(walletData)
  }

  async getSettings(): Promise<WalletStorage["settings"]> {
    const walletData = await this.loadWalletData()
    return walletData.settings
  }

  async updateBalances(balances: Partial<WalletStorage["balances"]>): Promise<void> {
    const walletData = await this.loadWalletData()
    walletData.balances = { ...walletData.balances, ...balances }
    await this.saveWalletData(walletData)
  }

  async clearAllData(): Promise<void> {
    await this.storage.clear()
  }

  async exportData(): Promise<string> {
    const walletData = await this.loadWalletData()
    return JSON.stringify(walletData, null, 2)
  }

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData) as WalletStorage
      await this.saveWalletData(data)
    } catch (error) {
      throw createError(ErrorCodes.VALIDATION_ERROR, "Invalid import data format")
    }
  }
}

export const secureStorage = new SecureStorage()
export const walletStorage = new WalletStorageManager()

// Convenience functions
export async function saveData(key: string, data: any): Promise<void> {
  return secureStorage.save(key, data)
}

export async function loadData<T>(key: string): Promise<T | null> {
  return secureStorage.load<T>(key)
}

export async function removeData(key: string): Promise<void> {
  return secureStorage.remove(key)
}

export async function clearAllStorage(): Promise<void> {
  return secureStorage.clear()
}
