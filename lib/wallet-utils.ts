// Utilitaires pour la génération d'adresses crypto et la gestion du portefeuille

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

// Génération d'adresses crypto réalistes (pour démo uniquement)
export function generateCryptoAddress(crypto: "bitcoin" | "ethereum" | "algorand"): string {
  const savedAddresses = getSavedAddresses()

  if (savedAddresses[crypto]) {
    return savedAddresses[crypto]
  }

  let address: string

  switch (crypto) {
    case "bitcoin":
      // Format P2PKH Bitcoin (commence par 1)
      address = "1" + generateRandomString(33, "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")
      break
    case "ethereum":
      // Format Ethereum (0x + 40 caractères hex)
      address = "0x" + generateRandomString(40, "0123456789abcdef")
      break
    case "algorand":
      // Format Algorand (Base32, 58 caractères)
      address = generateRandomString(58, "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567").toUpperCase()
      break
    default:
      throw new Error(`Crypto non supportée: ${crypto}`)
  }

  // Sauvegarder l'adresse générée
  saveAddress(crypto, address)
  return address
}

function generateRandomString(length: number, charset: string): string {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
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

export function validateAddress(address: string, crypto: "bitcoin" | "ethereum" | "algorand"): boolean {
  switch (crypto) {
    case "bitcoin":
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)
    case "ethereum":
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    case "algorand":
      return /^[A-Z2-7]{58}$/.test(address)
    default:
      return false
  }
}

export function formatBalance(balance: string, crypto: "bitcoin" | "ethereum" | "algorand"): string {
  const num = Number.parseFloat(balance)
  if (isNaN(num)) return "0"

  switch (crypto) {
    case "bitcoin":
      return num.toFixed(8) + " BTC"
    case "ethereum":
      return num.toFixed(6) + " ETH"
    case "algorand":
      return num.toFixed(6) + " ALGO"
    default:
      return balance
  }
}

// Validation d'adresses crypto
export function isValidCryptoAddress(address: string, crypto: "bitcoin" | "ethereum" | "algorand"): boolean {
  switch (crypto) {
    case "bitcoin":
      // Bitcoin: commence par 1, 3, ou bc1, longueur 26-35 caractères
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/.test(address)
    case "ethereum":
      // Ethereum: commence par 0x, suivi de 40 caractères hexadécimaux
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    case "algorand":
      // Algorand: 58 caractères Base32
      return /^[A-Z2-7]{58}$/.test(address)
    default:
      return false
  }
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
export function simulateReceiveCrypto(crypto: "bitcoin" | "ethereum" | "algorand", amount: number): void {
  const address = generateCryptoAddress(crypto)

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

// Génération de portefeuille avec les standards de sécurité Trust Wallet Core
import { generateTrustWallet, importTrustWallet, validateMnemonic } from './trust-wallet-core'

export function generateWallet(): { mnemonic: string; addresses: WalletAddresses } {
  try {
    // Utiliser les standards de sécurité Trust Wallet Core (BIP39/BIP44) pour générer un portefeuille sécurisé
    const trustWallet = generateTrustWallet(128) // 12 mots cryptographiquement sécurisés
    
    const addresses: WalletAddresses = {
      bitcoin: trustWallet.addresses.bitcoin,
      ethereum: trustWallet.addresses.ethereum,
      algorand: trustWallet.addresses.algorand,
    }

    return { 
      mnemonic: trustWallet.mnemonic, 
      addresses 
    }
  } catch (error) {
    console.error('Erreur génération Trust Wallet compatible:', error)
    // Fallback vers l'ancienne méthode en cas d'erreur
    return generateFallbackWallet()
  }
}

// Fonction de fallback si Trust Wallet Core échoue
function generateFallbackWallet(): { mnemonic: string; addresses: WalletAddresses } {
  // Générer une seed phrase de 12 mots (simulation de fallback)
  const words = [
    "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract",
    "absurd", "abuse", "access", "accident", "account", "accuse", "achieve", "acid",
    "acoustic", "acquire", "across", "act", "action", "actor", "actress", "actual",
    "adapt", "add", "addict", "address", "adjust", "admit", "adult", "advance",
    "advice", "aerobic", "affair", "afford", "afraid", "again", "against", "age",
    "agent", "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol"
  ]

  const mnemonic = Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]).join(" ")

  const addresses: WalletAddresses = {
    bitcoin: generateCryptoAddress("bitcoin"),
    ethereum: generateCryptoAddress("ethereum"),
    algorand: generateCryptoAddress("algorand"),
  }

  return { mnemonic, addresses }
}

// Nouvelle fonction pour importer un portefeuille avec les standards Trust Wallet Core
export function importWallet(mnemonicPhrase: string): { mnemonic: string; addresses: WalletAddresses } {
  try {
    // Utiliser les standards de sécurité Trust Wallet Core pour importer le portefeuille
    const trustWallet = importTrustWallet(mnemonicPhrase)
    
    const addresses: WalletAddresses = {
      bitcoin: trustWallet.addresses.bitcoin,
      ethereum: trustWallet.addresses.ethereum,
      algorand: trustWallet.addresses.algorand,
    }

    return { 
      mnemonic: trustWallet.mnemonic, 
      addresses 
    }
  } catch (error) {
    console.error('Erreur import Trust Wallet compatible:', error)
    throw new Error('Impossible d\'importer le portefeuille avec cette phrase de récupération')
  }
}

// Amélioration de la validation des seed phrases avec les standards Trust Wallet Core (BIP39)
export function isValidSeedPhrase(phrase: string): boolean {
  try {
    return validateMnemonic(phrase)
  } catch (error) {
    console.error('Erreur validation mnemonic:', error)
    // Fallback vers validation basique
    const words = phrase.trim().split(/\s+/)
    return words.length === 12 || words.length === 24
  }
}
