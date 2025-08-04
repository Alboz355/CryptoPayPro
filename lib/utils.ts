import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = "chf"): string {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatAddress(address: string, length = 8): string {
  if (!address) return "Adresse non disponible"
  if (address.length <= length * 2 + 3) return address
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export function formatBalance(balance: string, symbol: string): string {
  const num = Number.parseFloat(balance)
  if (isNaN(num) || num === 0) return `0 ${symbol}`

  let fixedDigits = 8
  if (symbol === "ETH") {
    fixedDigits = 8
  } else if (symbol === "ALGO") {
    fixedDigits = 6
  }

  return `${num.toFixed(fixedDigits)} ${symbol}`
}
