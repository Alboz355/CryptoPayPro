"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, Mail, MessageCircle, CheckCircle, AlertCircle, Send, Clock, Users, Shield } from "lucide-react"
import emailjs from "@emailjs/browser"
import { useLanguage } from "@/contexts/language-context"

interface SupportContactModalProps {
  trigger?: React.ReactNode
}

export function SupportContactModal({ trigger }: SupportContactModalProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const categories = [
    { value: "technical", label: "Problème technique", icon: "🔧" },
    { value: "account", label: "Compte et sécurité", icon: "🔐" },
    { value: "transaction", label: "Transaction", icon: "💸" },
    { value: "feature", label: "Demande de fonctionnalité", icon: "✨" },
    { value: "bug", label: "Signaler un bug", icon: "🐛" },
    { value: "other", label: "Autre", icon: "💬" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (submitStatus !== "idle") {
      setSubmitStatus("idle")
      setErrorMessage("")
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) return "Le nom est requis"
    if (!formData.email.trim()) return "L'email est requis"
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return "Email invalide"
    if (!formData.subject.trim()) return "Le sujet est requis"
    if (!formData.category) return "Veuillez sélectionner une catégorie"
    if (!formData.message.trim()) return "Le message est requis"
    if (formData.message.length < 10) return "Le message doit contenir au moins 10 caractères"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setSubmitStatus("error")
      setErrorMessage(validationError)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const selectedCategory = categories.find((cat) => cat.value === formData.category)

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        category: selectedCategory ? `${selectedCategory.icon} ${selectedCategory.label}` : formData.category,
        message: formData.message,
        to_email: "leartshabija@gmail.com",
        reply_to: formData.email,
      }

      await emailjs.send("service_0cen23r", "template_bg97ynr", templateParams, "yfMJVUvA62CKF7Div")

      setSubmitStatus("success")
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      })

      // Fermer le modal après 2 secondes
      setTimeout(() => {
        setIsOpen(false)
        setSubmitStatus("idle")
      }, 2000)
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error)
      setSubmitStatus("error")
      setErrorMessage("Erreur lors de l'envoi du message. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    })
    setSubmitStatus("idle")
    setErrorMessage("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2 bg-transparent">
            <HelpCircle className="h-4 w-4" />
            {t.support.contact}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">Centre d'aide et support</DialogTitle>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Notre équipe est là pour vous aider 24h/24 et 7j/7
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Informations de contact */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  Moyens de contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Email</p>
                    <p className="text-sm text-blue-600 dark:text-blue-300">leartshabija@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Temps de réponse</p>
                    <p className="text-sm text-green-600 dark:text-green-300">Sous 24h en moyenne</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="font-medium text-purple-800 dark:text-purple-200">Support</p>
                    <p className="text-sm text-purple-600 dark:text-purple-300">Équipe dédiée</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-emerald-500" />
                  Nos engagements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm">Confidentialité garantie</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm">Support technique expert</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm">Réponse rapide</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm">Suivi personnalisé</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulaire de contact */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Send className="h-5 w-5 text-blue-500" />
                  Envoyer un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Votre nom"
                        disabled={isSubmitting}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="votre@email.com"
                        disabled={isSubmitting}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="Résumé de votre demande"
                      disabled={isSubmitting}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <span className="flex items-center gap-2">
                              <span>{category.icon}</span>
                              {category.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Décrivez votre problème ou votre question en détail..."
                      disabled={isSubmitting}
                      className="mt-1 min-h-[120px] resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">{formData.message.length}/500 caractères</p>
                  </div>

                  {submitStatus === "error" && (
                    <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 dark:text-red-200">{errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  {submitStatus === "success" && (
                    <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || submitStatus === "success"}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                      Effacer
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          <p>🔒 Vos données sont protégées et ne seront jamais partagées avec des tiers</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
