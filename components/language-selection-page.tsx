"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import type { Language } from "@/lib/i18n"

interface LanguageSelectionPageProps {
  onLanguageSelect: (language: Language) => void
}

export function LanguageSelectionPage({ onLanguageSelect }: LanguageSelectionPageProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const availableLanguages = [
    { code: "fr" as Language, flag: "🇫🇷", name: "Français", country: "France", fallback: "FR" },
    { code: "en" as Language, flag: "🇬🇧", name: "English", country: "United Kingdom", fallback: "GB" },
    { code: "de" as Language, flag: "🇩🇪", name: "Deutsch", country: "Deutschland", fallback: "DE" },
    { code: "it" as Language, flag: "🇮🇹", name: "Italiano", country: "Italia", fallback: "IT" },
    { code: "es" as Language, flag: "🇪🇸", name: "Español", country: "España", fallback: "ES" },
    { code: "al" as Language, flag: "🇦🇱", name: "Shqip", country: "Shqipëria", fallback: "AL" },
  ]

  const futureLanguages = [
    { flag: "🇵🇹", name: "Português", country: "Portugal", fallback: "PT" },
    { flag: "🇳🇱", name: "Nederlands", country: "Nederland", fallback: "NL" },
    { flag: "🇷🇺", name: "Русский", country: "Россия", fallback: "RU" },
    { flag: "🇨🇳", name: "中文", country: "中国", fallback: "CN" },
    { flag: "🇯🇵", name: "日本語", country: "日本", fallback: "JP" },
    { flag: "🇰🇷", name: "한국어", country: "대한민국", fallback: "KR" },
  ]

  const handleLanguageSelect = async (language: Language) => {
    setSelectedLanguage(language)
    setIsLoading(true)

    // Simulate loading time for better UX
    await new Promise((resolve) => setTimeout(resolve, 1200))

    onLanguageSelect(language)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="text-8xl mb-4">🌍</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">Choose your language</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select your preferred language to continue with the best experience
            </p>
          </div>
        </div>

        {/* Available Languages */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Available Languages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableLanguages.map((lang) => (
              <Card
                key={lang.code}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-2 ${
                  selectedLanguage === lang.code
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-2xl"
                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                } bg-white dark:bg-gray-800`}
                onClick={() => !isLoading && handleLanguageSelect(lang.code)}
              >
                <CardContent className="p-6 text-center">
                  {selectedLanguage === lang.code && isLoading ? (
                    <div className="flex flex-col items-center space-y-4">
                      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">Loading...</p>
                    </div>
                  ) : (
                    <>
                      {/* Large Flag with Fallback */}
                      <div className="mb-4 flex items-center justify-center">
                        <div
                          className="text-8xl drop-shadow-lg"
                          style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}
                        >
                          {lang.flag}
                        </div>
                        <Badge variant="secondary" className="ml-2 text-lg font-bold px-3 py-1 shadow-md">
                          {lang.fallback}
                        </Badge>
                      </div>

                      {/* Language Info */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{lang.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{lang.country}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Future Languages */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Other Languages</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {futureLanguages.map((lang, index) => (
              <Card
                key={index}
                className="border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 opacity-60"
              >
                <CardContent className="p-4 text-center">
                  {/* Flag with Fallback */}
                  <div className="mb-3 flex items-center justify-center">
                    <div
                      className="text-4xl grayscale"
                      style={{ filter: "grayscale(100%) drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                    >
                      {lang.flag}
                    </div>
                    <Badge variant="outline" className="ml-1 text-xs font-bold px-2 py-1">
                      {lang.fallback}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{lang.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{lang.country}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-6">
            <Button disabled className="px-8 py-3 text-lg">
              Coming Soon...
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>More languages will be available soon. Stay tuned! 🚀</p>
        </div>
      </div>
    </div>
  )
}
