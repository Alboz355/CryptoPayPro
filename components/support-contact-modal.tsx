"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { HelpCircle, Send, CheckCircle, AlertCircle, Mail, MessageSquare, Bug, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import emailjs from "@emailjs/browser"

interface SupportContactModalProps {
  children: React.ReactNode
}

export function SupportContactModal({ children }: SupportContactModalProps) {
  const [open, setOpen] = useState(false)
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
    { value: "bug", label: "Signaler un bug", icon: Bug, color: "bg-red-500" },
    { value: "feature", label: "Demande de fonctionnalité", icon: Lightbulb, color: "bg-yellow-500" },
    { value: "support", label: "Support technique", icon: HelpCircle, color: "bg-blue-500" },
    { value: "general", label: "Question générale", icon: MessageSquare, color: "bg-green-500" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (submitStatus !== "idle") {
      setSubmitStatus("idle")
    }
  }

  const validateForm = () => {
    const { name, email, subject, category, message } = formData

    if (!name.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez saisir votre nom",
        variant: "destructive",
      })
      return false
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez saisir une adresse email valide",
        variant: "destructive",
      })
      return false
    }

    if (!subject.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez saisir un sujet",
        variant: "destructive",
      })
      return false
    }

    if (!category) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez sélectionner une catégorie",
        variant: "destructive",
      })
      return false
    }

    if (!message.trim() || message.trim().length < 10) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez saisir un message d'au moins 10 caractères",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const selectedCategory = categories.find((cat) => cat.value === formData.category)

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        category: selectedCategory?.label || formData.category,
        message: formData.message,
        to_email: "leartshabija@gmail.com",
        timestamp: new Date().toLocaleString("fr-CH"),
      }

      await emailjs.send(
        "service_0cen23r", // Service ID
        "template_bg97ynr", // Template ID
        templateParams,
        "yfMJVUvA62CKF7Div", // Public Key
      )

      setSubmitStatus("success")
      toast({
        title: "Message envoyé !",
        description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
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
        setOpen(false)
      }, 2000)
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error)
      setSubmitStatus("error")
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedCategory = categories.find((cat) => cat.value === formData.category)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="h-6 w-6 text-primary" />
            Contacter le support
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                placeholder="Votre nom"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Sujet *</Label>
            <Input
              id="subject"
              placeholder="Résumé de votre demande"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
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
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4" />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCategory && (
              <Badge variant="outline" className="w-fit">
                <selectedCategory.icon className="h-3 w-3 mr-1" />
                {selectedCategory.label}
              </Badge>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder="Décrivez votre problème ou votre question en détail..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              disabled={isSubmitting}
              rows={6}
              className="resize-none"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Minimum 10 caractères</span>
              <span>{formData.message.length} caractères</span>
            </div>
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
            <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Une erreur est survenue lors de l'envoi. Veuillez réessayer ou nous contacter directement à
                leartshabija@gmail.com
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || submitStatus === "success"} className="flex-1">
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Envoi en cours...
                </>
              ) : submitStatus === "success" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Envoyé !
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer le message
                </>
              )}
            </Button>
          </div>

          {/* Footer Info */}
          <div className="text-xs text-muted-foreground text-center pt-4 border-t">
            <p>💡 Temps de réponse habituel : 24-48h • Email direct : leartshabija@gmail.com</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
