export interface ErrorInfo {
  code: string
  message: string
  details?: any
  timestamp: number
}

export class CryptoWalletError extends Error {
  public code: string
  public details?: any
  public timestamp: number

  constructor(code: string, message: string, details?: any) {
    super(message)
    this.name = "CryptoWalletError"
    this.code = code
    this.details = details
    this.timestamp = Date.now()
  }
}

export const ErrorCodes = {
  // Wallet errors
  WALLET_GENERATION_FAILED: "WALLET_GENERATION_FAILED",
  WALLET_RESTORATION_FAILED: "WALLET_RESTORATION_FAILED",
  INVALID_SEED_PHRASE: "INVALID_SEED_PHRASE",
  INVALID_PIN: "INVALID_PIN",

  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  API_ERROR: "API_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",

  // Transaction errors
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",
  INVALID_ADDRESS: "INVALID_ADDRESS",
  TRANSACTION_FAILED: "TRANSACTION_FAILED",

  // Storage errors
  STORAGE_ERROR: "STORAGE_ERROR",
  ENCRYPTION_ERROR: "ENCRYPTION_ERROR",

  // General errors
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
} as const

export function handleError(error: unknown): ErrorInfo {
  console.error("Error occurred:", error)

  if (error instanceof CryptoWalletError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp,
    }
  }

  if (error instanceof Error) {
    return {
      code: ErrorCodes.UNKNOWN_ERROR,
      message: error.message,
      timestamp: Date.now(),
    }
  }

  return {
    code: ErrorCodes.UNKNOWN_ERROR,
    message: "An unknown error occurred",
    timestamp: Date.now(),
  }
}

export function createError(code: string, message: string, details?: any): CryptoWalletError {
  return new CryptoWalletError(code, message, details)
}

export function logError(error: ErrorInfo): void {
  console.error(`[${error.code}] ${error.message}`, error.details)
}

export function isNetworkError(error: ErrorInfo): boolean {
  return [ErrorCodes.NETWORK_ERROR, ErrorCodes.API_ERROR, ErrorCodes.TIMEOUT_ERROR].includes(error.code as any)
}

export function getErrorMessage(error: ErrorInfo, userFriendly = true): string {
  if (!userFriendly) {
    return error.message
  }

  // Return user-friendly messages
  switch (error.code) {
    case ErrorCodes.WALLET_GENERATION_FAILED:
      return "Failed to generate wallet. Please try again."
    case ErrorCodes.WALLET_RESTORATION_FAILED:
      return "Failed to restore wallet. Please check your seed phrase."
    case ErrorCodes.INVALID_SEED_PHRASE:
      return "Invalid seed phrase. Please check and try again."
    case ErrorCodes.INVALID_PIN:
      return "Invalid PIN. Please try again."
    case ErrorCodes.NETWORK_ERROR:
      return "Network connection error. Please check your internet connection."
    case ErrorCodes.API_ERROR:
      return "Service temporarily unavailable. Please try again later."
    case ErrorCodes.INSUFFICIENT_BALANCE:
      return "Insufficient balance for this transaction."
    case ErrorCodes.INVALID_ADDRESS:
      return "Invalid wallet address. Please check and try again."
    case ErrorCodes.TRANSACTION_FAILED:
      return "Transaction failed. Please try again."
    default:
      return "An error occurred. Please try again."
  }
}
