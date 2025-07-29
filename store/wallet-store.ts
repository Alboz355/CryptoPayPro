import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CryptoAccount, WalletData, MultiCryptoWallet } from '@/lib/wallet-utils'
import { BlockchainBalance, BlockchainTransaction } from '@/lib/blockchain-apis'

export interface WalletState {
  // Wallet data
  wallet: WalletData | null
  isWalletCreated: boolean
  pin: string
  isAuthenticated: boolean
  
  // Blockchain data
  balances: BlockchainBalance[]
  transactions: BlockchainTransaction[]
  isLoading: boolean
  lastUpdate: Date | null
  
  // UI state
  currentPage: string
  showBalance: boolean
  theme: 'light' | 'dark' | 'system'
  
  // Actions
  createWallet: (mnemonic?: string) => Promise<WalletData>
  importWallet: (mnemonic: string) => Promise<WalletData>
  setPin: (pin: string) => void
  authenticate: (pin: string) => boolean
  logout: () => void
  
  // Blockchain actions
  updateBalances: (balances: BlockchainBalance[]) => void
  updateTransactions: (transactions: BlockchainTransaction[]) => void
  setLoading: (loading: boolean) => void
  
  // UI actions
  setCurrentPage: (page: string) => void
  toggleBalanceVisibility: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // Account management
  addAccount: (symbol: string) => CryptoAccount | null
  getAccountsBySymbol: (symbol: string) => CryptoAccount[]
  getPrimaryAddress: (symbol: string) => string
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      // Initial state
      wallet: null,
      isWalletCreated: false,
      pin: '',
      isAuthenticated: false,
      
      balances: [],
      transactions: [],
      isLoading: false,
      lastUpdate: null,
      
      currentPage: 'onboarding',
      showBalance: true,
      theme: 'system',
      
      // Wallet actions
      createWallet: async (providedMnemonic?: string) => {
        try {
          const walletData = providedMnemonic 
            ? MultiCryptoWallet.recoverWallet(providedMnemonic)
            : MultiCryptoWallet.generateWallet()
          
          set({ 
            wallet: walletData,
            isWalletCreated: true,
            currentPage: 'pin-setup'
          })
          
          return walletData
        } catch (error) {
          console.error('Error creating wallet:', error)
          throw error
        }
      },
      
      importWallet: async (mnemonic: string) => {
        try {
          const walletData = MultiCryptoWallet.recoverWallet(mnemonic)
          
          set({ 
            wallet: walletData,
            isWalletCreated: true,
            currentPage: 'pin-setup'
          })
          
          return walletData
        } catch (error) {
          console.error('Error importing wallet:', error)
          throw error
        }
      },
      
      setPin: (pin: string) => {
        set({ pin })
      },
      
      authenticate: (inputPin: string) => {
        const { pin } = get()
        const isValid = pin === inputPin
        
        if (isValid) {
          set({ 
            isAuthenticated: true,
            currentPage: 'dashboard'
          })
        }
        
        return isValid
      },
      
      logout: () => {
        set({ 
          isAuthenticated: false,
          currentPage: 'onboarding'
        })
      },
      
      // Blockchain actions
      updateBalances: (balances: BlockchainBalance[]) => {
        set({ 
          balances,
          lastUpdate: new Date()
        })
      },
      
      updateTransactions: (transactions: BlockchainTransaction[]) => {
        set({ transactions })
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },
      
      // UI actions
      setCurrentPage: (page: string) => {
        set({ currentPage: page })
      },
      
      toggleBalanceVisibility: () => {
        set((state) => ({ showBalance: !state.showBalance }))
      },
      
      setTheme: (theme: 'light' | 'dark' | 'system') => {
        set({ theme })
      },
      
      // Account management
      addAccount: (symbol: string) => {
        const { wallet } = get()
        if (!wallet) return null
        
        try {
          const newAccount = MultiCryptoWallet.addAccount(wallet, symbol)
          set({ wallet: { ...wallet } }) // Trigger re-render
          return newAccount
        } catch (error) {
          console.error('Error adding account:', error)
          return null
        }
      },
      
      getAccountsBySymbol: (symbol: string) => {
        const { wallet } = get()
        if (!wallet) return []
        
        return MultiCryptoWallet.getAccountsBySymbol(wallet, symbol)
      },
      
      getPrimaryAddress: (symbol: string) => {
        const { wallet } = get()
        if (!wallet) return ''
        
        return MultiCryptoWallet.getPrimaryAddress(wallet, symbol)
      }
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        // Only persist non-sensitive data
        isWalletCreated: state.isWalletCreated,
        pin: state.pin, // In production, this should be hashed
        currentPage: state.currentPage,
        showBalance: state.showBalance,
        theme: state.theme,
        // Note: wallet data with private keys should be encrypted before persisting
        // For now, we'll exclude it from persistence for security
      })
    }
  )
)