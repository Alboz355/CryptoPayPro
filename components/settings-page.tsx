"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Shield,
  Key,
  Eye,
  Bell,
  Palette,
  Globe,
  HelpCircle,
  Info,
  User,
  Store,
  Database,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import type { AppState } from "@/app/page"
import type { UserType } from "@/components/user-type-selection"

interface SettingsPageProps {
  onNavigate: (page: AppState) => void
  onChangePinRequest: () => void
  onShowSeedPhrase: () => void
  onShowSupport: () => void
  userType?: UserType | null
  onUserTypeChange?: (userType: UserType) => void
}

export function SettingsPage({
  onNavigate,
  onChangePinRequest,
  onShowSeedPhrase,
  onShowSupport,
  userType,
  onUserTypeChange,
}: SettingsPageProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [autoLock, setAutoLock] = useState(true)

  const handleUserTypeChange = (newUserType: UserType) => {
    if (onUserTypeChange) {
      onUserTypeChange(newUserType)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={() => onNavigate("dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Configuration de l'application</p>
            </div>
          </div>
          {userType && (
            <Badge variant="outline" className="text-xs">
              {userType === "client" ? (
                <>
                  <User className="h-3 w-3 mr-1" />
                  Personnel
                </>
              ) : (
                <>
                  <Store className="h-3 w-3 mr-1" />
                  Commerçant
                </>
              )}
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil Utilisateur
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Type de compte</p>
                <p className="text-sm text-gray-500">
                  {userType === "client" ? "Utilisateur personnel" : "Commerçant/Entreprise"}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={userType === "client" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUserTypeChange("client")}
                  className="flex items-center gap-1"
                >
                  <User className="h-3 w-3" />
                  Personnel
                </Button>
                <Button
                  variant={userType === "merchant" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUserTypeChange("merchant")}
                  className="flex items-center gap-1"
                >
                  <Store className="h-3 w-3" />
                  Commerçant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Code PIN</p>
                <p className="text-sm text-gray-500">Modifier votre code PIN</p>
              </div>
              <Button variant="outline" onClick={onChangePinRequest}>
                <Key className="h-4 w-4 mr-2" />
                Changer
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Phrase de récupération</p>
                <p className="text-sm text-gray-500">Afficher votre phrase secrète</p>
              </div>
              <Button variant="outline" onClick={onShowSeedPhrase}>
                <Eye className="h-4 w-4 mr-2" />
                Afficher
              </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Authentification biométrique</p>
                <p className="text-sm text-gray-500">Touch ID / Face ID</p>
              </div>
              <Switch checked={biometricEnabled} onCheckedChange={setBiometricEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Verrouillage automatique</p>
                <p className="text-sm text-gray-500">Après 5 minutes d'inactivité</p>
              </div>
              <Switch checked={autoLock} onCheckedChange={setAutoLock} />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Apparence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mode sombre</p>
                <p className="text-sm text-gray-500">Interface en thème sombre</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Langue</p>
                <p className="text-sm text-gray-500">Français (Suisse)</p>
              </div>
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                FR-CH
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications push</p>
                <p className="text-sm text-gray-500">Alertes de prix et transactions</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sons</p>
                <p className="text-sm text-gray-500">Sons de notification</p>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Data Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Gestion des Données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Exporter les données</p>
                <p className="text-sm text-gray-500">Sauvegarder vos transactions</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Importer des données</p>
                <p className="text-sm text-gray-500">Restaurer depuis une sauvegarde</p>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Importer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Support & Aide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={onShowSupport}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Contacter le support
            </Button>

            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Info className="h-4 w-4 mr-2" />À propos de l'application
            </Button>

            <div className="text-center text-sm text-gray-500 pt-4">
              <p>Version 1.0.0</p>
              <p>🇨🇭 Développé en Suisse</p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Zone Dangereuse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600">Supprimer le portefeuille</p>
                <p className="text-sm text-gray-500">Action irréversible</p>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom spacing for navigation */}
      <div className="h-20"></div>
    </div>
  )
}
