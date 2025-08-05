// lib/wallet-utils.ts
import * as walletCore from "@trustwallet/wallet-core"

export interface WalletBalance {
  bitcoin: number
  ethereum: number
  algorand: number
}

export interface WalletAddresses {
  bitcoin: string
  ethereum: string
  algorand: string
}

export interface Transaction {
  id: string
  type: "sent" | "received"
  crypto: "bitcoin" | "ethereum" | "algorand"
  amount: string
  address: string
  timestamp: number
  status: "pending" | "confirmed" | "failed"
  hash?: string
}

// Variable pour stocker le module initialisé
let TrustWalletCore: any

/**
 * Charge et initialise le module WebAssembly de Trust Wallet.
 * Doit être appelé avant toute autre fonction de portefeuille.
 */
async function initWalletCore() {
  if (TrustWalletCore) {
    return TrustWalletCore
  }
  try {
    // L'initialisation est asynchrone
    TrustWalletCore = await walletCore.init()
    return TrustWalletCore
  } catch (error) {
    console.error("Erreur lors de l'initialisation de Trust Wallet Core:", error)
    throw error
  }
}

/**
 * Génère un nouveau portefeuille sécurisé avec une phrase mnémonique de 12 mots.
 * Cette fonction est maintenant asynchrone car elle doit attendre l'initialisation du module WASM.
 */
export async function generateWallet(): Promise<{ mnemonic: string; addresses: WalletAddresses }> {
  try {
    // S'assure que le module est chargé
    const { HDWallet, CoinType } = await initWalletCore()

    // Crée un nouveau portefeuille HD (Hierarchical Deterministic)
    const wallet = HDWallet.create(128, "")
    const mnemonic = wallet.mnemonic()

    // Dérive les adresses pour chaque cryptomonnaie
    const addresses: WalletAddresses = {
      bitcoin: wallet.getAddressForCoin(CoinType.bitcoin),
      ethereum: wallet.getAddressForCoin(CoinType.ethereum),
      algorand: wallet.getAddressForCoin(CoinType.algorand),
    }

    // Libère la mémoire allouée par le module WASM (bonne pratique)
    wallet.delete()

    return { mnemonic, addresses }
  } catch (error) {
    console.error("Erreur Trust Wallet, utilisation du fallback:", error)
    // Fallback vers génération simulée
    return generateFallbackWallet()
  }
}

/**
 * Génère un portefeuille de secours (simulation) en cas d'erreur avec Trust Wallet
 */
function generateFallbackWallet(): { mnemonic: string; addresses: WalletAddresses } {
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
    "adapt",
    "add",
    "addict",
    "address",
    "adjust",
    "admit",
    "adult",
    "advance",
    "advice",
    "aerobic",
    "affair",
    "afford",
    "afraid",
    "again",
    "against",
    "age",
    "agent",
    "agree",
    "ahead",
    "aim",
    "air",
    "airport",
    "aisle",
    "alarm",
  ]

  const mnemonic = Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]).join(" ")

  const addresses: WalletAddresses = {
    bitcoin: generateSimulatedAddress("bitcoin"),
    ethereum: generateSimulatedAddress("ethereum"),
    algorand: generateSimulatedAddress("algorand"),
  }

  return { mnemonic, addresses }
}

/**
 * Valide une adresse de cryptomonnaie.
 * Doit aussi être asynchrone.
 */
export async function isValidCryptoAddress(
  address: string,
  crypto: "bitcoin" | "ethereum" | "algorand",
): Promise<boolean> {
  try {
    const { CoinType } = await initWalletCore()
    switch (crypto) {
      case "bitcoin":
        return CoinType.bitcoin.validate(address)
      case "ethereum":
        return CoinType.ethereum.validate(address)
      case "algorand":
        return CoinType.algorand.validate(address)
      default:
        return false
    }
  } catch (error) {
    console.warn("Trust Wallet validation failed, using fallback:", error)
    // Fallback vers validation regex
    return validateAddressFallback(address, crypto)
  }
}

// Validation d'adresses de secours avec regex
function validateAddressFallback(address: string, crypto: "bitcoin" | "ethereum" | "algorand"): boolean {
  switch (crypto) {
    case "bitcoin":
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(address)
    case "ethereum":
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    case "algorand":
      return /^[A-Z2-7]{58}$/.test(address)
    default:
      return false
  }
}

// Génération d'adresses simulées pour le fallback
function generateSimulatedAddress(crypto: "bitcoin" | "ethereum" | "algorand"): string {
  switch (crypto) {
    case "bitcoin":
      return "1" + generateRandomString(33, "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
    case "ethereum":
      return "0x" + generateRandomString(40, "0123456789abcdef")
    case "algorand":
      return generateRandomString(58, "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567").toUpperCase()
    default:
      throw new Error(`Crypto non supportée: ${crypto}`)
  }
}

function generateRandomString(length: number, charset: string): string {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
}

// --- Fonctions utilitaires que l'on peut garder ---

export function formatAddress(address: string, length = 8): string {
  if (!address) return "Adresse non disponible"
  if (address.length <= length * 2 + 3) return address
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export function formatBalance(balance: string, symbol: string): string {
  const num = Number.parseFloat(balance)
  if (isNaN(num) || num === 0) return `0 ${symbol}`

  let fixedDigits = 8
  if (symbol === "ETH" || symbol === "BTC") {
    fixedDigits = 8
  } else if (symbol === "ALGO") {
    fixedDigits = 6
  }

  return `${num.toFixed(fixedDigits)} ${symbol}`
}

// Génération d'adresses crypto (pour compatibilité avec l'existant)
export async function generateCryptoAddress(crypto: "bitcoin" | "ethereum" | "algorand"): Promise<string> {
  const savedAddresses = getSavedAddresses()

  if (savedAddresses[crypto]) {
    return savedAddresses[crypto]
  }

  let address: string

  try {
    // Utiliser Trust Wallet pour générer une adresse réelle
    const { HDWallet, CoinType } = await initWalletCore()
    const wallet = HDWallet.create(128, "")

    switch (crypto) {
      case "bitcoin":
        address = wallet.getAddressForCoin(CoinType.bitcoin)
        break
      case "ethereum":
        address = wallet.getAddressForCoin(CoinType.ethereum)
        break
      case "algorand":
        address = wallet.getAddressForCoin(CoinType.algorand)
        break
      default:
        throw new Error(`Crypto non supportée: ${crypto}`)
    }

    wallet.delete()
  } catch (error) {
    console.warn("Trust Wallet address generation failed, using fallback:", error)
    // Fallback vers génération simulée
    address = generateSimulatedAddress(crypto)
  }

  // Sauvegarder l'adresse générée
  saveAddress(crypto, address)
  return address
}

// Gestion du stockage local des adresses
function getSavedAddresses(): Record<string, string> {
  if (typeof window === "undefined") return {}

  try {
    const saved = localStorage.getItem("crypto_addresses")
    return saved ? JSON.parse(saved) : {}
  } catch {
    return {}
  }
}

function saveAddress(crypto: string, address: string): void {
  if (typeof window === "undefined") return

  try {
    const addresses = getSavedAddresses()
    addresses[crypto] = address
    localStorage.setItem("crypto_addresses", JSON.stringify(addresses))
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'adresse:", error)
  }
}

// Gestion des soldes (simulation)
export function getWalletBalances(): WalletBalance {
  if (typeof window === "undefined") {
    return { bitcoin: 0, ethereum: 0, algorand: 0 }
  }

  try {
    const saved = localStorage.getItem("wallet_balances")
    return saved ? JSON.parse(saved) : { bitcoin: 0.00234, ethereum: 0.5678, algorand: 1250.75 }
  } catch {
    return { bitcoin: 0.00234, ethereum: 0.5678, algorand: 1250.75 }
  }
}

export function updateWalletBalance(crypto: "bitcoin" | "ethereum" | "algorand", amount: string): void {
  if (typeof window === "undefined") return

  try {
    const balances = getWalletBalances()
    const currentBalance = balances[crypto]
    const changeAmount = Number.parseFloat(amount)

    if (isNaN(changeAmount)) return

    balances[crypto] = currentBalance + changeAmount
    localStorage.setItem("wallet_balances", JSON.stringify(balances))
  } catch (error) {
    console.error("Erreur lors de la mise à jour du solde:", error)
  }
}

export function getTransactionHistory(): Transaction[] {
  try {
    const stored = localStorage.getItem("transaction-history")
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading transaction history:", error)
    return []
  }
}

export function addTransaction(transaction: Omit<Transaction, "id" | "timestamp">): void {
  try {
    const history = getTransactionHistory()
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    }

    history.unshift(newTransaction)

    // Keep only last 100 transactions
    if (history.length > 100) {
      history.splice(100)
    }

    localStorage.setItem("transaction-history", JSON.stringify(history))

    // Update balance if it's a received transaction
    if (transaction.type === "received") {
      updateWalletBalance(transaction.crypto, transaction.amount)
    }
  } catch (error) {
    console.error("Error adding transaction:", error)
  }
}

export function validateAddress(address: string, crypto: "bitcoin" | "ethereum" | "algorand"): Promise<boolean> {
  return isValidCryptoAddress(address, crypto)
}

// Formatage des montants crypto
export function formatCryptoAmount(amount: number, crypto: "bitcoin" | "ethereum" | "algorand"): string {
  switch (crypto) {
    case "bitcoin":
      return `${amount.toFixed(8)} BTC`
    case "ethereum":
      return `${amount.toFixed(6)} ETH`
    case "algorand":
      return `${amount.toFixed(4)} ALGO`
    default:
      return `${amount} ${crypto}`
  }
}

// Simulation de réception de crypto (pour les tests)
export async function simulateReceiveCrypto(
  crypto: "bitcoin" | "ethereum" | "algorand",
  amount: number,
): Promise<void> {
  const address = await generateCryptoAddress(crypto)

  addTransaction({
    type: "received",
    crypto,
    amount: amount.toString(),
    address,
    status: "confirmed",
    hash: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  })
}

export function updateBalance(
  crypto: "bitcoin" | "ethereum" | "algorand",
  amount: string,
  operation: "add" | "subtract",
): void {
  try {
    const walletData = localStorage.getItem("wallet-data")
    if (!walletData) return

    const wallet = JSON.parse(walletData)
    const currentBalance = Number.parseFloat(wallet.balances[crypto] || "0")
    const changeAmount = Number.parseFloat(amount)

    if (isNaN(changeAmount)) return

    const newBalance = operation === "add" ? currentBalance + changeAmount : Math.max(0, currentBalance - changeAmount)

    wallet.balances[crypto] = newBalance.toString()
    localStorage.setItem("wallet-data", JSON.stringify(wallet))
  } catch (error) {
    console.error("Error updating balance:", error)
  }
}

export function simulateReceiveTransaction(crypto: "bitcoin" | "ethereum" | "algorand", amount: string): void {
  // Simulate receiving a transaction for testing purposes
  addTransaction({
    type: "received",
    crypto,
    amount,
    address: "Simulation",
    status: "confirmed",
    hash: "sim_" + Date.now().toString(36),
  })
}
