"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Settings, Printer, Wifi, Volume2, Shield } from "lucide-react"
import type { AppState } from "@/app/page"

interface TPESettingsPageProps {
  onNavigate: (page: AppState) => void
}

export function TPESettingsPage({ onNavigate }: TPESettingsPageProps) {
  const [settings, setSettings] = useState({
    merchantName: "Mon Commerce",
    merchantId: "MC001",
    autoConfirm: true,
    printReceipts: true,
    soundEnabled: true,
    notifications: true,
    language: "fr",
    currency: "EUR",
    taxRate: "20",
    receiptFooter: "Merci de votre visite !",
    wifiEnabled: true,
    securityPin: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Sauvegarder les paramètres
    localStorage.setItem("tpe-settings", JSON.stringify(settings))
    alert("Paramètres sauvegardés avec succès !")
  }

  const handleReset = () => {
    if (confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?")) {
      localStorage.removeItem("tpe-settings")
      setSettings({
        merchantName: "Mon Commerce",
        merchantId: "MC001",
        autoConfirm: true,
        printReceipts: true,
        soundEnabled: true,
        notifications: true,
        language: "fr",
        currency: "EUR",
        taxRate: "20",
        receiptFooter: "Merci de votre visite !",
        wifiEnabled: true,
        securityPin: true,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("tpe")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold flex items-center">
            <Settings className="mr-2 h-5 w-5" />
            Paramètres TPE
          </h1>
          <div className="w-10" />
        </div>

        {/* Informations du commerçant */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du commerçant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="merchantName">Nom du commerce</Label>
              <Input
                id="merchantName"
                value={settings.merchantName}
                onChange={(e) => handleSettingChange("merchantName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="merchantId">ID Commerçant</Label>
              <Input
                id="merchantId"
                value={settings.merchantId}
                onChange={(e) => handleSettingChange("merchantId", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de transaction */}
        <Card>
          <CardHeader>
            <CardTitle>Paramètres de transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Confirmation automatique</Label>
                <p className="text-sm text-muted-foreground">Confirmer automatiquement les paiements</p>
              </div>
              <Switch
                checked={settings.autoConfirm}
                onCheckedChange={(checked) => handleSettingChange("autoConfirm", checked)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select value={settings.currency} onValueChange={(value) => handleSettingChange("currency", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  <SelectItem value="USD">Dollar US (USD)</SelectItem>
                  <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">Taux de TVA (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={settings.taxRate}
                onChange={(e) => handleSettingChange("taxRate", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres d'impression */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Printer className="mr-2 h-5 w-5" />
              Impression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Imprimer les reçus</Label>
                <p className="text-sm text-muted-foreground">Imprimer automatiquement les reçus</p>
              </div>
              <Switch
                checked={settings.printReceipts}
                onCheckedChange={(checked) => handleSettingChange("printReceipts", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="receiptFooter">Pied de page du reçu</Label>
              <Input
                id="receiptFooter"
                value={settings.receiptFooter}
                onChange={(e) => handleSettingChange("receiptFooter", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres audio et notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="mr-2 h-5 w-5" />
              Audio et notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sons activés</Label>
                <p className="text-sm text-muted-foreground">Jouer des sons pour les événements</p>
              </div>
              <Switch
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => handleSettingChange("soundEnabled", checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications</Label>
                <p className="text-sm text-muted-foreground">Afficher les notifications push</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de connectivité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wifi className="mr-2 h-5 w-5" />
              Connectivité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Wi-Fi activé</Label>
                <p className="text-sm text-muted-foreground">Utiliser la connexion Wi-Fi</p>
              </div>
              <Switch
                checked={settings.wifiEnabled}
                onCheckedChange={(checked) => handleSettingChange("wifiEnabled", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Code PIN requis</Label>
                <p className="text-sm text-muted-foreground">Demander le PIN pour les paramètres</p>
              </div>
              <Switch
                checked={settings.securityPin}
                onCheckedChange={(checked) => handleSettingChange("securityPin", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Paramètres de langue */}
        <Card>
          <CardHeader>
            <CardTitle>Langue et région</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={handleSave} className="flex-1">
            Sauvegarder
          </Button>
          <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
            Réinitialiser
          </Button>
        </div>
      </div>
    </div>
  )
}
