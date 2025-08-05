"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Shield, Zap, Globe, ArrowRight, Smartphone, CheckCircle } from "lucide-react"

interface AppPresentationProps {
  onComplete: () => void
}

export function AppPresentation({ onComplete }: AppPresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      icon: Wallet,
      title: "Bienvenue dans CryptoPay",
      subtitle: "Votre portefeuille crypto nouvelle génération",
      description: "Gérez vos cryptomonnaies en toute sécurité avec une interface moderne et intuitive.",
      gradient: "from-blue-500 to-purple-600 dark:from-purple-500 dark:to-pink-600",
      features: ["Interface intuitive", "Sécurité maximale", "Multi-devises"],
    },
    {
      icon: Shield,
      title: "Sécurité Avancée",
      subtitle: "Protection de niveau bancaire",
      description: "Vos clés privées sont chiffrées localement et ne quittent jamais votre appareil.",
      gradient: "from-green-500 to-emerald-600 dark:from-emerald-500 dark:to-teal-600",
      features: ["Chiffrement local", "Code PIN", "Phrase de récupération"],
    },
    {
      icon: Zap,
      title: "Transactions Rapides",
      subtitle: "Envoyez et recevez instantanément",
      description: "Effectuez des transactions crypto en quelques secondes avec des frais optimisés.",
      gradient: "from-orange-500 to-red-600 dark:from-red-500 dark:to-pink-600",
      features: ["Transactions rapides", "Frais optimisés", "Confirmation instantanée"],
    },
    {
      icon: Globe,
      title: "Multi-Blockchain",
      subtitle: "Bitcoin, Ethereum, Algorand et plus",
      description: "Gérez plusieurs cryptomonnaies depuis une seule application.",
      gradient: "from-purple-500 to-indigo-600 dark:from-indigo-500 dark:to-purple-600",
      features: ["Bitcoin (BTC)", "Ethereum (ETH)", "Algorand (ALGO)"],
    },
    {
      icon: Smartphone,
      title: "Mode TPE Intégré",
      subtitle: "Acceptez les paiements crypto",
      description: "Transformez votre appareil en terminal de paiement pour votre commerce.",
      gradient: "from-teal-500 to-cyan-600 dark:from-cyan-500 dark:to-blue-600",
      features: ["Terminal de paiement", "QR codes", "Gestion des ventes"],
    },
  ]

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900 p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {/* Main Content */}
              <div className="p-8 md:p-12 text-center">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${currentSlideData.gradient} rounded-full mb-6 shadow-lg`}
                >
                  <currentSlideData.icon className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                  {currentSlideData.title}
                </h1>

                <h2 className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-6">
                  {currentSlideData.subtitle}
                </h2>

                <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  {currentSlideData.description}
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
                  {currentSlideData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center space-x-2 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center space-x-2 mb-8">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleSlideChange(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? `bg-gradient-to-r ${currentSlideData.gradient} scale-125`
                          : "bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {currentSlide < slides.length - 1 ? (
                    <>
                      <Button
                        onClick={nextSlide}
                        className={`bg-gradient-to-r ${currentSlideData.gradient} hover:opacity-90 text-white px-8 py-3 text-lg`}
                        size="lg"
                      >
                        Suivant
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      <Button
                        onClick={onComplete}
                        variant="outline"
                        className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 px-8 py-3 text-lg bg-transparent"
                        size="lg"
                      >
                        Passer l'introduction
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={onComplete}
                      className={`bg-gradient-to-r ${currentSlideData.gradient} hover:opacity-90 text-white px-12 py-4 text-xl`}
                      size="lg"
                    >
                      Commencer
                      <ArrowRight className="w-6 h-6 ml-2" />
                    </Button>
                  )}
                </div>

                {/* Navigation arrows for manual control */}
                {slides.length > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <Button
                      onClick={prevSlide}
                      disabled={currentSlide === 0}
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 dark:text-slate-400 disabled:opacity-30"
                    >
                      ← Précédent
                    </Button>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {currentSlide + 1} / {slides.length}
                    </span>
                    <Button
                      onClick={nextSlide}
                      disabled={currentSlide === slides.length - 1}
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 dark:text-slate-400 disabled:opacity-30"
                    >
                      Suivant →
                    </Button>
                  </div>
                )}
              </div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-purple-500 dark:to-pink-600" />
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Info */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Sécurisé • Open Source • Décentralisé</p>
        </div>
      </div>
    </div>
  )
}
