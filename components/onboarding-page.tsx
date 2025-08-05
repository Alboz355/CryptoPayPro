"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Shield, Smartphone, Coins, User, Store, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { generateWallet } from "@/lib/wallet-utils"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/i18n"
import type { UserType, WalletData } from "@/app/page"

interface OnboardingPageProps {
  onWalletCreated: (wallet: WalletData, userType: UserType) => void
}

export function OnboardingPage({ onWalletCreated }: OnboardingPageProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const [currentStep, setCurrentStep] = useState<"user-type" | "wallet-setup">("user-type")
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importSeedPhrase, setImportSeedPhrase] = useState("")
  const [importError, setImportError] = useState("")

  const handleUserTypeSelection = (userType: UserType) => {
    setSelectedUserType(userType)
    setCurrentStep("wallet-setup")
  }

  const handleCreateWallet = async () => {
    if (!selectedUserType) return

    setIsCreating(true)
    try {
      const wallet = await generateWallet()

      const walletData: WalletData = {
        mnemonic: wallet.mnemonic,
        addresses: wallet.addresses,
        balances: {
          bitcoin: "0",
          ethereum: "0",
          algorand: "0",
        },
        accounts: [],
      }

      onWalletCreated(walletData, selectedUserType)
    } catch (error) {
      console.error("Erreur création portefeuille:", error)
      alert(t.messages.error || "Erreur lors de la création du portefeuille")
    } finally {
      setIsCreating(false)
    }
  }

  const handleImportWallet = async () => {
    if (!selectedUserType) return

    setImportError("")

    if (!importSeedPhrase.trim()) {
      setImportError(t.messages.invalidSeedPhrase || "Veuillez saisir une phrase de récupération valide")
      return
    }

    const words = importSeedPhrase.trim().split(/\s+/)
    if (words.length !== 12 && words.length !== 24) {
      setImportError(t.messages.seedPhraseMustBe || "La phrase de récupération doit contenir 12 ou 24 mots")
      return
    }

    setIsImporting(true)
    try {
      // Simuler l'import du portefeuille
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const wallet = await generateWallet()

      const walletData: WalletData = {
        mnemonic: importSeedPhrase.trim(),
        addresses: wallet.addresses,
        balances: {
          bitcoin: "0",
          ethereum: "0",
          algorand: "0",
        },
        accounts: [],
      }

      onWalletCreated(walletData, selectedUserType)
    } catch (error) {
      console.error("Erreur import portefeuille:", error)
      setImportError(t.messages.error || "Erreur lors de l'import du portefeuille")
    } finally {
      setIsImporting(false)
    }
  }

  if (currentStep === "user-type") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t.onboarding.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">{t.onboarding.subtitle}</p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t.onboarding.userTypeSelection.title}</CardTitle>
              <CardDescription>{t.onboarding.userTypeSelection.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedUserType === "client" ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                  onClick={() => handleUserTypeSelection("client")}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t.onboarding.userTypeSelection.client.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t.onboarding.userTypeSelection.client.description}
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedUserType === "merchant" ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                  onClick={() => handleUserTypeSelection("merchant")}
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Store className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{t.onboarding.userTypeSelection.merchant.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {t.onboarding.userTypeSelection.merchant.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Button variant="ghost" onClick={() => setCurrentStep("user-type")} className="mb-4">
            ← {t.common.back}
          </Button>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t.onboarding.walletSetup.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">{t.onboarding.walletSetup.subtitle}</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">{t.common.create}</TabsTrigger>
                <TabsTrigger value="import">{t.common.import}</TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <Coins className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{t.onboarding.walletSetup.create.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t.onboarding.walletSetup.create.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 my-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm font-medium">{t.onboarding.walletSetup.features.secure}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Smartphone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-sm font-medium">{t.onboarding.walletSetup.features.multiPlatform}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Coins className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <p className="text-sm font-medium">{t.onboarding.walletSetup.features.multiCrypto}</p>
                  </div>
                </div>

                <Button onClick={handleCreateWallet} disabled={isCreating} className="w-full h-12 text-lg">
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t.onboarding.walletSetup.create.creating}
                    </>
                  ) : (
                    <>
                      {t.onboarding.walletSetup.create.button}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="import" className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{t.onboarding.walletSetup.import.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{t.onboarding.walletSetup.import.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="seed-phrase">{t.settings.security.seedPhrase}</Label>
                    <Textarea
                      id="seed-phrase"
                      placeholder={t.onboarding.walletSetup.import.placeholder}
                      value={importSeedPhrase}
                      onChange={(e) => setImportSeedPhrase(e.target.value)}
                      className="min-h-[100px] mt-2"
                    />
                  </div>

                  {importError && (
                    <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <p className="text-sm text-red-700 dark:text-red-300">{importError}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleImportWallet}
                    disabled={isImporting || !importSeedPhrase.trim()}
                    className="w-full h-12 text-lg"
                  >
                    {isImporting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {t.onboarding.walletSetup.import.importing}
                      </>
                    ) : (
                      <>
                        {t.onboarding.walletSetup.import.button}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
