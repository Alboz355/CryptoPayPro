import { Buffer } from "buffer"

// Polyfill for browser environment
if (typeof window !== "undefined") {
  window.Buffer = Buffer
}

export interface WalletAddresses {
  bitcoin: string
  ethereum: string
  algorand: string
}

export interface WalletData {
  mnemonic: string
  addresses: WalletAddresses
  balances: {
    bitcoin: string
    ethereum: string
    algorand: string
  }
  accounts: Array<{
    id: string
    name: string
    address: string
    balance: string
    currency: string
  }>
}

// Simple wallet core simulation for development
class WalletCoreSimulator {
  private initialized = false

  async initialize(): Promise<void> {
    if (this.initialized) return

    // Simulate initialization delay
    await new Promise((resolve) => setTimeout(resolve, 100))
    this.initialized = true
  }

  generateMnemonic(): string {
    // Generate a simple 12-word mnemonic for demo
    const words = [
      "abandon",
      "ability",
      "able",
      "about",
      "above",
      "absent",
      "absorb",
      "abstract",
      "absurd",
      "abuse",
      "access",
      "accident",
      "account",
      "accuse",
      "achieve",
      "acid",
      "acoustic",
      "acquire",
      "across",
      "act",
      "action",
      "actor",
      "actress",
      "actual",
    ]

    const mnemonic = []
    for (let i = 0; i < 12; i++) {
      mnemonic.push(words[Math.floor(Math.random() * words.length)])
    }
    return mnemonic.join(" ")
  }

  validateMnemonic(mnemonic: string): boolean {
    const words = mnemonic.trim().split(/\s+/)
    return words.length >= 12 && words.length <= 24
  }

  generateAddresses(mnemonic: string): WalletAddresses {
    // Generate deterministic addresses based on mnemonic
    const hash = this.simpleHash(mnemonic)

    return {
      bitcoin: `bc1q${hash.substring(0, 39)}`,
      ethereum: `0x${hash.substring(0, 40)}`,
      algorand: `${hash.substring(0, 58).toUpperCase()}`,
    }
  }

  private simpleHash(input: string): string {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).padStart(16, "0").repeat(4)
  }
}

const walletCore = new WalletCoreSimulator()

export async function initWalletCore(): Promise<void> {
  try {
    await walletCore.initialize()
  } catch (error) {
    console.error("Failed to initialize wallet core:", error)
    throw new Error("Wallet initialization failed")
  }
}

export async function generateWallet(): Promise<{ mnemonic: string; addresses: WalletAddresses }> {
  await initWalletCore()

  const mnemonic = walletCore.generateMnemonic()
  const addresses = walletCore.generateAddresses(mnemonic)

  return { mnemonic, addresses }
}

export async function restoreWallet(mnemonic: string): Promise<WalletAddresses> {
  await initWalletCore()

  if (!walletCore.validateMnemonic(mnemonic)) {
    throw new Error("Invalid mnemonic phrase")
  }

  return walletCore.generateAddresses(mnemonic)
}

export function validateSeedPhrase(phrase: string): boolean {
  const words = phrase.trim().split(/\s+/)

  // Basic validation
  if (words.length < 12 || words.length > 24) {
    return false
  }

  // Check if all words are valid (simplified check)
  const validWords = words.every((word) => word.length >= 3 && /^[a-z]+$/.test(word))

  return validWords
}

export async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin + "cryptopay_salt")

  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  } else {
    // Fallback for environments without crypto.subtle
    let hash = 0
    const str = pin + "cryptopay_salt"
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16)
  }
}

export async function verifyPin(pin: string, hashedPin: string): Promise<boolean> {
  const newHash = await hashPin(pin)
  return newHash === hashedPin
}

export function formatBalance(balance: string, decimals = 8): string {
  const num = Number.parseFloat(balance)
  if (isNaN(num)) return "0.00000000"

  return num.toFixed(decimals)
}

export function formatCurrency(amount: number, currency = "CHF"): string {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2)
  return `tx_${timestamp}_${random}`
}

export function formatAddress(address: string, length = 8): string {
  if (!address) return "Address not available"
  if (address.length <= length * 2 + 3) return address
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export function validateAddress(address: string, network: string): boolean {
  switch (network.toLowerCase()) {
    case "bitcoin":
      return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/.test(address)
    case "ethereum":
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    case "algorand":
      return /^[A-Z2-7]{58}$/.test(address)
    default:
      return false
  }
}
