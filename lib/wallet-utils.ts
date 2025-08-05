import { generateMnemonic, mnemonicToSeedSync } from "bip39"

// Simple hash function for address generation
function simpleHash(data: string): Uint8Array {
  const encoder = new TextEncoder()
  const dataBytes = encoder.encode(data)
  const hash = new Uint8Array(32)

  for (let i = 0; i < dataBytes.length; i++) {
    hash[i % 32] ^= dataBytes[i]
  }

  return hash
}

// Generate Bitcoin address from seed
function generateBitcoinAddress(seed: Buffer): string {
  const hash = simpleHash(seed.toString("hex"))
  const address = Array.from(hash.slice(0, 20))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return `1${address.substring(0, 26)}`
}

// Generate Ethereum address from seed
function generateEthereumAddress(seed: Buffer): string {
  const hash = simpleHash(seed.toString("hex"))
  const address = Array.from(hash.slice(0, 20))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return `0x${address}`
}

// Generate Algorand address from seed
function generateAlgorandAddress(seed: Buffer): string {
  const hash = simpleHash(seed.toString("hex"))
  const address = Array.from(hash.slice(0, 32))
    .map((b) => String.fromCharCode(65 + (b % 26)))
    .join("")
  return address
}

export function generateWallet() {
  try {
    const mnemonic = generateMnemonic()
    const seed = mnemonicToSeedSync(mnemonic)

    const wallet = {
      mnemonic,
      addresses: {
        bitcoin: generateBitcoinAddress(seed),
        ethereum: generateEthereumAddress(seed),
        algorand: generateAlgorandAddress(seed),
      },
      balances: {
        bitcoin: 0,
        ethereum: 0,
        algorand: 0,
      },
    }

    return wallet
  } catch (error) {
    console.error("Error generating wallet:", error)
    throw error
  }
}

export function createWallet() {
  return generateWallet()
}

export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatCrypto(amount: number, symbol: string): string {
  return `${amount.toFixed(8)} ${symbol}`
}

export function validateAddress(address: string, type: "bitcoin" | "ethereum" | "algorand"): boolean {
  switch (type) {
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
