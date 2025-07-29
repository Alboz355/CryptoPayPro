// Address validation utilities for multi-blockchain support

import { validateMnemonic } from 'bip39'
import { isAddress } from 'ethers'

export interface ValidationResult {
  isValid: boolean
  error?: string
  suggestion?: string
}

// Bitcoin address validation
export function validateBitcoinAddress(address: string): ValidationResult {
  if (!address || typeof address !== 'string') {
    return { isValid: false, error: 'Address is required' }
  }

  const trimmedAddress = address.trim()

  // Legacy P2PKH (starts with '1')
  const legacyPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/
  
  // SegWit Bech32 (starts with 'bc1')
  const bech32Pattern = /^bc1[a-z0-9]{39,59}$/
  
  // Testnet addresses (starts with 'tb1' or '2', 'm', 'n')
  const testnetPattern = /^(tb1[a-z0-9]{39,59}|[2mn][a-km-zA-HJ-NP-Z1-9]{25,34})$/

  if (legacyPattern.test(trimmedAddress) || 
      bech32Pattern.test(trimmedAddress) || 
      testnetPattern.test(trimmedAddress)) {
    return { isValid: true }
  }

  return { 
    isValid: false, 
    error: 'Invalid Bitcoin address format',
    suggestion: 'Bitcoin addresses should start with 1, 3, bc1, or tb1 for testnet'
  }
}

// Ethereum address validation
export function validateEthereumAddress(address: string): ValidationResult {
  if (!address || typeof address !== 'string') {
    return { isValid: false, error: 'Address is required' }
  }

  const trimmedAddress = address.trim()

  try {
    const isValidAddress = isAddress(trimmedAddress)
    
    if (isValidAddress) {
      return { isValid: true }
    } else {
      return { 
        isValid: false, 
        error: 'Invalid Ethereum address format',
        suggestion: 'Ethereum addresses should be 42 characters long and start with 0x'
      }
    }
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Invalid Ethereum address format',
      suggestion: 'Ethereum addresses should be 42 characters long and start with 0x'
    }
  }
}

// Polygon address validation (same as Ethereum)
export function validatePolygonAddress(address: string): ValidationResult {
  return validateEthereumAddress(address)
}

// Algorand address validation
export function validateAlgorandAddress(address: string): ValidationResult {
  if (!address || typeof address !== 'string') {
    return { isValid: false, error: 'Address is required' }
  }

  const trimmedAddress = address.trim()

  // Algorand addresses are 58 characters long and use Base32 encoding
  const algorandPattern = /^[A-Z2-7]{58}$/

  if (algorandPattern.test(trimmedAddress)) {
    // Additional checksum validation could be added here
    return { isValid: true }
  }

  return { 
    isValid: false, 
    error: 'Invalid Algorand address format',
    suggestion: 'Algorand addresses should be 58 characters long and contain only uppercase letters and numbers 2-7'
  }
}

// Generic address validation based on blockchain
export function validateAddress(address: string, blockchain: string): ValidationResult {
  switch (blockchain.toLowerCase()) {
    case 'bitcoin':
    case 'btc':
      return validateBitcoinAddress(address)
    
    case 'ethereum':
    case 'eth':
      return validateEthereumAddress(address)
    
    case 'polygon':
    case 'matic':
      return validatePolygonAddress(address)
    
    case 'algorand':
    case 'algo':
      return validateAlgorandAddress(address)
    
    default:
      return { 
        isValid: false, 
        error: 'Unsupported blockchain',
        suggestion: 'Supported blockchains: Bitcoin, Ethereum, Polygon, Algorand'
      }
  }
}

// Seed phrase validation
export function validateSeedPhrase(phrase: string): ValidationResult {
  if (!phrase || typeof phrase !== 'string') {
    return { isValid: false, error: 'Seed phrase is required' }
  }

  const trimmedPhrase = phrase.trim()
  const words = trimmedPhrase.split(/\s+/)

  // Check word count
  if (words.length !== 12 && words.length !== 24) {
    return { 
      isValid: false, 
      error: 'Invalid seed phrase length',
      suggestion: 'Seed phrase must contain exactly 12 or 24 words'
    }
  }

  // Validate using BIP39
  try {
    const isValid = validateMnemonic(trimmedPhrase)
    
    if (isValid) {
      return { isValid: true }
    } else {
      return { 
        isValid: false, 
        error: 'Invalid seed phrase',
        suggestion: 'Please check that all words are correct and in the right order'
      }
    }
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Invalid seed phrase format',
      suggestion: 'Please enter a valid BIP39 mnemonic phrase'
    }
  }
}

// PIN validation
export function validatePin(pin: string): ValidationResult {
  if (!pin || typeof pin !== 'string') {
    return { isValid: false, error: 'PIN is required' }
  }

  const trimmedPin = pin.trim()

  // Check length (4-8 digits)
  if (trimmedPin.length < 4 || trimmedPin.length > 8) {
    return { 
      isValid: false, 
      error: 'Invalid PIN length',
      suggestion: 'PIN must be between 4 and 8 digits'
    }
  }

  // Check if contains only digits
  if (!/^\d+$/.test(trimmedPin)) {
    return { 
      isValid: false, 
      error: 'Invalid PIN format',
      suggestion: 'PIN must contain only numbers'
    }
  }

  // Check for weak patterns
  const weakPatterns = [
    /^(\d)\1+$/, // All same digits (1111, 2222, etc.)
    /^0123/, // Sequential ascending
    /^1234/, // Sequential ascending
    /^2345/, // Sequential ascending
    /^3456/, // Sequential ascending
    /^4567/, // Sequential ascending
    /^5678/, // Sequential ascending
    /^6789/, // Sequential ascending
    /^9876/, // Sequential descending
    /^8765/, // Sequential descending
    /^7654/, // Sequential descending
    /^6543/, // Sequential descending
    /^5432/, // Sequential descending
    /^4321/, // Sequential descending
    /^3210/, // Sequential descending
  ]

  for (const pattern of weakPatterns) {
    if (pattern.test(trimmedPin)) {
      return { 
        isValid: false, 
        error: 'Weak PIN detected',
        suggestion: 'Please choose a more secure PIN without repeated or sequential digits'
      }
    }
  }

  return { isValid: true }
}

// Amount validation for transactions
export function validateAmount(amount: string, maxAmount?: string): ValidationResult {
  if (!amount || typeof amount !== 'string') {
    return { isValid: false, error: 'Amount is required' }
  }

  const trimmedAmount = amount.trim()

  // Check if it's a valid number
  const numAmount = parseFloat(trimmedAmount)
  
  if (isNaN(numAmount)) {
    return { 
      isValid: false, 
      error: 'Invalid amount format',
      suggestion: 'Please enter a valid number'
    }
  }

  // Check if positive
  if (numAmount <= 0) {
    return { 
      isValid: false, 
      error: 'Amount must be positive',
      suggestion: 'Please enter an amount greater than 0'
    }
  }

  // Check decimal places (max 8 for crypto)
  const decimalPart = trimmedAmount.split('.')[1]
  if (decimalPart && decimalPart.length > 8) {
    return { 
      isValid: false, 
      error: 'Too many decimal places',
      suggestion: 'Maximum 8 decimal places allowed'
    }
  }

  // Check against maximum amount if provided
  if (maxAmount) {
    const maxNum = parseFloat(maxAmount)
    if (!isNaN(maxNum) && numAmount > maxNum) {
      return { 
        isValid: false, 
        error: 'Amount exceeds balance',
        suggestion: `Maximum available: ${maxAmount}`
      }
    }
  }

  return { isValid: true }
}

// Gas fee validation for Ethereum/Polygon
export function validateGasFee(gasPrice: string, gasLimit: string): ValidationResult {
  const gasPriceValidation = validateAmount(gasPrice)
  if (!gasPriceValidation.isValid) {
    return { 
      ...gasPriceValidation, 
      error: `Gas price: ${gasPriceValidation.error}` 
    }
  }

  const gasLimitValidation = validateAmount(gasLimit)
  if (!gasLimitValidation.isValid) {
    return { 
      ...gasLimitValidation, 
      error: `Gas limit: ${gasLimitValidation.error}` 
    }
  }

  const gasPriceNum = parseFloat(gasPrice)
  const gasLimitNum = parseFloat(gasLimit)

  // Check reasonable ranges
  if (gasPriceNum < 0.1 || gasPriceNum > 1000) {
    return { 
      isValid: false, 
      error: 'Gas price out of reasonable range',
      suggestion: 'Gas price should be between 0.1 and 1000 gwei'
    }
  }

  if (gasLimitNum < 21000 || gasLimitNum > 1000000) {
    return { 
      isValid: false, 
      error: 'Gas limit out of reasonable range',
      suggestion: 'Gas limit should be between 21,000 and 1,000,000'
    }
  }

  return { isValid: true }
}

// Comprehensive validation for all inputs
export const validators = {
  address: validateAddress,
  bitcoin: validateBitcoinAddress,
  ethereum: validateEthereumAddress,
  polygon: validatePolygonAddress,
  algorand: validateAlgorandAddress,
  seedPhrase: validateSeedPhrase,
  pin: validatePin,
  amount: validateAmount,
  gasFee: validateGasFee
}