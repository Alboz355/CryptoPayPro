"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Shield, Key, Copy, Eye, EyeOff, Download, AlertTriangle } from "lucide-react"
import { useWalletStore } from "@/store/wallet-store"
import { validators } from "@/utils/validation"
import { toast } from "sonner"

export function OnboardingPage() {
  const { createWallet, importWallet } = useWalletStore()
  
  const [seedPhrase, setSeedPhrase] = useState("")
  const [walletName, setWalletName] = useState("")
  const [generatedSeed, setGeneratedSeed] = useState("")
  const [showSeed, setShowSeed] = useState(false)
  const [seedConfirmed, setSeedConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [importError, setImportError] = useState("")

  const handleCreateWallet = async () => {
    setIsLoading(true)
    try {
      const walletData = await createWallet()
      setGeneratedSeed(walletData.mnemonic)
      toast.success("Portefeuille créé avec succès !")
    } catch (error) {
      console.error("Erreur création portefeuille:", error)
      toast.error("Erreur lors de la création du portefeuille")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportWallet = async () => {
    setImportError("")
    
    // Validate seed phrase
    const validation = validators.seedPhrase(seedPhrase)
    if (!validation.isValid) {
      setImportError(validation.error || "Phrase mnémonique invalide")
      return
    }

    setIsLoading(true)
    try {
      await importWallet(seedPhrase.trim())
      toast.success("Portefeuille importé avec succès !")
    } catch (error) {
      console.error("Erreur importation portefeuille:", error)
      setImportError("Impossible d'importer le portefeuille. Vérifiez votre phrase mnémonique.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copié dans le presse-papiers")
    } catch (error) {
      toast.error("Impossible de copier")
    }
  }

  const confirmSeedPhrase = () => {
    setSeedConfirmed(true)
    // The store will automatically navigate to pin-setup
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4"
          >
            <Wallet className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            CryptoPayPro
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Votre portefeuille multi-blockchain sécurisé
          </p>
        </motion.div>

        {/* Main Content */}
        {!generatedSeed ? (
          <motion.div variants={itemVariants}>
            <Card className="max-w-2xl mx-auto shadow-2xl">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl">Commencer</CardTitle>
                <CardDescription>
                  Créez un nouveau portefeuille ou importez un portefeuille existant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="create" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="create" className="gap-2">
                      <Shield className="h-4 w-4" />
                      Créer un portefeuille
                    </TabsTrigger>
                    <TabsTrigger value="import" className="gap-2">
                      <Download className="h-4 w-4" />
                      Importer un portefeuille
                    </TabsTrigger>
                  </TabsList>

                  {/* Create Wallet Tab */}
                  <TabsContent value="create" className="space-y-6">
                    <div className="text-center">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-6">
                        <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Nouveau portefeuille sécurisé</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Générez une nouvelle phrase mnémonique de 12 mots pour créer votre portefeuille multi-blockchain.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="walletName">Nom du portefeuille (optionnel)</Label>
                          <Input
                            id="walletName"
                            placeholder="Mon Portefeuille Crypto"
                            value={walletName}
                            onChange={(e) => setWalletName(e.target.value)}
                            className="mt-2"
                          />
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            onClick={handleCreateWallet}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
                          >
                            {isLoading ? "Création en cours..." : "Créer un nouveau portefeuille"}
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Import Wallet Tab */}
                  <TabsContent value="import" className="space-y-6">
                    <div className="text-center">
                      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
                        <Key className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Importer un portefeuille existant</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Entrez votre phrase mnémonique de 12 ou 24 mots pour restaurer votre portefeuille.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="seedPhrase">Phrase mnémonique</Label>
                          <Textarea
                            id="seedPhrase"
                            placeholder="Entrez vos 12 ou 24 mots séparés par des espaces..."
                            value={seedPhrase}
                            onChange={(e) => {
                              setSeedPhrase(e.target.value)
                              setImportError("")
                            }}
                            className="mt-2 h-32"
                          />
                          {importError && (
                            <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                              <AlertTriangle className="h-4 w-4" />
                              {importError}
                            </div>
                          )}
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button 
                            onClick={handleImportWallet}
                            disabled={!seedPhrase.trim() || isLoading}
                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg"
                          >
                            {isLoading ? "Importation en cours..." : "Importer le portefeuille"}
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Seed Phrase Display */
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Card className="max-w-3xl mx-auto shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-orange-600">
                  ⚠️ Sauvegardez votre phrase mnémonique
                </CardTitle>
                <CardDescription>
                  Cette phrase est la seule façon de récupérer votre portefeuille. 
                  <strong> Ne la partagez jamais et conservez-la en sécurité.</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Votre phrase mnémonique</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowSeed(!showSeed)}
                      >
                        {showSeed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(generatedSeed)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {generatedSeed.split(" ").map((word, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-700 p-3 rounded border text-center"
                      >
                        <span className="text-xs text-gray-500">{index + 1}</span>
                        <div className="font-mono">
                          {showSeed ? word : "••••"}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-red-800 dark:text-red-200 mb-1">
                        Avertissement de sécurité
                      </p>
                      <ul className="text-red-700 dark:text-red-300 space-y-1">
                        <li>• Ne partagez jamais cette phrase avec qui que ce soit</li>
                        <li>• Conservez-la hors ligne dans un endroit sûr</li>
                        <li>• Aucun membre de l'équipe ne vous demandera jamais cette phrase</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={confirmSeedPhrase}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-6 text-lg"
                  >
                    J'ai sauvegardé ma phrase mnémonique en sécurité
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Features Section */}
        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto"
        >
          {[
            {
              icon: Shield,
              title: "Sécurité maximale",
              description: "Chiffrement AES-256 et stockage local sécurisé"
            },
            {
              icon: Wallet,
              title: "Multi-blockchain",
              description: "Support Bitcoin, Ethereum, Polygon et Algorand"
            },
            {
              icon: Key,
              title: "Contrôle total",
              description: "Vous seul avez accès à vos clés privées"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="text-center h-full">
                <CardContent className="p-6">
                  <feature.icon className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}