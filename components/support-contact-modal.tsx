"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Mail,
  Phone,
  MessageCircle,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Globe,
  HelpCircle,
  Bug,
  CreditCard,
  Shield,
} from "lucide-react"
import emailjs from "@emailjs/browser"
import { toast } from "sonner"

interface SupportContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SupportContactModal({ isOpen, onClose }: SupportContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
    priority: "normal",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const categories = [
    { id: "general", label: "Question générale", icon: HelpCircle, color: "text-blue-600" },
    { id: "technical", label: "Problème technique", icon: Bug, color: "text-red-600" },
    { id: "payment", label: "Paiement", icon: CreditCard, color: "text-green-600" },
    { id: "security", label: "Sécurité", icon: Shield, color: "text-purple-600" },
  ]

  const priorities = [
    { id: "low", label: "Faible", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200" },
    { id: "normal", label: "Normal", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200" },
    { id: "high", label: "Élevée", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200" },
    { id: "urgent", label: "Urgent", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Configuration EmailJS avec vos vraies clés
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        category: categories.find((c) => c.id === formData.category)?.label || formData.category,
        priority: priorities.find((p) => p.id === formData.priority)?.label || formData.priority,
        message: formData.message,
        to_email: "leartshabija@gmail.com",
      }

      await emailjs.send(
        "service_0cen23r", // Votre Service ID
        "template_bg97ynr", // Votre Template ID
        templateParams,
        "yfMJVUvA62CKF7Div", // Votre Public Key
      )

      setSubmitStatus("success")
      toast.success("Message envoyé avec succès !")

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "general",
        message: "",
        priority: "normal",
      })

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
        setSubmitStatus("idle")
      }, 2000)
    } catch (error) {
      console.error("Erreur EmailJS:", error)
      setSubmitStatus("error")
      toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategory = categories.find((c) => c.id === formData.category)
  const selectedPriority = priorities.find((p) => p.id === formData.priority)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <MessageCircle className="h-6 w-6 text-emerald-600" />
            Contacter le support
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Envoyer un message
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Informations de contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="space-y-6 mt-6">
            {submitStatus === "success" ? (
              <Alert className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 dark:border-emerald-700">
                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <AlertDescription className="text-emerald-800 dark:text-emerald-200">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">Message envoyé avec succès !</h3>
                    <p>Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.</p>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Votre nom complet"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="votre@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    placeholder="Résumé de votre demande"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((category) => {
                        const Icon = category.icon
                        return (
                          <Button
                            key={category.id}
                            type="button"
                            variant={formData.category === category.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleInputChange("category", category.id)}
                            disabled={isSubmitting}
                            className="justify-start"
                          >
                            <Icon className={`h-4 w-4 mr-2 ${category.color}`} />
                            {category.label}
                          </Button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Priorité</Label>
                    <div className="flex flex-wrap gap-2">
                      {priorities.map((priority) => (
                        <Badge
                          key={priority.id}
                          variant={formData.priority === priority.id ? "default" : "outline"}
                          className={`cursor-pointer ${formData.priority === priority.id ? priority.color : ""}`}
                          onClick={() => !isSubmitting && handleInputChange("priority", priority.id)}
                        >
                          {priority.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Décrivez votre problème ou votre question en détail..."
                    className="min-h-[120px] resize-none"
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formData.message.length}/1000 caractères</p>
                </div>

                {submitStatus === "error" && (
                  <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 dark:border-red-700">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      Une erreur s'est produite lors de l'envoi. Veuillez réessayer ou nous contacter directement.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
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
                  <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                    Annuler
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>

          <TabsContent value="info" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="h-5 w-5 text-emerald-600" />
                  Contact direct
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Mail className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">leartshabija@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium">Site web</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">cryptopaypro.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-600" />
                  Horaires de support
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-700">
                    <p className="font-medium text-emerald-800 dark:text-emerald-200">Lundi - Vendredi</p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">9h00 - 18h00 (CET)</p>
                  </div>
                  <div className="p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-700">
                    <p className="font-medium text-teal-800 dark:text-teal-200">Weekend</p>
                    <p className="text-sm text-teal-700 dark:text-teal-300">Support limité</p>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-700">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                <strong>Temps de réponse moyen :</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Questions générales : 24-48h</li>
                  <li>• Problèmes techniques : 12-24h</li>
                  <li>• Urgences sécurité : 2-6h</li>
                </ul>
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
