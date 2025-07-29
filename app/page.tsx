"use client"

import { useEffect } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { OnboardingPage } from "@/components/onboarding-page"
import { PinSetupPage } from "@/components/pin-setup-page"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import { EnhancedSendPage } from "@/components/enhanced-send-page"
import { EnhancedReceivePage } from "@/components/enhanced-receive-page"
import { TransactionHistory } from "@/components/transaction-history"
import { SettingsPage } from "@/components/settings-page"
import { ErrorBoundary } from "@/components/error-boundary"
import { useWalletStore } from "@/store/wallet-store"

export default function CryptoWalletApp() {
  const {
    currentPage,
    isWalletCreated,
    isAuthenticated,
    wallet,
    pin,
    setCurrentPage
  } = useWalletStore()

  // Initialize app state
  useEffect(() => {
    if (isWalletCreated && pin && !isAuthenticated) {
      setCurrentPage('pin-setup')
    } else if (isWalletCreated && isAuthenticated && wallet) {
      setCurrentPage('dashboard')
    } else {
      setCurrentPage('onboarding')
    }
  }, [isWalletCreated, isAuthenticated, wallet, pin, setCurrentPage])

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "onboarding":
        return <OnboardingPage />
      case "pin-setup":
        return <PinSetupPage />
      case "dashboard":
        return <EnhancedDashboard onNavigate={setCurrentPage} />
      case "send":
        return <EnhancedSendPage onNavigate={setCurrentPage} />
      case "receive":
        return <EnhancedReceivePage onNavigate={setCurrentPage} />
      case "history":
        return <TransactionHistory onNavigate={setCurrentPage} />
      case "settings":
        return <SettingsPage onNavigate={setCurrentPage} />
      default:
        return <OnboardingPage />
    }
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          {renderCurrentPage()}
        </div>
        <Toaster 
          position="top-right"
          expand={false}
          richColors
        />
      </ErrorBoundary>
    </ThemeProvider>
  )
}
