"use client"

import { useState, useEffect } from "react"
import { OnboardingPage, type UserType } from "@/components/onboarding-page"
import { PinSetupPage } from "@/components/pin-setup-page"
import { AppPresentation } from "@/components/app-presentation"
import { MainDashboard } from "@/components/main-dashboard"
import { SendPage } from "@/components/send-page"
import { ReceivePage } from "@/components/receive-page"
import { SettingsPage } from "@/components/settings-page"
import { TransactionHistory } from "@/components/transaction-history"
import { TPEDashboard } from "@/components/tpe-dashboard"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingFallback } from "@/components/loading-fallback"
import { PinVerificationModal } from "@/components/pin-verification-modal"
import { ChangePinModal } from "@/components/change-pin-modal"
import { SeedPhraseModal } from "@/components/seed-phrase-modal"
import { MtPelerinWidget } from "@/components/mt-pelerin-widget"
import { SupportContactModal } from "@/components/support-contact-modal"
import { PriceAlertModal } from "@/components/price-alert-modal"

export type AppState =
  | "onboarding"
  | "pin-setup"
  | "app-presentation"
  | "dashboard"
  | "send"
  | "receive"
  | "settings"
  | "history"
  | "tpe"
  | "tpe-search"
  | "tpe-billing"
  | "tpe-payment"
  | "tpe-conversion"
  | "tpe-history"
  | "tpe-settings"
  | "tpe-vat-management"
  | "tpe-statistics"

interface WalletData {
  mnemonic: string
  addresses: {
    bitcoin: string
    ethereum: string
    algorand: string
  }
  balances: {
    bitcoin: string
    ethereum: string
    algorand: string
  }
  accounts: any[]
}

export default function CryptoWalletApp() {
  const [currentPage, setCurrentPage] = useState<AppState>("onboarding")
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [userType, setUserType] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPinVerification, setShowPinVerification] = useState(false)
  const [showChangePinModal, setShowChangePinModal] = useState(false)
  const [showSeedPhraseModal, setShowSeedPhraseModal] = useState(false)
  const [showMtPelerinWidget, setShowMtPelerinWidget] = useState(false)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false)
  const [pendingTPEAccess, setPendingTPEAccess] = useState(false)
  const [tpeAccessGranted, setTpeAccessGranted] = useState(false)

  useEffect(() => {
    // Vérifier si un portefeuille existe déjà
    const existingWallet = localStorage.getItem("wallet-data")
    const hasCompletedOnboarding = localStorage.getItem("onboarding-completed")
    const savedUserType = localStorage.getItem("user-type") as UserType | null
    const hasSeenPresentation = localStorage.getItem("presentation-seen")

    if (existingWallet && hasCompletedOnboarding && savedUserType && hasSeenPresentation) {
      try {
        const parsed = JSON.parse(existingWallet)
        setWalletData(parsed)
        setUserType(savedUserType)
        setCurrentPage("dashboard")
      } catch (error) {
        console.error("Erreur lors du chargement du portefeuille:", error)
        // Ne pas supprimer les données, juste revenir à l'onboarding
        setCurrentPage("onboarding")
      }
    } else if (hasCompletedOnboarding && savedUserType && !hasSeenPresentation) {
      // Si l'onboarding est fait mais pas la présentation
      setUserType(savedUserType)
      setCurrentPage("app-presentation")
    } else if (hasCompletedOnboarding && !savedUserType) {
      // Si l'onboarding est fait mais pas le type d'utilisateur
      setCurrentPage("onboarding")
    } else {
      setCurrentPage("onboarding")
    }

    setIsLoading(false)
  }, [])

  const handleWalletCreated = (wallet: WalletData, selectedUserType: UserType) => {
    try {
      setWalletData(wallet)
      setUserType(selectedUserType)
      localStorage.setItem("wallet-data", JSON.stringify(wallet))
      localStorage.setItem("user-type", selectedUserType)
      setCurrentPage("pin-setup")
    } catch (error) {
      console.error("Erreur sauvegarde portefeuille:", error)
    }
  }

  const handlePinCreated = (pin: string) => {
    try {
      // En production, utiliser un hash sécurisé
      localStorage.setItem("pin-hash", btoa(pin))
      localStorage.setItem("onboarding-completed", "true")
      setCurrentPage("app-presentation")
    } catch (error) {
      console.error("Erreur sauvegarde PIN:", error)
    }
  }

  const handlePresentationComplete = () => {
    localStorage.setItem("presentation-seen", "true")
    setCurrentPage("dashboard")
  }

  const handleNavigate = (page: AppState) => {
    // Vérifier si l'accès au TPE nécessite un PIN (seulement si pas déjà accordé)
    if (page.startsWith("tpe") && !tpeAccessGranted) {
      setPendingTPEAccess(true)
      setShowPinVerification(true)
      return
    }
    setCurrentPage(page)
  }

  const handlePinVerified = () => {
    setShowPinVerification(false)
    if (pendingTPEAccess) {
      setPendingTPEAccess(false)
      setTpeAccessGranted(true) // Accorder l'accès TPE pour cette session
      setCurrentPage("tpe")
    }
  }

  const handlePinVerificationCancel = () => {
    setShowPinVerification(false)
    setPendingTPEAccess(false)
  }

  const handleChangePinRequest = () => {
    setShowChangePinModal(true)
  }

  const handlePinChanged = (newPin: string) => {
    try {
      localStorage.setItem("pin-hash", btoa(newPin))
      setShowChangePinModal(false)
      alert("Code PIN modifié avec succès !")
    } catch (error) {
      console.error("Erreur changement PIN:", error)
      alert("Erreur lors du changement de PIN")
    }
  }

  const handleShowSeedPhrase = () => {
    setShowSeedPhraseModal(true)
  }

  const handleShowMtPelerin = () => {
    setShowMtPelerinWidget(true)
  }

  const handleShowSupport = () => {
    setShowSupportModal(true)
  }

  const handleShowPriceAlert = () => {
    setShowPriceAlertModal(true)
  }

  const handleExitTPE = () => {
    setTpeAccessGranted(false) // Révoquer l'accès TPE
    setCurrentPage("dashboard")
  }

  const handleUserTypeChange = (newUserType: UserType) => {
    setUserType(newUserType)
    localStorage.setItem("user-type", newUserType)
  }

  if (isLoading) {
    return <LoadingFallback />
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "onboarding":
        return <OnboardingPage onWalletCreated={handleWalletCreated} />
      case "pin-setup":
        return <PinSetupPage onPinCreated={handlePinCreated} />
      case "app-presentation":
        return <AppPresentation userType={userType!} onComplete={handlePresentationComplete} />
      case "dashboard":
        return (
          <MainDashboard
            onNavigate={handleNavigate}
            walletData={walletData}
            onShowMtPelerin={handleShowMtPelerin}
            onShowPriceAlert={handleShowPriceAlert}
            userType={userType}
          />
        )
      case "send":
        return <SendPage onNavigate={handleNavigate} walletData={walletData} />
      case "receive":
        return <ReceivePage onNavigate={handleNavigate} walletData={walletData} />
      case "settings":
        return (
          <SettingsPage
            onNavigate={handleNavigate}
            onChangePinRequest={handleChangePinRequest}
            onShowSeedPhrase={handleShowSeedPhrase}
            onShowSupport={handleShowSupport}
            userType={userType}
            onUserTypeChange={handleUserTypeChange}
          />
        )
      case "history":
        return <TransactionHistory onNavigate={handleNavigate} />
      case "tpe":
      case "tpe-search":
      case "tpe-billing":
      case "tpe-payment":
      case "tpe-conversion":
      case "tpe-history":
      case "tpe-settings":
      case "tpe-vat-management":
      case "tpe-statistics":
        return (
          <TPEDashboard
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onExitTPE={handleExitTPE}
            walletData={walletData}
          />
        )
      default:
        return (
          <MainDashboard
            onNavigate={handleNavigate}
            walletData={walletData}
            onShowMtPelerin={handleShowMtPelerin}
            onShowPriceAlert={handleShowPriceAlert}
            userType={userType}
          />
        )
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground">
        {renderCurrentPage()}

        {/* Modals */}
        {showPinVerification && (
          <PinVerificationModal
            isOpen={showPinVerification}
            onVerified={handlePinVerified}
            onCancel={handlePinVerificationCancel}
            title="Accès au mode TPE"
            description="Veuillez saisir votre code PIN pour accéder au mode TPE"
          />
        )}

        {showChangePinModal && (
          <ChangePinModal
            isOpen={showChangePinModal}
            onPinChanged={handlePinChanged}
            onCancel={() => setShowChangePinModal(false)}
          />
        )}

        {showSeedPhraseModal && walletData && (
          <SeedPhraseModal
            isOpen={showSeedPhraseModal}
            onClose={() => setShowSeedPhraseModal(false)}
            seedPhrase={walletData.mnemonic}
            onShowSupport={handleShowSupport}
          />
        )}

        {showMtPelerinWidget && walletData && (
          <MtPelerinWidget
            isOpen={showMtPelerinWidget}
            onClose={() => setShowMtPelerinWidget(false)}
            walletData={walletData}
          />
        )}

        {showSupportModal && (
          <SupportContactModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} />
        )}

        {showPriceAlertModal && (
          <PriceAlertModal isOpen={showPriceAlertModal} onClose={() => setShowPriceAlertModal(false)} />
        )}
      </div>
    </ErrorBoundary>
  )
}
