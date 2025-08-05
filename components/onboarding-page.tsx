"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, Wallet, Shield, Key, AlertTriangle, CheckCircle, Copy, RefreshCw } from "lucide-react"
import { generateWallet, restoreWallet, validateSeedPhrase, hashPin } from "@/lib/wallet-utils"
import { walletStorage } from "@/lib/storage"
import { handleError } from "@/lib/error-handler"

interface OnboardingPageProps {
  onComplete: (walletData: any) => void
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [walletData, setWalletData] = useState<any>(null)
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [seedPhrase, setSeedPhrase] = useState("")
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  const [seedPhraseConfirmed, setSeedPhraseConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("create")

  const steps = [
    { title: "Bienvenue", description: "Configuration de votre portefeuille" },
    { title: "Sécurité", description: "Définir votre code PIN" },
    { title: "Portefeuille", description: "Créer ou restaurer" },
    { title: "Sauvegarde", description: "Sauvegarder votre phrase de récupération" },
    { title: "Confirmation", description: "Finaliser la configuration" },
  ]

  const handleCreateWallet = async () => {
    setIsLoading(true)
    setError("")

    try {
      const wallet = await generateWallet()
      setWalletData(wallet)
      setCurrentStep(3)
    } catch (err) {
      const errorInfo = handleError(err)
      setError(errorInfo.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRestoreWallet = async () => {
    if (!seedPhrase.trim()) {
      setError("Veuillez saisir votre phrase de récupération")
      return
    }

    if (!validateSeedPhrase(seedPhrase)) {
      setError("Phrase de récupération invalide")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const addresses = await restoreWallet(seedPhrase)
      setWalletData({ mnemonic: seedPhrase, addresses })
      setCurrentStep(4)
    } catch (err) {
      const errorInfo = handleError(err)
      setError(errorInfo.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinSetup = async () => {
    if (pin.length !== 6) {
      setError("Le code PIN doit contenir 6 chiffres")
      return
    }

    if (pin !== confirmPin) {
      setError("Les codes PIN ne correspondent pas")
      return
    }

    setCurrentStep(2)
    setError("")
  }

  const handleComplete = async () => {
    if (!walletData) {
      setError("Données du portefeuille manquantes")
      return
    }

    setIsLoading(true)

    try {
      const hashedPin = await hashPin(pin)

      const completeWalletData = {
        ...walletData,
        hashedPin,
        balances: {
          bitcoin: "0",
          ethereum: "0",
          algorand: "0",
        },
        isSetup: true,
      }

      await walletStorage.saveWalletData(completeWalletData)
      onComplete(completeWalletData)
    } catch (err) {
      const errorInfo = handleError(err)
      setError(errorInfo.message)
    } finally {
      setIsLoading(false)
    }
  }

  const copySeedPhrase = () => {
    if (walletData?.mnemonic) {
      navigator.clipboard.writeText(walletData.mnemonic)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Wallet className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Bienvenue dans CryptoPay</CardTitle>
              <CardDescription>Votre portefeuille crypto sécurisé et facile à utiliser</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Sécurité de niveau bancaire</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Key className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Vous contrôlez vos clés privées</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Support multi-devises</span>
                </div>
              </div>
              <Button onClick={() => setCurrentStep(1)} className="w-full">
                Commencer
              </Button>
            </CardContent>
          </Card>
        )

      case 1:
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Sécuriser votre portefeuille</CardTitle>
              <CardDescription>Définissez un code PIN à 6 chiffres pour protéger votre portefeuille</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin">Code PIN (6 chiffres)</Label>
                <Input
                  id="pin"
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="••••••"
                  maxLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPin">Confirmer le code PIN</Label>
                <Input
                  id="confirmPin"
                  type="password"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="••••••"
                  maxLength={6}
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setCurrentStep(0)} className="flex-1">
                  Retour
                </Button>
                <Button
                  onClick={handlePinSetup}
                  disabled={pin.length !== 6 || confirmPin.length !== 6}
                  className="flex-1"
                >
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Configuration du portefeuille</CardTitle>
              <CardDescription>Créez un nouveau portefeuille ou restaurez un portefeuille existant</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="create">Créer</TabsTrigger>
                  <TabsTrigger value="restore">Restaurer</TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="space-y-4">
                  <div className="text-center space-y-2">
                    <Wallet className="h-12 w-12 mx-auto text-blue-600" />
                    <h3 className="font-semibold">Nouveau portefeuille</h3>
                    <p className="text-sm text-gray-600">
                      Créez un nouveau portefeuille avec une phrase de récupération sécurisée
                    </p>
                  </div>
                  <Button onClick={handleCreateWallet} disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      "Créer un portefeuille"
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="restore" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="seedPhrase">Phrase de récupération</Label>
                    <Textarea
                      id="seedPhrase"
                      value={seedPhrase}
                      onChange={(e) => setSeedPhrase(e.target.value)}
                      placeholder="Saisissez votre phrase de récupération de 12 ou 24 mots..."
                      rows={4}
                    />
                  </div>
                  <Button onClick={handleRestoreWallet} disabled={isLoading || !seedPhrase.trim()} className="w-full">
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Restauration...
                      </>
                    ) : (
                      "Restaurer le portefeuille"
                    )}
                  </Button>
                </TabsContent>
              </Tabs>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-2 mt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                  Retour
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Phrase de récupération</CardTitle>
              <CardDescription>
                Sauvegardez cette phrase en lieu sûr. Elle est nécessaire pour restaurer votre portefeuille.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important :</strong> Cette phrase de récupération est le seul moyen de restaurer votre
                  portefeuille. Ne la partagez jamais avec personne.
                </AlertDescription>
              </Alert>

              <div className="relative">
                <div
                  className={`p-4 bg-gray-50 rounded-lg border-2 border-dashed ${showSeedPhrase ? "border-gray-300" : "border-gray-200"}`}
                >
                  {showSeedPhrase ? (
                    <div className="space-y-2">
                      <p className="text-sm font-mono break-all">{walletData?.mnemonic}</p>
                      <Button variant="outline" size="sm" onClick={copySeedPhrase} className="w-full bg-transparent">
                        <Copy className="mr-2 h-4 w-4" />
                        Copier
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Eye className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">Cliquez pour révéler votre phrase de récupération</p>
                    </div>
                  )}
                </div>
                {!showSeedPhrase && (
                  <Button
                    variant="outline"
                    onClick={() => setShowSeedPhrase(true)}
                    className="absolute inset-0 w-full h-full bg-white/80 hover:bg-white/90"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Révéler la phrase
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="seedPhraseConfirmed"
                  checked={seedPhraseConfirmed}
                  onCheckedChange={(checked) => setSeedPhraseConfirmed(checked as boolean)}
                />
                <Label htmlFor="seedPhraseConfirmed" className="text-sm">
                  J'ai sauvegardé ma phrase de récupération en lieu sûr
                </Label>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setCurrentStep(2)} className="flex-1">
                  Retour
                </Button>
                <Button onClick={() => setCurrentStep(4)} disabled={!seedPhraseConfirmed} className="flex-1">
                  Continuer
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Configuration terminée</CardTitle>
              <CardDescription>Votre portefeuille est prêt à être utilisé</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Adresses générées :</h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium">Bitcoin:</span>
                      <p className="font-mono break-all text-gray-600">{walletData?.addresses?.bitcoin}</p>
                    </div>
                    <div>
                      <span className="font-medium">Ethereum:</span>
                      <p className="font-mono break-all text-gray-600">{walletData?.addresses?.ethereum}</p>
                    </div>
                    <div>
                      <span className="font-medium">Algorand:</span>
                      <p className="font-mono break-all text-gray-600">{walletData?.addresses?.algorand}</p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setCurrentStep(3)} className="flex-1">
                  Retour
                </Button>
                <Button onClick={handleComplete} disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Finalisation...
                    </>
                  ) : (
                    "Terminer"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                  index <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <div className="text-center mt-2">
            <h2 className="text-lg font-semibold">{steps[currentStep]?.title}</h2>
            <p className="text-sm text-gray-600">{steps[currentStep]?.description}</p>
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  )
}
