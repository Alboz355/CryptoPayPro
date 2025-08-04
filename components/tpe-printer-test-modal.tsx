"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Printer,
  Wifi,
  Usb,
  Bluetooth,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Thermometer,
  FileText,
  Settings,
  Zap,
} from "lucide-react"

interface TPEPrinterTestModalProps {
  isOpen: boolean
  onClose: () => void
}

interface PrinterStatus {
  connection: "connected" | "disconnected" | "error"
  paper: "ok" | "low" | "empty"
  temperature: "normal" | "high" | "critical"
  driver: "installed" | "missing" | "outdated"
}

interface TestResult {
  test: string
  status: "success" | "warning" | "error"
  message: string
  details?: string
}

export function TPEPrinterTestModal({ isOpen, onClose }: TPEPrinterTestModalProps) {
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [testProgress, setTestProgress] = useState(0)
  const [printerStatus, setPrinterStatus] = useState<PrinterStatus>({
    connection: "disconnected",
    paper: "ok",
    temperature: "normal",
    driver: "installed",
  })
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [connectionType, setConnectionType] = useState<"usb" | "wifi" | "bluetooth">("usb")

  const runConnectionTest = async () => {
    setIsTestingConnection(true)
    setTestProgress(0)
    setTestResults([])

    const tests = [
      { name: "Détection du périphérique", delay: 1000 },
      { name: "Test de communication", delay: 1500 },
      { name: "Vérification des pilotes", delay: 1000 },
      { name: "Test de l'état du papier", delay: 800 },
      { name: "Contrôle de la température", delay: 1200 },
    ]

    const results: TestResult[] = []

    for (let i = 0; i < tests.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, tests[i].delay))
      setTestProgress(((i + 1) / tests.length) * 100)

      // Simuler des résultats de test
      let result: TestResult
      switch (i) {
        case 0: // Détection
          result = {
            test: tests[i].name,
            status: Math.random() > 0.2 ? "success" : "error",
            message: Math.random() > 0.2 ? "Imprimante détectée" : "Aucune imprimante trouvée",
            details:
              connectionType === "usb"
                ? "Port USB-A"
                : connectionType === "wifi"
                  ? "192.168.1.100"
                  : "Device: TPE-PRINTER",
          }
          break
        case 1: // Communication
          result = {
            test: tests[i].name,
            status: results[0]?.status === "success" ? (Math.random() > 0.1 ? "success" : "warning") : "error",
            message:
              results[0]?.status === "success"
                ? Math.random() > 0.1
                  ? "Communication établie"
                  : "Communication lente"
                : "Impossible de communiquer",
            details: results[0]?.status === "success" ? "Latence: 45ms" : "Timeout après 5s",
          }
          break
        case 2: // Pilotes
          result = {
            test: tests[i].name,
            status: Math.random() > 0.15 ? "success" : "warning",
            message: Math.random() > 0.15 ? "Pilotes à jour" : "Pilotes obsolètes détectés",
            details: "Version: 2.1.4",
          }
          break
        case 3: // Papier
          const paperStatus = Math.random()
          result = {
            test: tests[i].name,
            status: paperStatus > 0.7 ? "success" : paperStatus > 0.3 ? "warning" : "error",
            message: paperStatus > 0.7 ? "Papier disponible" : paperStatus > 0.3 ? "Papier faible" : "Papier épuisé",
            details: paperStatus > 0.7 ? "Niveau: 85%" : paperStatus > 0.3 ? "Niveau: 15%" : "Remplacer le rouleau",
          }
          break
        case 4: // Température
          result = {
            test: tests[i].name,
            status: Math.random() > 0.1 ? "success" : "warning",
            message: Math.random() > 0.1 ? "Température normale" : "Température élevée",
            details: Math.random() > 0.1 ? "42°C" : "68°C - Laisser refroidir",
          }
          break
        default:
          result = { test: tests[i].name, status: "success", message: "Test réussi" }
      }

      results.push(result)
      setTestResults([...results])
    }

    // Mettre à jour le statut de l'imprimante
    setPrinterStatus({
      connection: results[0]?.status === "success" ? "connected" : "error",
      paper: results[3]?.status === "success" ? "ok" : results[3]?.status === "warning" ? "low" : "empty",
      temperature: results[4]?.status === "success" ? "normal" : "high",
      driver: results[2]?.status === "success" ? "installed" : "outdated",
    })

    setIsTestingConnection(false)
  }

  const printTestPage = async () => {
    if (printerStatus.connection !== "connected") {
      alert("Veuillez d'abord tester la connexion de l'imprimante.")
      return
    }

    setIsPrinting(true)

    // Simulation d'impression
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsPrinting(false)
    alert("Page de test envoyée à l'imprimante !")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
      case "connected":
      case "ok":
      case "normal":
      case "installed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
      case "low":
      case "high":
      case "outdated":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
      case "disconnected":
      case "empty":
      case "critical":
      case "missing":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
      case "connected":
      case "ok":
      case "normal":
      case "installed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20"
      case "warning":
      case "low":
      case "high":
      case "outdated":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20"
      case "error":
      case "disconnected":
      case "empty":
      case "critical":
      case "missing":
        return "bg-red-100 text-red-800 dark:bg-red-900/20"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      connected: "Connectée",
      disconnected: "Déconnectée",
      error: "Erreur",
      ok: "OK",
      low: "Faible",
      empty: "Vide",
      normal: "Normale",
      high: "Élevée",
      critical: "Critique",
      installed: "Installés",
      missing: "Manquants",
      outdated: "Obsolètes",
      success: "Réussi",
      warning: "Attention",
    }
    return labels[status] || status
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5" />
            Test d'Imprimante TPE
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="test" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="test">Test de Connexion</TabsTrigger>
            <TabsTrigger value="status">État de l'Imprimante</TabsTrigger>
            <TabsTrigger value="preview">Aperçu d'Impression</TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration de Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Type de connexion :</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={connectionType === "usb" ? "default" : "outline"}
                      onClick={() => setConnectionType("usb")}
                      className="flex items-center gap-2"
                    >
                      <Usb className="h-4 w-4" />
                      USB
                    </Button>
                    <Button
                      variant={connectionType === "wifi" ? "default" : "outline"}
                      onClick={() => setConnectionType("wifi")}
                      className="flex items-center gap-2"
                    >
                      <Wifi className="h-4 w-4" />
                      Wi-Fi
                    </Button>
                    <Button
                      variant={connectionType === "bluetooth" ? "default" : "outline"}
                      onClick={() => setConnectionType("bluetooth")}
                      className="flex items-center gap-2"
                    >
                      <Bluetooth className="h-4 w-4" />
                      Bluetooth
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={runConnectionTest}
                  disabled={isTestingConnection}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  {isTestingConnection ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Test en cours... ({Math.round(testProgress)}%)
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Lancer le Test de Connexion
                    </>
                  )}
                </Button>

                {isTestingConnection && (
                  <div className="space-y-2">
                    <Progress value={testProgress} className="w-full" />
                    <p className="text-sm text-gray-500 text-center">Diagnostic en cours...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {testResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Résultats du Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(result.status)}
                          <div>
                            <p className="font-medium">{result.test}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{result.message}</p>
                            {result.details && <p className="text-xs text-gray-500 mt-1">{result.details}</p>}
                          </div>
                        </div>
                        <Badge className={getStatusColor(result.status)}>{getStatusLabel(result.status)}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="status" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Printer className="h-5 w-5" />
                    État de la Connexion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      {connectionType === "usb" && <Usb className="h-5 w-5" />}
                      {connectionType === "wifi" && <Wifi className="h-5 w-5" />}
                      {connectionType === "bluetooth" && <Bluetooth className="h-5 w-5" />}
                      <span className="font-medium">Connexion {connectionType.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(printerStatus.connection)}
                      <Badge className={getStatusColor(printerStatus.connection)}>
                        {getStatusLabel(printerStatus.connection)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <span className="font-medium">Pilotes d'imprimante</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(printerStatus.driver)}
                      <Badge className={getStatusColor(printerStatus.driver)}>
                        {getStatusLabel(printerStatus.driver)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    État Physique
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <span className="font-medium">Niveau de papier</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(printerStatus.paper)}
                      <Badge className={getStatusColor(printerStatus.paper)}>
                        {getStatusLabel(printerStatus.paper)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Thermometer className="h-5 w-5" />
                      <span className="font-medium">Température</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(printerStatus.temperature)}
                      <Badge className={getStatusColor(printerStatus.temperature)}>
                        {getStatusLabel(printerStatus.temperature)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {printerStatus.connection === "connected" && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions Disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    <Button
                      onClick={printTestPage}
                      disabled={isPrinting}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {isPrinting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Impression...
                        </>
                      ) : (
                        <>
                          <Printer className="h-4 w-4 mr-2" />
                          Imprimer Page de Test
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={runConnectionTest} className="flex-1 bg-transparent">
                      <Zap className="h-4 w-4 mr-2" />
                      Nouveau Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="preview" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Aperçu de la Page de Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white border-2 border-dashed border-gray-300 p-6 rounded-lg font-mono text-sm">
                  <div className="text-center mb-4">
                    <h3 className="font-bold text-lg">═══ PAGE DE TEST TPE ═══</h3>
                    <p className="text-xs text-gray-600">Crypto Store Lausanne</p>
                  </div>

                  <div className="border-t border-b border-gray-300 py-3 my-4">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <strong>Date:</strong> {new Date().toLocaleDateString("fr-CH")}
                      </div>
                      <div>
                        <strong>Heure:</strong> {new Date().toLocaleTimeString("fr-CH")}
                      </div>
                      <div>
                        <strong>Terminal:</strong> TPE-001
                      </div>
                      <div>
                        <strong>Version:</strong> 2.1.4
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span>Test d'impression:</span>
                      <span>✓ RÉUSSI</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Qualité d'impression:</span>
                      <span>EXCELLENTE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Alignement:</span>
                      <span>CORRECT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contraste:</span>
                      <span>OPTIMAL</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-300">
                    <div className="text-center text-xs">
                      <p>Test Pattern: ████████████████</p>
                      <p>Barcode: ||||| ||||| |||||</p>
                      <p className="mt-2">Si cette page s'imprime correctement,</p>
                      <p>votre imprimante fonctionne parfaitement.</p>
                    </div>
                  </div>

                  <div className="text-center mt-4 text-xs text-gray-500">
                    <p>═══════════════════════════════</p>
                    <p>Fin du test d'impression</p>
                  </div>
                </div>

                <Alert className="mt-4">
                  <Printer className="h-4 w-4" />
                  <AlertDescription>
                    Cette page de test permet de vérifier la qualité d'impression, l'alignement et le bon fonctionnement
                    de tous les éléments de l'imprimante.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
