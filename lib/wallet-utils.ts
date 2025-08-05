// lib/wallet-utils.ts

// Importation PAR DÉFAUT de la bibliothèque
import TrustWalletCore from "@trustwallet/wallet-core";

// Cette variable gardera en mémoire le module WASM initialisé pour éviter de le recharger
let walletCoreInstance: any;

/**
 * Charge et initialise le module WebAssembly de Trust Wallet en attendant que
 * sa promesse 'ready' soit résolue.
 */
async function initWalletCore() {
  if (walletCoreInstance) {
    return walletCoreInstance;
  }
  // La méthode correcte et finale : attendre la promesse 'ready' de l'objet importé par défaut
  walletCoreInstance = await TrustWalletCore.ready;
  return walletCoreInstance;
}

// Interface pour les adresses du portefeuille
export interface WalletAddresses {
  bitcoin: string;
  ethereum: string;
  algorand: string;
}

/**
 * Génère un nouveau portefeuille sécurisé avec une phrase mnémonique de 12 mots
 * et dérive les adresses pour Bitcoin, Ethereum, et Algorand.
 */
export async function generateWallet(): Promise<{ mnemonic: string; addresses: WalletAddresses }> {
  // 1. Attendre que le module soit prêt
  const { HDWallet, CoinType } = await initWalletCore();

  // 2. Créer le portefeuille
  const wallet = HDWallet.create(128, "");
  const mnemonic = wallet.mnemonic();

  // 3. Dériver les adresses
  const addresses: WalletAddresses = {
    bitcoin: wallet.getAddressForCoin(CoinType.bitcoin),
    ethereum: wallet.getAddressForCoin(CoinType.ethereum),
    algorand: wallet.getAddressForCoin(CoinType.algorand),
  };
  
  // 4. Libérer la mémoire allouée par le module WASM (bonne pratique)
  wallet.delete();

  return { mnemonic, addresses };
}

/**
 * Valide une adresse de cryptomonnaie en utilisant la logique de Trust Wallet.
 */
export async function isValidCryptoAddress(
  address: string,
  crypto: "bitcoin" | "ethereum" | "algorand",
): Promise<boolean> {
  const { CoinType } = await initWalletCore();
  try {
    switch (crypto) {
      case "bitcoin":
        return CoinType.bitcoin.validate(address);
      case "ethereum":
        return CoinType.ethereum.validate(address);
      case "algorand":
        return CoinType.algorand.validate(address);
      default:
        return false;
    }
  } catch (error) {
    console.error("Erreur de validation d'adresse:", error);
    return false;
  }
}

// --- Fonctions utilitaires conservées pour l'affichage ---

/**
 * Formate une adresse pour un affichage court.
 */
export function formatAddress(address: string, length = 8): string {
  if (!address) return "Adresse non disponible";
  if (address.length <= length * 2 + 3) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

/**
 * Formate un solde numérique pour l'affichage avec le bon nombre de décimales.
 */
export function formatBalance(balance: string, symbol: string): string {
  const num = parseFloat(balance);
  if (isNaN(num)) return `0.00 ${symbol}`;

  let fixedDigits = 6;
  if (symbol === 'BTC' || symbol === 'ETH') {
      fixedDigits = 8;
  }
  return `${num.toFixed(fixedDigits)} ${symbol}`;
}
