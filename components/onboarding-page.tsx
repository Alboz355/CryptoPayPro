"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Eye, EyeOff, Copy, Check, AlertTriangle } from "lucide-react"
import { createWallet } from "@/lib/wallet-utils"

interface OnboardingPageProps {
  onComplete: (walletData: any) => void
}

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(1)
  const [walletData, setWalletData] = useState<any>(null)
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  const [seedPhraseConfirmed, setSeedPhraseConfirmed] = useState(false)
  const [importSeedPhrase, setImportSeedPhrase] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCreateWallet = async () => {
    try {
      const wallet = createWallet()
      setWalletData(wallet)
      setStep(2)
    } catch (error) {
      console.error("Error creating wallet:", error)
    }
  }

  const handleImportWallet = () => {
    setIsImporting(true)
    setStep(2)
  }

  const handleCopySeedPhrase = async () => {
    if (walletData?.mnemonic) {
      await navigator.clipboard.writeText(walletData.mnemonic)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleConfirmSeedPhrase = () => {
    setSeedPhraseConfirmed(true)
    setStep(3)
  }

  const handleImportConfirm = () => {
    if (importSeedPhrase.trim()) {
      // In a real app, you would validate and import the seed phrase
      const importedWallet = {
        mnemonic: importSeedPhrase.trim(),
        addresses: {
          bitcoin: "1ImportedBitcoinAddress",
          ethereum: "0xImportedEthereumAddress",
          algorand: "IMPORTEDALGORANDADDRESS",
        },
        balances: {
          bitcoin: 0,
          ethereum: 0,
          algorand: 0,
        },
      }
      setWalletData(importedWallet)
      setStep(3)
    }
  }

  const handleComplete = () => {
    onComplete(walletData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl">
          <CardHeader className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-purple-500 dark:to-pink-600 rounded-full mb-4 mx-auto">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
              {step === 1 && "Configuration du Portefeuille"}
              {step === 2 && (isImporting ? "Importer un Portefeuille" : "Phrase de Récupération")}
              {step === 3 && "Configuration Terminée"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <p className="text-center text-slate-600 dark:text-slate-300">
                  Choisissez comment vous souhaitez configurer votre portefeuille crypto.
                </p>

                <div className="grid gap-4">
                  <Button
                    onClick={handleCreateWallet}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-6 h-auto"
                    size="lg"
                  >
                    <div className="text-left">
                      <div className="font-semibold">Créer un nouveau portefeuille</div>
                      <div className="text-sm opacity-90">Générer une nouvelle phrase de récupération</div>
                    </div>
                  </Button>

                  <Button
                    onClick={handleImportWallet}
                    variant="outline"
                    className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 p-6 h-auto bg-transparent"
                    size="lg"
                  >
                    <div className="text-left">
                      <div className="font-semibold">Importer un portefeuille existant</div>
                      <div className="text-sm opacity-70">Utiliser une phrase de récupération existante</div>
                    </div>
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && !isImporting && walletData && (
              <div className="space-y-6">
                <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    <strong>Important :</strong> Sauvegardez cette phrase de récupération en lieu sûr. Elle est le seul
                    moyen de récupérer votre portefeuille.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <Label className="text-slate-700 dark:text-slate-300">Phrase de récupération (12 mots)</Label>
                  <div className="relative">
                    <Textarea
                      value={walletData.mnemonic}
                      readOnly
                      className={`min-h-[100px] font-mono text-sm bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600 ${
                        showSeedPhrase ? "" : "blur-sm"
                      }`}
                    />
                    {!showSeedPhrase && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          onClick={() => setShowSeedPhrase(true)}
                          variant="outline"
                          size="sm"
                          className="bg-white dark:bg-slate-800"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Afficher la phrase
                        </Button>
                      </div>
                    )}
                  </div>

                  {showSeedPhrase && (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCopySeedPhrase}
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copié !
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copier
                          </>
                        )}
                      </Button>
                      <Button onClick={() => setShowSeedPhrase(false)} variant="outline" size="sm">
                        <EyeOff className="w-4 h-4 mr-2" />
                        Masquer
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                    Retour
                  </Button>
                  <Button
                    onClick={handleConfirmSeedPhrase}
                    disabled={!showSeedPhrase}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    J'ai sauvegardé ma phrase
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && isImporting && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="seedPhrase" className="text-slate-700 dark:text-slate-300">
                    Phrase de récupération (12 ou 24 mots)
                  </Label>
                  <Textarea
                    id="seedPhrase"
                    placeholder="Entrez votre phrase de récupération séparée par des espaces..."
                    value={importSeedPhrase}
                    onChange={(e) => setImportSeedPhrase(e.target.value)}
                    className="min-h-[100px] font-mono text-sm bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                    Retour
                  </Button>
                  <Button
                    onClick={handleImportConfirm}
                    disabled={!importSeedPhrase.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    Importer le portefeuille
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Portefeuille configuré avec succès !
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Votre portefeuille crypto est maintenant prêt à être utilisé.
                  </p>
                </div>

                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 space-y-2">
                  <div className="text-sm text-slate-600 dark:text-slate-400">Adresses générées :</div>
                  <div className="space-y-1 text-xs font-mono">
                    <div>BTC: {walletData?.addresses?.bitcoin}</div>
                    <div>ETH: {walletData?.addresses?.ethereum}</div>
                    <div>ALGO: {walletData?.addresses?.algorand}</div>
                  </div>
                </div>

                <Button
                  onClick={handleComplete}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  size="lg"
                >
                  Accéder au portefeuille
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
