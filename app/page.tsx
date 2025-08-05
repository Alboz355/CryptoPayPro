"use client"

import { useState, useEffect } from "react"
import { OnboardingPage } from "@/components/onboarding-page"
import { PinSetupPage } from "@/components/pin-setup-page"
import { MainDashboard } from "@/components/main-dashboard"
import { SendPage } from "@/components/send-page"
import { ReceivePage } from "@/components/receive-page"
import { SettingsPage } from "@/components/settings-page"
import { TransactionHistory } from "@/components/transaction-history"
import { TPEDashboard } from "@/components/tpe-dashboard"
import { TPEMainPage } from "@/components/tpe-main-page"
import { TPEPaymentPage } from "@/components/tpe-payment-page"
import { TPEBillingPage } from "@/components/tpe-billing-page"
import { TPEConversionPage } from "@/components/tpe-conversion-page"
import { TPESearchPage } from "@/components/tpe-search-page"
import { TPEHistoryPage } from "@/components/tpe-history-page"
import { TPESettingsPage } from "@/components/tpe-settings-page"
import { TPEStatisticsPage } from "@/components/tpe-statistics-page"
import { TPEVatManagement } from "@/components/tpe-vat-management"
import { UserTypeSelection } from "@/components/user-type-selection"
import { AppPresentation } from "@/components/app-presentation"
import { LanguageProvider } from "@/contexts/language-context"
import { CurrencyProvider } from "@/contexts/currency-context"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { walletStorage } from "@/lib/storage"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingFallback } from "@/components/loading-fallback"

export type AppPage =
  | "presentation"
  | "user-type-selection"
  | "onboarding"
  | "pin-setup"
  | "dashboard"
  | "send"
  | "receive"
  | "history"
  | "settings"
  | "tpe-dashboard"
  | "tpe-main"
  | "tpe-payment"
  | "tpe-billing"
  | "tpe-conversion"
  | "tpe-search"
  | "tpe-history"
  | "tpe-settings"
  | "tpe-statistics"
  | "tpe-vat"

export type UserType = "individual" | "business" | null

export default function Home() {
  const [currentPage, setCurrentPage] = useState<AppPage>("presentation")
  const [userType, setUserType] = useState<UserType>(null)
  const [walletData, setWalletData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      const savedWalletData = await walletStorage.loadWalletData()

      if (savedWalletData && savedWalletData.isSetup) {
        setWalletData(savedWalletData)

        // Determine user type based on saved data
        if (savedWalletData.userType) {
          setUserType(savedWalletData.userType)
          setCurrentPage(savedWalletData.userType === "business" ? "tpe-dashboard" : "dashboard")
        } else {
          setCurrentPage("user-type-selection")
        }
      } else {
        setCurrentPage("presentation")
      }
    } catch (error) {
      console.error("Failed to initialize app:", error)
      setCurrentPage("presentation")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserTypeSelection = async (type: UserType) => {
    setUserType(type)

    // Save user type
    if (walletData) {
      const updatedWalletData = { ...walletData, userType: type }
      await walletStorage.saveWalletData(updatedWalletData)
      setWalletData(updatedWalletData)
    }

    setCurrentPage("onboarding")
  }

  const handleOnboardingComplete = (data: any) => {
    setWalletData(data)
    setCurrentPage(userType === "business" ? "tpe-dashboard" : "dashboard")
  }

  const handlePinSetupComplete = () => {
    setCurrentPage(userType === "business" ? "tpe-dashboard" : "dashboard")
  }

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return <LoadingFallback />
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "presentation":
        return <AppPresentation onContinue={() => setCurrentPage("user-type-selection")} />

      case "user-type-selection":
        return <UserTypeSelection onSelect={handleUserTypeSelection} />

      case "onboarding":
        return <OnboardingPage onComplete={handleOnboardingComplete} />

      case "pin-setup":
        return <PinSetupPage onComplete={handlePinSetupComplete} />

      case "dashboard":
        return <MainDashboard walletData={walletData} onNavigate={navigateTo} />

      case "send":
        return <SendPage onBack={() => navigateTo("dashboard")} />

      case "receive":
        return <ReceivePage onBack={() => navigateTo("dashboard")} />

      case "history":
        return <TransactionHistory onBack={() => navigateTo("dashboard")} />

      case "settings":
        return <SettingsPage onBack={() => navigateTo("dashboard")} />

      case "tpe-dashboard":
        return <TPEDashboard onNavigate={navigateTo} />

      case "tpe-main":
        return <TPEMainPage onBack={() => navigateTo("tpe-dashboard")} />

      case "tpe-payment":
        return <TPEPaymentPage onBack={() => navigateTo("tpe-dashboard")} />

      case "tpe-billing":
        return <TPEBillingPage onBack={() => navigateTo("tpe-dashboard")} />

      case "tpe-conversion":
        return <TPEConversionPage onBack={() => navigateTo("tpe-dashboard")} />

      case "tpe-search":
        return <TPESearchPage onBack={() => navigateTo("tpe-dashboard")} />

      case "tpe-history":
        return <TPEHistoryPage onBack={() => navigateTo("tpe-dashboard")} />

      case "tpe-settings":
        return <TPESettingsPage onBack={() => navigateTo("tpe-dashboard")} />

      case "tpe-statistics":
        return <TPEStatisticsPage onBack={() => navigateTo("tpe-dashboard")} />

      case "tpe-vat":
        return <TPEVatManagement onBack={() => navigateTo("tpe-settings")} />

      default:
        return <AppPresentation onContinue={() => setCurrentPage("user-type-selection")} />
    }
  }

  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <LanguageProvider>
          <CurrencyProvider>
            <div className="min-h-screen bg-background">
              {renderCurrentPage()}
              <Toaster />
            </div>
          </CurrencyProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
