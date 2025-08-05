"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Moon, Sun, Shield, Bell, Smartphone, HelpCircle, Key, Eye, Download, Trash2 } from "lucide-react"
import { useTheme } from "next-themes"
import { ChangePinModal } from "@/components/change-pin-modal"
import { SeedPhraseModal } from "@/components/seed-phrase-modal"
import { SupportContactModal } from "@/components/support-contact-modal"

interface SettingsPageProps {
  onNavigate: (page: string) => void
  walletData?: any
  userType?: "individual" | "business"
}

export function SettingsPage({ onNavigate, walletData, userType }: SettingsPageProps) {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [biometric, setBiometric] = useState(false)
  const [autoLock, setAutoLock] = useState("5")
  const [showChangePinModal, setShowChangePinModal] = useState(false)
  const [showSeedPhraseModal, setShowSeedPhraseModal] = useState(false)
  const [showSupportModal, setShowSupportModal] = useState(false)

  const handleExportWallet = () => {
    if (walletData) {
      const dataStr = JSON.stringify(walletData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = "wallet-backup.json"
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const handleResetWallet = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser votre portefeuille ? Cette action est irréversible.")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-purple-500 dark:to-pink-600 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Paramètres</h1>
              <p className="text-slate-600 dark:text-slate-400">Gérez vos préférences et sécurité</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-white/50 dark:bg-slate-800/50">
            {userType === "business" ? "Professionnel" : "Particulier"}
          </Badge>
        </div>

        <div className="grid gap-6">
          {/* Apparence */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                <Sun className="w-5 h-5" />
                <span>Apparence</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="text-slate-700 dark:text-slate-300">
                  Thème
                </Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center space-x-2">
                        <Sun className="w-4 h-4" />
                        <span>Clair</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center space-x-2">
                        <Moon className="w-4 h-4" />
                        <span>Sombre</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="w-4 h-4" />
                        <span>Système</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Sécurité */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                <Shield className="w-5 h-5" />
                <span>Sécurité</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Code PIN</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Modifier votre code PIN</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChangePinModal(true)}
                  className="bg-white/50 dark:bg-slate-700/50"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Changer
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Phrase de récupération</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Afficher votre phrase de sauvegarde</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSeedPhraseModal(true)}
                  className="bg-white/50 dark:bg-slate-700/50"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="biometric" className="text-slate-700 dark:text-slate-300">
                    Authentification biométrique
                  </Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Utiliser l'empreinte ou Face ID</p>
                </div>
                <Switch id="biometric" checked={biometric} onCheckedChange={setBiometric} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autolock" className="text-slate-700 dark:text-slate-300">
                    Verrouillage automatique
                  </Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Temps avant verrouillage</p>
                </div>
                <Select value={autoLock} onValueChange={setAutoLock}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 min</SelectItem>
                    <SelectItem value="5">5 min</SelectItem>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-slate-700 dark:text-slate-300">
                    Notifications push
                  </Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Recevoir les alertes importantes</p>
                </div>
                <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </CardContent>
          </Card>

          {/* Sauvegarde et Restauration */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                <Download className="w-5 h-5" />
                <span>Sauvegarde et Restauration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Exporter le portefeuille</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Télécharger une sauvegarde</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportWallet}
                  className="bg-white/50 dark:bg-slate-700/50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                <HelpCircle className="w-5 h-5" />
                <span>Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Contacter le support</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Obtenir de l'aide</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSupportModal(true)}
                  className="bg-white/50 dark:bg-slate-700/50"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Zone de danger */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                <Trash2 className="w-5 h-5" />
                <span>Zone de danger</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-700 dark:text-slate-300">Réinitialiser le portefeuille</Label>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Supprimer toutes les données</p>
                </div>
                <Button variant="destructive" size="sm" onClick={handleResetWallet}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => onNavigate("dashboard")}
            variant="outline"
            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
          >
            Retour au tableau de bord
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ChangePinModal isOpen={showChangePinModal} onClose={() => setShowChangePinModal(false)} />

      <SeedPhraseModal
        isOpen={showSeedPhraseModal}
        onClose={() => setShowSeedPhraseModal(false)}
        seedPhrase={walletData?.mnemonic || ""}
      />

      <SupportContactModal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} />
    </div>
  )
}
