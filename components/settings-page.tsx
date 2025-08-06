"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Shield, Key, Eye, Bell, Palette, Globe, Smartphone, Trash2, Download, Sun, Moon, Monitor, Languages, DollarSign, Zap } from 'lucide-react'
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/contexts/language-context"
import type { AppState } from "@/app/page"
import type { UserType } from "@/components/onboarding-page"

interface SettingsPageProps {
  onNavigate: (page: AppState) => void
  onChangePinRequest: () => void
  onShowSeedPhrase: () => void
  onShowSupport: () => void
  userType: UserType | null
  onUserTypeChange: (userType: UserType) => void
}

export function SettingsPage({
  onNavigate,
  onChangePinRequest,
  onShowSeedPhrase,
  onShowSupport,
  userType,
  onUserTypeChange,
}: SettingsPageProps) {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    transactions: true,
    security: true,
    marketing: false,
  })
  const [currency, setCurrency] = useState("CHF")
  const [biometrics, setBiometrics] = useState(false)
  const [autoLock, setAutoLock] = useState("5")
  const [pageTransitions, setPageTransitions] = useState(true)

  useEffect(() => {
    setMounted(true)
    // Load settings from localStorage
    const savedNotifications = localStorage.getItem("notifications")
    const savedCurrency = localStorage.getItem("currency")
    const savedBiometrics = localStorage.getItem("biometrics")
    const savedAutoLock = localStorage.getItem("autoLock")
    const savedPageTransitions = localStorage.getItem("pageTransitions")

    if (savedNotifications) setNotifications(JSON.parse(savedNotifications))
    if (savedCurrency) setCurrency(savedCurrency)
    if (savedBiometrics) setBiometrics(JSON.parse(savedBiometrics))
    if (savedAutoLock) setAutoLock(savedAutoLock)
    if (savedPageTransitions !== null) setPageTransitions(JSON.parse(savedPageTransitions))
  }, [])

  // Save page transitions immediately when changed
  const handlePageTransitionsChange = (checked: boolean) => {
    setPageTransitions(checked)
    localStorage.setItem("pageTransitions", JSON.stringify(checked))
    
    toast({
      title: checked ? "Transitions activées" : "Transitions désactivées",
      description: checked ? "Effet de fondu professionnel activé (200ms)" : "Navigation instantanée activée",
    })
  }

  const saveSettings = () => {
    localStorage.setItem("notifications", JSON.stringify(notifications))
    localStorage.setItem("currency", currency)
    localStorage.setItem("biometrics", JSON.stringify(biometrics))
    localStorage.setItem("autoLock", autoLock)
    localStorage.setItem("pageTransitions", JSON.stringify(pageTransitions))

    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour",
    })
  }

  const exportWallet = () => {
    const walletData = localStorage.getItem("wallet-data")
    if (walletData) {
      const blob = new Blob([walletData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `wallet-backup-${new Date().toISOString().split("T")[0]}.json`
      a.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Sauvegarde exportée",
        description: "Votre portefeuille a été sauvegardé",
      })
    }
  }

  const deleteWallet = () => {
    // Clear all wallet data
    localStorage.removeItem("wallet-data")
    localStorage.removeItem("onboarding-completed")
    localStorage.removeItem("user-type")
    localStorage.removeItem("presentation-seen")
    localStorage.removeItem("pin-hash")
    localStorage.removeItem("notifications")
    localStorage.removeItem("currency")
    localStorage.removeItem("biometrics")
    localStorage.removeItem("autoLock")
    localStorage.removeItem("pageTransitions")

    toast({
      title: "Portefeuille supprimé",
      description: "Toutes les données ont été effacées",
    })

    // Redirect to onboarding after a short delay
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-0 bg-background dark:bg-background z-10 py-2">
          <Button variant="ghost" onClick={() => onNavigate("dashboard")} className="bg-background dark:bg-background">
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t.common.back}
          </Button>
          <h1 className="text-2xl font-bold text-foreground">⚙️ {t.settings.title}</h1>
          <div className="w-20" />
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-muted dark:bg-muted">
            <TabsTrigger value="general">{t.settings.tabs.general}</TabsTrigger>
            <TabsTrigger value="security">{t.settings.tabs.security}</TabsTrigger>
            <TabsTrigger value="notifications">{t.settings.tabs.notifications}</TabsTrigger>
            <TabsTrigger value="advanced">{t.settings.tabs.advanced}</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {/* Theme Settings */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Palette className="mr-2 h-5 w-5" />
                  {t.settings.general.appearance}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Thème</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Sun className="h-4 w-4 mr-2" />
                          {t.settings.general.theme.light}
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center">
                          <Moon className="h-4 w-4 mr-2" />
                          {t.settings.general.theme.dark}
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center">
                          <Monitor className="h-4 w-4 mr-2" />
                          {t.settings.general.theme.system}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Animation Settings */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Animations et Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Transitions de pages</Label>
                    <p className="text-sm text-muted-foreground">
                      Effet de fondu professionnel (200ms)
                    </p>
                  </div>
                  <Switch 
                    checked={pageTransitions} 
                    onCheckedChange={handlePageTransitionsChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Désactiver cette option rend la navigation instantanée pour de meilleures performances
                </p>
              </CardContent>
            </Card>

            {/* Language Settings */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Languages className="mr-2 h-5 w-5" />
                  {t.settings.general.language}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t.settings.general.language}</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                      <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                      <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="sq">🇦🇱 Shqip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Currency Settings */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  {t.settings.general.currency}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t.settings.general.currency}</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CHF">
                        <div className="flex items-center">
                          <span className="mr-2">🇨🇭</span>
                          CHF - Franc Suisse
                        </div>
                      </SelectItem>
                      <SelectItem value="EUR">
                        <div className="flex items-center">
                          <span className="mr-2">🇪🇺</span>
                          EUR - Euro
                        </div>
                      </SelectItem>
                      <SelectItem value="USD">
                        <div className="flex items-center">
                          <span className="mr-2">🇺🇸</span>
                          USD - Dollar US
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Les prix des cryptomonnaies seront affichés dans cette devise
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Profile */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  {t.settings.general.userType}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">{t.settings.general.userType}</Label>
                  <Select value={userType || ""} onValueChange={(value) => onUserTypeChange(value as UserType)}>
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue placeholder="Sélectionnez votre profil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">👤 Particulier</SelectItem>
                      <SelectItem value="merchant">🏪 Commerçant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button onClick={saveSettings} className="w-full">
              {t.common.save} les paramètres
            </Button>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* PIN & Security */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  {t.settings.tabs.security}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">{t.settings.security.pin}</Label>
                    <p className="text-sm text-muted-foreground">Modifier votre code PIN</p>
                  </div>
                  <Button variant="outline" onClick={onChangePinRequest} className="bg-background dark:bg-background">
                    <Key className="mr-2 h-4 w-4" />
                    Changer PIN
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">{t.settings.security.seedPhrase}</Label>
                    <p className="text-sm text-muted-foreground">Afficher votre phrase secrète</p>
                  </div>
                  <Button variant="outline" onClick={onShowSeedPhrase} className="bg-background dark:bg-background">
                    <Eye className="mr-2 h-4 w-4" />
                    Voir phrase
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">{t.settings.security.biometrics}</Label>
                    <p className="text-sm text-muted-foreground">Utiliser l'empreinte digitale</p>
                  </div>
                  <Switch checked={biometrics} onCheckedChange={setBiometrics} />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">{t.settings.security.autoLock}</Label>
                  <Select value={autoLock} onValueChange={setAutoLock}>
                    <SelectTrigger className="bg-background dark:bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="never">Jamais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {/* Notifications */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  {t.settings.tabs.notifications}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Alertes de prix</Label>
                    <p className="text-sm text-muted-foreground">Notifications des variations de prix</p>
                  </div>
                  <Switch
                    checked={notifications.priceAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, priceAlerts: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Transactions</Label>
                    <p className="text-sm text-muted-foreground">Confirmations de transactions</p>
                  </div>
                  <Switch
                    checked={notifications.transactions}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, transactions: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-foreground">Sécurité</Label>
                    <p className="text-sm
