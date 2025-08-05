"use client"

import { useState, useEffect } from "react"
import { AppPresentation } from "@/components/app-presentation"
import { OnboardingPage } from "@/components/onboarding-page"
import { PinSetupPage } from "@/components/pin-setup-page"
import { UserTypeSelection } from "@/components/user-type-selection"
import { MainDashboard } from "@/components/main-dashboard"
import { TPEDashboard } from "@/components/tpe-dashboard"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { CurrencyProvider } from "@/contexts/currency-context"
import { Toaster } from "@/components/ui/sonner"

export default function Home() {
  const [currentStep, setCurrentStep] = useState("presentation")
  const [walletData, setWalletData] = useState<any>(null)
  const [userType, setUserType] = useState<"individual" | "business" | null>(null)
  const [pin, setPin] = useState<string>("")
  const [isTPEMode, setIsTPEMode] = useState(false)

  useEffect(() => {
    // Check if user has already completed onboarding
    const savedWallet = localStorage.getItem("wallet")
    const savedPin = localStorage.getItem("pin")
    const savedUserType = localStorage.getItem("userType")

    if (savedWallet && savedPin && savedUserType) {
      setWalletData(JSON.parse(savedWallet))
      setPin(savedPin)
      setUserType(savedUserType as "individual" | "business")
      setCurrentStep("dashboard")
    }
  }, [])

  const handlePresentationComplete = () => {
    setCurrentStep("onboarding")
  }

  const handleOnboardingComplete = (wallet: any) => {
    setWalletData(wallet)
    localStorage.setItem("wallet", JSON.stringify(wallet))
    setCurrentStep("pinSetup")
  }

  const handlePinSetup = (newPin: string) => {
    setPin(newPin)
    localStorage.setItem("pin", newPin)
    setCurrentStep("userTypeSelection")
  }

  const handleUserTypeSelection = (type: "individual" | "business") => {
    setUserType(type)
    localStorage.setItem("userType", type)
    setCurrentStep("dashboard")
  }

  const handleNavigate = (page: string) => {
    if (page === "tpe") {
      setIsTPEMode(true)
    } else {
      setIsTPEMode(false)
    }
  }

  const handleExitTPE = () => {
    setIsTPEMode(false)
  }

  if (currentStep === "presentation") {
    return (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppPresentation onComplete={handlePresentationComplete} />
      </ThemeProvider>
    )
  }

  if (currentStep === "onboarding") {
    return (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <OnboardingPage onComplete={handleOnboardingComplete} />
      </ThemeProvider>
    )
  }

  if (currentStep === "pinSetup") {
    return (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <PinSetupPage onComplete={handlePinSetup} />
      </ThemeProvider>
    )
  }

  if (currentStep === "userTypeSelection") {
    return (
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <UserTypeSelection onComplete={handleUserTypeSelection} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <LanguageProvider>
        <CurrencyProvider>
          {isTPEMode ? (
            <TPEDashboard
              onNavigate={handleNavigate}
              onExitTPE={handleExitTPE}
              walletData={walletData}
              userType={userType}
              pin={pin}
            />
          ) : (
            <MainDashboard onNavigate={handleNavigate} walletData={walletData} userType={userType} pin={pin} />
          )}
          <Toaster />
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
