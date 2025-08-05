"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Language } from "@/lib/i18n"
import { getTranslation } from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  isLanguageSelected: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr")
  const [isLanguageSelected, setIsLanguageSelected] = useState(false)

  useEffect(() => {
    // Check if language was previously selected
    const savedLanguage = localStorage.getItem("selected-language") as Language
    const languageSelected = localStorage.getItem("language-selected") === "true"

    if (savedLanguage && languageSelected) {
      setLanguageState(savedLanguage)
      setIsLanguageSelected(true)
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    setIsLanguageSelected(true)
    localStorage.setItem("selected-language", newLanguage)
    localStorage.setItem("language-selected", "true")
  }

  const t = (key: string): string => {
    const translations = getTranslation(language)
    const keys = key.split(".")
    let value: any = translations

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLanguageSelected }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
