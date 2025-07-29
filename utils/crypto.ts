import CryptoJS from 'crypto-js'

// Encryption key derivation from user PIN
function deriveKeyFromPin(pin: string, salt: string = 'crypto-wallet-salt'): string {
  return CryptoJS.PBKDF2(pin, salt, {
    keySize: 256 / 32,
    iterations: 1000
  }).toString()
}

// Encrypt sensitive data
export function encryptData(data: string, pin: string): string {
  try {
    const key = deriveKeyFromPin(pin)
    const encrypted = CryptoJS.AES.encrypt(data, key).toString()
    return encrypted
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt data')
  }
}

// Decrypt sensitive data
export function decryptData(encryptedData: string, pin: string): string {
  try {
    const key = deriveKeyFromPin(pin)
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key)
    const originalText = decrypted.toString(CryptoJS.enc.Utf8)
    
    if (!originalText) {
      throw new Error('Invalid decryption key')
    }
    
    return originalText
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt data')
  }
}

// Hash PIN for secure storage
export function hashPin(pin: string): string {
  return CryptoJS.SHA256(pin + 'wallet-pin-salt').toString()
}

// Verify PIN against hash
export function verifyPin(pin: string, hash: string): boolean {
  return hashPin(pin) === hash
}

// Generate secure random string
export function generateSecureRandom(length: number = 32): string {
  return CryptoJS.lib.WordArray.random(length).toString()
}

// Encrypt private key with additional security
export function encryptPrivateKey(privateKey: string, pin: string): string {
  try {
    // Add extra entropy
    const salt = generateSecureRandom(16)
    const key = CryptoJS.PBKDF2(pin, salt, {
      keySize: 256 / 32,
      iterations: 10000 // Higher iterations for private keys
    }).toString()
    
    const encrypted = CryptoJS.AES.encrypt(privateKey, key).toString()
    
    // Return salt + encrypted data
    return salt + ':' + encrypted
  } catch (error) {
    console.error('Private key encryption error:', error)
    throw new Error('Failed to encrypt private key')
  }
}

// Decrypt private key
export function decryptPrivateKey(encryptedData: string, pin: string): string {
  try {
    const [salt, encrypted] = encryptedData.split(':')
    
    if (!salt || !encrypted) {
      throw new Error('Invalid encrypted private key format')
    }
    
    const key = CryptoJS.PBKDF2(pin, salt, {
      keySize: 256 / 32,
      iterations: 10000
    }).toString()
    
    const decrypted = CryptoJS.AES.decrypt(encrypted, key)
    const privateKey = decrypted.toString(CryptoJS.enc.Utf8)
    
    if (!privateKey) {
      throw new Error('Invalid decryption key')
    }
    
    return privateKey
  } catch (error) {
    console.error('Private key decryption error:', error)
    throw new Error('Failed to decrypt private key')
  }
}

// Secure storage helper for browser environment
export class SecureStorage {
  private static isClient = typeof window !== 'undefined'
  
  static setItem(key: string, value: string, pin?: string): void {
    if (!this.isClient) return
    
    try {
      const dataToStore = pin ? encryptData(value, pin) : value
      localStorage.setItem(key, dataToStore)
    } catch (error) {
      console.error('Secure storage set error:', error)
    }
  }
  
  static getItem(key: string, pin?: string): string | null {
    if (!this.isClient) return null
    
    try {
      const storedData = localStorage.getItem(key)
      if (!storedData) return null
      
      return pin ? decryptData(storedData, pin) : storedData
    } catch (error) {
      console.error('Secure storage get error:', error)
      return null
    }
  }
  
  static removeItem(key: string): void {
    if (!this.isClient) return
    
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Secure storage remove error:', error)
    }
  }
  
  static clear(): void {
    if (!this.isClient) return
    
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Secure storage clear error:', error)
    }
  }
}

// Validate data integrity
export function validateDataIntegrity(data: string, hash: string): boolean {
  const calculatedHash = CryptoJS.SHA256(data).toString()
  return calculatedHash === hash
}

// Create data hash for integrity checking
export function createDataHash(data: string): string {
  return CryptoJS.SHA256(data).toString()
}