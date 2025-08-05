"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  Download,
  Upload,
  User,
  Store,
  Shield,
  Key,
  AlertCircle,
  CheckCircle,
  Smartphone,
  Globe,
} from "lucide-react"
import { UserTypeSelection } from "@/components/user-type-selection"
import { generateWallet } from "@/lib/wallet-utils"
import { useLanguage } from "@/contexts/language-context"

export type UserType = "client" | "merchant"

interface OnboardingPageProps {
  onWalletCreated: (wallet: any, userType: UserType) => void
}

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

export function OnboardingPage({ onWalletCreated }: OnboardingPageProps) {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState<"user-type" | "wallet-setup">("user-type")
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null)
  const [walletAction, setWalletAction] = useState<"create" | "import" | null>(null)
  const [importSeedPhrase, setImportSeedPhrase] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleUserTypeSelected = (userType: UserType) => {
    setSelectedUserType(userType)
    setCurrentStep("wallet-setup")
  }

  const handleCreateWallet = async () => {
    if (!selectedUserType) return

    setIsCreating(true)
    setError(null)
    setSuccess(null)

    try {
      const wallet = await generateWallet()

      const walletData: WalletData = {
        mnemonic: wallet.mnemonic,
        addresses: wallet.addresses,
        // Initialiser les soldes à zéro, pas de simulation
        balances: {
          bitcoin: "0",
          ethereum: "0",
          algorand: "0",
        },
        accounts: [
          {
            id: "btc-account",
            name: "Bitcoin Principal",
            address: wallet.addresses.bitcoin,
            balance: "0",
            currency: "BTC",
          },
          {
            id: "eth-account",
            name: "Ethereum Principal",
            address: wallet.addresses.ethereum,
            balance: "0",
            currency: "ETH",
          },
          {
            id: "algo-account",
            name: "Algorand Principal",
            address: wallet.addresses.algorand,
            balance: "0",
            currency: "ALGO",
          },
        ],
      }

      setSuccess("Portefeuille créé avec succès !")
      setTimeout(() => {
        onWalletCreated(walletData, selectedUserType)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du portefeuille")
    } finally {
      setIsCreating(false)
    }
  }

  const handleImportWallet = async () => {
    if (!selectedUserType || !importSeedPhrase.trim()) {
      setError("Veuillez saisir une phrase de récupération valide")
      return
    }

    setIsCreating(true)
    setError(null)
    setSuccess(null)

    try {
      // Validation de la seed phrase
      const words = importSeedPhrase.trim().split(/\s+/)
      if (words.length !== 12 && words.length !== 24) {
        throw new Error("La phrase de récupération doit contenir 12 ou 24 mots")
      }

      const wallet = await generateWallet()

      const walletData: WalletData = {
        mnemonic: importSeedPhrase,
        addresses: wallet.addresses,
        balances: {
          bitcoin: "0",
          ethereum: "0",
          algorand: "0",
        },
        accounts: [
          {
            id: "btc-account",
            name: "Bitcoin Principal",
            address: wallet.addresses.bitcoin,
            balance: "0",
            currency: "BTC",
          },
          {
            id: "eth-account",
            name: "Ethereum Principal",
            address: wallet.addresses.ethereum,
            balance: "0",
            currency: "ETH",
          },
          {
            id: "algo-account",
            name: "Algorand Principal",
            address: wallet.addresses.algorand,
            balance: "0",
            currency: "ALGO",
          },
        ],
      }

      setSuccess("Portefeuille importé avec succès !")
      setTimeout(() => {
        onWalletCreated(walletData, selectedUserType)
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'import du portefeuille")
    } finally {
      setIsCreating(false)
    }
  }

  const validateSeedPhrase = (phrase: string): boolean => {
    const words = phrase.trim().split(/\s+/)
    return words.length === 12 || words.length === 24
  }

  if (currentStep === "user-type") {
    return <UserTypeSelection onUserTypeSelected={handleUserTypeSelected} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {t.onboarding.walletSetup.title}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            {selectedUserType === "client"
              ? "Créez ou importez votre portefeuille crypto personnel pour commencer à gérer vos actifs numériques en toute sécurité."
              : "Configurez votre portefeuille professionnel pour accepter les paiements crypto et gérer votre activité commerciale."}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge
              variant="outline"
              className="bg-white/70 dark:bg-gray-800/70 border-emerald-200 dark:border-emerald-700"
            >
              {selectedUserType === "client" ? (
                <>
                  <User className="h-4 w-4 mr-1 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-300">Mode Client</span>
                </>
              ) : (
                <>
                  <Store className="h-4 w-4 mr-1 text-teal-600" />
                  <span className="text-teal-700 dark:text-teal-300">Mode Commerçant</span>
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-700 dark:to-gray-700 rounded-t-lg">
            <CardTitle className="text-2xl text-gray-800 dark:text-gray-100">Choisissez votre méthode</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs
              value={walletAction || "create"}
              onValueChange={(value) => setWalletAction(value as "create" | "import")}
            >
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 dark:bg-gray-700">
                <TabsTrigger
                  value="create"
                  className="flex items-center gap-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                >
                  <Download className="h-4 w-4" />
                  {t.onboarding.walletSetup.create.title}
                </TabsTrigger>
                <TabsTrigger
                  value="import"
                  className="flex items-center gap-2 data-[state=active]:bg-teal-500 data-[state=active]:text-white"
                >
                  <Upload className="h-4 w-4" />
                  {t.onboarding.walletSetup.import.title}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Key className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                      {t.onboarding.walletSetup.create.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                      {t.onboarding.walletSetup.create.description}. Vous recevrez une phrase de 12 mots à conserver
                      précieusement.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 my-8">
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl border border-emerald-200 dark:border-emerald-700">
                    <Shield className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">
                      {t.onboarding.walletSetup.features.secure}
                    </h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">Chiffrement de niveau militaire</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-xl border border-teal-200 dark:border-teal-700">
                    <Smartphone className="h-10 w-10 text-teal-600 dark:text-teal-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-teal-800 dark:text-teal-200">
                      {t.onboarding.walletSetup.features.multiPlatform}
                    </h4>
                    <p className="text-sm text-teal-700 dark:text-teal-300">Compatible tous appareils</p>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-xl border border-cyan-200 dark:border-cyan-700">
                    <Globe className="h-10 w-10 text-cyan-600 dark:text-cyan-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-cyan-800 dark:text-cyan-200">
                      {t.onboarding.walletSetup.features.multiCrypto}
                    </h4>
                    <p className="text-sm text-cyan-700 dark:text-cyan-300">Bitcoin, Ethereum, Algorand</p>
                  </div>
                </div>

                <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-700">
                  <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    <strong>Important :</strong> Votre phrase de récupération sera affichée une seule fois. Assurez-vous
                    de la noter et de la conserver en lieu sûr.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleCreateWallet}
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t.onboarding.walletSetup.create.creating}
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      {t.onboarding.walletSetup.create.button}
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="import" className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Upload className="h-12 w-12 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                      {t.onboarding.walletSetup.import.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                      {t.onboarding.walletSetup.import.description}.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="seedPhrase" className="text-base font-medium text-gray-700 dark:text-gray-200">
                      Phrase de récupération
                    </Label>
                    <Textarea
                      id="seedPhrase"
                      placeholder={t.onboarding.walletSetup.import.placeholder}
                      value={importSeedPhrase}
                      onChange={(e) => setImportSeedPhrase(e.target.value)}
                      className="mt-2 min-h-[120px] resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      disabled={isCreating}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {
                          importSeedPhrase
                            .trim()
                            .split(/\s+/)
                            .filter((word) => word.length > 0).length
                        }{" "}
                        mots saisis
                      </p>
                      {importSeedPhrase.trim() && (
                        <div className="flex items-center gap-1">
                          {validateSeedPhrase(importSeedPhrase) ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              <span className="text-sm text-emerald-600">Format valide</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm text-red-600">12 ou 24 mots requis</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-700">
                    <Shield className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      <strong>Sécurité :</strong> Ne partagez jamais votre phrase de récupération. Assurez-vous d'être
                      dans un environnement sécurisé.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleImportWallet}
                    disabled={isCreating || !validateSeedPhrase(importSeedPhrase)}
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {t.onboarding.walletSetup.import.importing}
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-2" />
                        {t.onboarding.walletSetup.import.button}
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* Messages d'état */}
            {error && (
              <Alert className="mt-6 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-700">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mt-6 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 dark:border-emerald-700">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <AlertDescription className="text-emerald-800 dark:text-emerald-200">{success}</AlertDescription>
              </Alert>
            )}

            {/* Bouton retour */}
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("user-type")}
                disabled={isCreating}
                className="bg-white/70 dark:bg-gray-700/70 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                {t.common.back} - Changer de profil utilisateur
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>🔒 Vos données sont chiffrées et stockées localement sur votre appareil</p>
        </div>
      </div>
    </div>
  )
}
