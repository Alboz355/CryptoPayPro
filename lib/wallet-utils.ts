// Fichier : lib/wallet-utils.ts
import TrustWalletCore from "@trustwallet/wallet-core"

let walletCoreInstance: any

async function initWalletCore() {
  if (walletCoreInstance) return walletCoreInstance
  walletCoreInstance = await TrustWalletCore.ready
  return walletCoreInstance
}

export interface WalletAddresses {
  bitcoin: string
  ethereum: string
  algorand: string
}

export async function generateWallet(): Promise<{ mnemonic: string; addresses: WalletAddresses }> {
  const { HDWallet, CoinType } = await initWalletCore()
  const wallet = HDWallet.create(128, "")
  const mnemonic = wallet.mnemonic()
  const addresses: WalletAddresses = {
    bitcoin: wallet.getAddressForCoin(CoinType.bitcoin),
    ethereum: wallet.getAddressForCoin(CoinType.ethereum),
    algorand: wallet.getAddressForCoin(CoinType.algorand),
  }
  wallet.delete()
  return { mnemonic, addresses }
}

export async function isValidCryptoAddress(
  address: string,
  crypto: "bitcoin" | "ethereum" | "algorand",
): Promise<boolean> {
  const { CoinType } = await initWalletCore()
  try {
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
    console.error("Erreur de validation d'adresse:", error)
    return false
  }
}

export function formatAddress(address: string, length = 8): string {
  if (!address) return "Adresse non disponible"
  if (address.length <= length * 2 + 3) return address
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export function formatBalance(balance: string, symbol: string): string {
  const num = Number.parseFloat(balance)
  if (isNaN(num)) return `0.00 ${symbol}`
  let fixedDigits = 6
  if (symbol === "BTC" || symbol === "ETH") {
    fixedDigits = 8
  }
  return `${num.toFixed(fixedDigits)} ${symbol}`
}
