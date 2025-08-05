"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, Phone, MessageCircle, AlertCircle, CheckCircle, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import emailjs from "@emailjs/browser"

interface SupportContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SupportContactModal({ isOpen, onClose }: SupportContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const { toast } = useToast()

  const categories = [
    { value: "technical", label: "Problème technique" },
    { value: "account", label: "Compte et sécurité" },
    { value: "transaction", label: "Transaction" },
    { value: "feature", label: "Demande de fonctionnalité" },
    { value: "other", label: "Autre" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      // Configuration EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        category: categories.find((cat) => cat.value === formData.category)?.label || "Non spécifié",
        message: formData.message,
        to_email: "support@cryptowallet.com", // Remplacez par votre email
      }

      // Envoi via EmailJS
      await emailjs.send(
        "service_crypto_wallet", // Remplacez par votre Service ID
        "template_support", // Remplacez par votre Template ID
        templateParams,
        "your_public_key", // Remplacez par votre Public Key
      )

      setSubmitStatus("success")
      toast({
        title: "Message envoyé !",
        description: "Nous vous répondrons dans les plus brefs délais.",
      })

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "",
          message: "",
        })
        setSubmitStatus("idle")
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error)
      setSubmitStatus("error")
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MessageCircle className="h-5 w-5" />
            Contacter le support
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Email</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">support@cryptowallet.com</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Téléphone</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">+41 22 123 45 67</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Chat</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Lun-Ven 9h-18h</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom complet *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Votre nom"
                  disabled={isSubmitting}
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
                />
              </div>
            </div>

            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject">Sujet *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Résumé de votre demande"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Décrivez votre problème ou votre question en détail..."
                className="min-h-[120px] resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                </AlertDescription>
              </Alert>
            )}

            {submitStatus === "error" && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  Une erreur s'est produite lors de l'envoi. Veuillez réessayer ou nous contacter directement.
                </AlertDescription>
              </Alert>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-transparent"
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting || submitStatus === "success"} className="flex-1">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Additional Info */}
          <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t">
            <p>
              Temps de réponse moyen : <strong>2-4 heures</strong> en jours ouvrables
            </p>
            <p className="mt-1">Pour les urgences, appelez-nous directement au +41 22 123 45 67</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
