export type Language = "fr" | "en" | "de" | "it" | "es" | "al"

export interface Translations {
  // Language selection
  languageSelection: {
    title: string
    subtitle: string
    selectLanguage: string
    availableLanguages: string
    otherLanguages: string
    comingSoon: string
    languages: {
      fr: string
      en: string
      de: string
      it: string
      es: string
      al: string
    }
  }

  // Onboarding
  onboarding: {
    title: string
    subtitle: string
    userTypeSelection: {
      title: string
      subtitle: string
      client: {
        title: string
        description: string
      }
      merchant: {
        title: string
        description: string
      }
    }
    walletCreation: {
      title: string
      subtitle: string
      generating: string
      success: string
      continue: string
    }
  }

  // Dashboard
  dashboard: {
    title: string
    subtitle: string
    professionalTitle: string
    professionalSubtitle: string
    totalBalance: string
    portfolio: string
    recentTransactions: string
    quickActions: {
      send: string
      receive: string
      buy: string
      tpeMode: string
    }
    transactions: {
      viewAll: string
      received: string
      sent: string
      completed: string
      pending: string
      failed: string
    }
    statistics: {
      monthlyTransactions: string
      volumeExchanged: string
      monthlyGoal: string
    }
  }

  // Settings
  settings: {
    title: string
    tabs: {
      general: string
      security: string
      notifications: string
      advanced: string
    }
    general: {
      appearance: string
      theme: {
        light: string
        dark: string
        system: string
      }
      language: string
      currency: string
      userType: string
      userTypes: {
        individual: string
        business: string
        merchant: string
      }
    }
    security: {
      title: string
      pin: string
      changePinDescription: string
      changePin: string
      seedPhrase: string
      seedPhraseDescription: string
      viewPhrase: string
      biometrics: string
      biometricsDescription: string
      autoLock: string
      autoLockOptions: {
        oneMinute: string
        fiveMinutes: string
        fifteenMinutes: string
        thirtyMinutes: string
        never: string
      }
    }
    notifications: {
      title: string
      priceAlerts: string
      priceAlertsDescription: string
      transactions: string
      transactionsDescription: string
      security: string
      securityDescription: string
      marketing: string
      marketingDescription: string
    }
    advanced: {
      backupRecovery: string
      exportWallet: string
      exportDescription: string
      technicalSupport: string
      supportDescription: string
    }
    dangerZone: {
      title: string
      deleteWallet: string
      deleteDescription: string
      deleteConfirm: string
      deleteWarning: string
      deleteButton: string
    }
    messages: {
      settingsSaved: string
      settingsUpdated: string
      backupExported: string
      walletBackedUp: string
      walletDeleted: string
      dataCleared: string
    }
  }

  // Time
  time: {
    minute: string
    minutes: string
    hour: string
    hours: string
    day: string
    days: string
    ago: string
    thisMonth: string
  }

  // TPE
  tpe: {
    stats: {
      clients: string
    }
  }

  // Common
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    confirm: string
    continue: string
    back: string
    next: string
    finish: string
    save: string
    export: string
    copy: string
    paste: string
    done: string
  }
}

const translations: Record<Language, Translations> = {
  fr: {
    languageSelection: {
      title: "Choisissez votre langue",
      subtitle: "Sélectionnez la langue de votre choix pour continuer",
      selectLanguage: "Sélectionner la langue",
      availableLanguages: "Langues disponibles",
      otherLanguages: "Autres langues",
      comingSoon: "Bientôt disponible...",
      languages: {
        fr: "Français (France)",
        en: "English (United Kingdom)",
        de: "Deutsch (Deutschland)",
        it: "Italiano (Italia)",
        es: "Español (España)",
        al: "Shqip (Shqipëria)",
      },
    },
    onboarding: {
      title: "Crypto Wallet",
      subtitle: "Votre portefeuille crypto sécurisé et professionnel",
      userTypeSelection: {
        title: "Quel type d'utilisateur êtes-vous ?",
        subtitle: "Choisissez le profil qui correspond le mieux à vos besoins",
        client: {
          title: "Client Particulier",
          description: "Gérez vos cryptomonnaies personnelles en toute sécurité",
        },
        merchant: {
          title: "Commerçant",
          description: "Acceptez les paiements crypto dans votre commerce",
        },
      },
      walletCreation: {
        title: "Création de votre portefeuille",
        subtitle: "Génération sécurisée de vos clés privées",
        generating: "Génération en cours...",
        success: "Portefeuille créé avec succès !",
        continue: "Continuer",
      },
    },
    dashboard: {
      title: "Tableau de bord",
      subtitle: "Gérez vos cryptomonnaies",
      professionalTitle: "Tableau de bord professionnel",
      professionalSubtitle: "Gérez votre activité crypto",
      totalBalance: "Solde total",
      portfolio: "Portefeuille",
      recentTransactions: "Transactions récentes",
      quickActions: {
        send: "Envoyer",
        receive: "Recevoir",
        buy: "Acheter",
        tpeMode: "Mode TPE",
      },
      transactions: {
        viewAll: "Voir tout",
        received: "Reçu",
        sent: "Envoyé",
        completed: "Terminé",
        pending: "En attente",
        failed: "Échoué",
      },
      statistics: {
        monthlyTransactions: "Transactions mensuelles",
        volumeExchanged: "Volume échangé",
        monthlyGoal: "Objectif mensuel",
      },
    },
    settings: {
      title: "Paramètres",
      tabs: {
        general: "Général",
        security: "Sécurité",
        notifications: "Notifications",
        advanced: "Avancé",
      },
      general: {
        appearance: "Apparence",
        theme: {
          light: "Clair",
          dark: "Sombre",
          system: "Système",
        },
        language: "Langue",
        currency: "Devise",
        userType: "Type d'utilisateur",
        userTypes: {
          individual: "Particulier",
          business: "Entreprise",
          merchant: "Commerçant",
        },
      },
      security: {
        title: "Sécurité",
        pin: "Code PIN",
        changePinDescription: "Modifier votre code PIN",
        changePin: "Changer PIN",
        seedPhrase: "Phrase de récupération",
        seedPhraseDescription: "Afficher votre phrase secrète",
        viewPhrase: "Voir phrase",
        biometrics: "Biométrie",
        biometricsDescription: "Utiliser l'empreinte digitale",
        autoLock: "Verrouillage automatique",
        autoLockOptions: {
          oneMinute: "1 minute",
          fiveMinutes: "5 minutes",
          fifteenMinutes: "15 minutes",
          thirtyMinutes: "30 minutes",
          never: "Jamais",
        },
      },
      notifications: {
        title: "Notifications",
        priceAlerts: "Alertes de prix",
        priceAlertsDescription: "Notifications des variations de prix",
        transactions: "Transactions",
        transactionsDescription: "Confirmations de transactions",
        security: "Sécurité",
        securityDescription: "Alertes de sécurité",
        marketing: "Marketing",
        marketingDescription: "Offres et promotions",
      },
      advanced: {
        backupRecovery: "Sauvegarde et récupération",
        exportWallet: "Exporter le portefeuille",
        exportDescription: "Sauvegarder vos données",
        technicalSupport: "Support technique",
        supportDescription: "Contacter l'assistance",
      },
      dangerZone: {
        title: "Zone dangereuse",
        deleteWallet: "Supprimer le portefeuille",
        deleteDescription: "Cette action est irréversible. Toutes vos données seront définitivement supprimées.",
        deleteConfirm: "Êtes-vous absolument sûr ?",
        deleteWarning: "Cette action ne peut pas être annulée. Cela supprimera définitivement votre portefeuille.",
        deleteButton: "Oui, supprimer définitivement",
      },
      messages: {
        settingsSaved: "Paramètres sauvegardés",
        settingsUpdated: "Vos préférences ont été mises à jour",
        backupExported: "Sauvegarde exportée",
        walletBackedUp: "Votre portefeuille a été sauvegardé",
        walletDeleted: "Portefeuille supprimé",
        dataCleared: "Toutes les données ont été effacées",
      },
    },
    time: {
      minute: "minute",
      minutes: "minutes",
      hour: "heure",
      hours: "heures",
      day: "jour",
      days: "jours",
      ago: "il y a",
      thisMonth: "ce mois",
    },
    tpe: {
      stats: {
        clients: "Clients",
      },
    },
    common: {
      loading: "Chargement...",
      error: "Erreur",
      success: "Succès",
      cancel: "Annuler",
      confirm: "Confirmer",
      continue: "Continuer",
      back: "Retour",
      next: "Suivant",
      finish: "Terminer",
      save: "Sauvegarder",
      export: "Exporter",
      copy: "Copier",
      paste: "Coller",
      done: "Terminé",
    },
  },
  en: {
    languageSelection: {
      title: "Choose your language",
      subtitle: "Select your preferred language to continue",
      selectLanguage: "Select language",
      availableLanguages: "Available languages",
      otherLanguages: "Other languages",
      comingSoon: "Coming soon...",
      languages: {
        fr: "Français (France)",
        en: "English (United Kingdom)",
        de: "Deutsch (Deutschland)",
        it: "Italiano (Italia)",
        es: "Español (España)",
        al: "Shqip (Shqipëria)",
      },
    },
    onboarding: {
      title: "Crypto Wallet",
      subtitle: "Your secure and professional crypto wallet",
      userTypeSelection: {
        title: "What type of user are you?",
        subtitle: "Choose the profile that best fits your needs",
        client: {
          title: "Individual Client",
          description: "Manage your personal cryptocurrencies securely",
        },
        merchant: {
          title: "Merchant",
          description: "Accept crypto payments in your business",
        },
      },
      walletCreation: {
        title: "Creating your wallet",
        subtitle: "Secure generation of your private keys",
        generating: "Generating...",
        success: "Wallet created successfully!",
        continue: "Continue",
      },
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Manage your cryptocurrencies",
      professionalTitle: "Professional Dashboard",
      professionalSubtitle: "Manage your crypto business",
      totalBalance: "Total Balance",
      portfolio: "Portfolio",
      recentTransactions: "Recent Transactions",
      quickActions: {
        send: "Send",
        receive: "Receive",
        buy: "Buy",
        tpeMode: "POS Mode",
      },
      transactions: {
        viewAll: "View All",
        received: "Received",
        sent: "Sent",
        completed: "Completed",
        pending: "Pending",
        failed: "Failed",
      },
      statistics: {
        monthlyTransactions: "Monthly Transactions",
        volumeExchanged: "Volume Exchanged",
        monthlyGoal: "Monthly Goal",
      },
    },
    settings: {
      title: "Settings",
      tabs: {
        general: "General",
        security: "Security",
        notifications: "Notifications",
        advanced: "Advanced",
      },
      general: {
        appearance: "Appearance",
        theme: {
          light: "Light",
          dark: "Dark",
          system: "System",
        },
        language: "Language",
        currency: "Currency",
        userType: "User Type",
        userTypes: {
          individual: "Individual",
          business: "Business",
          merchant: "Merchant",
        },
      },
      security: {
        title: "Security",
        pin: "PIN Code",
        changePinDescription: "Change your PIN code",
        changePin: "Change PIN",
        seedPhrase: "Recovery Phrase",
        seedPhraseDescription: "Show your secret phrase",
        viewPhrase: "View phrase",
        biometrics: "Biometrics",
        biometricsDescription: "Use fingerprint",
        autoLock: "Auto Lock",
        autoLockOptions: {
          oneMinute: "1 minute",
          fiveMinutes: "5 minutes",
          fifteenMinutes: "15 minutes",
          thirtyMinutes: "30 minutes",
          never: "Never",
        },
      },
      notifications: {
        title: "Notifications",
        priceAlerts: "Price alerts",
        priceAlertsDescription: "Price change notifications",
        transactions: "Transactions",
        transactionsDescription: "Transaction confirmations",
        security: "Security",
        securityDescription: "Security alerts",
        marketing: "Marketing",
        marketingDescription: "Offers and promotions",
      },
      advanced: {
        backupRecovery: "Backup and recovery",
        exportWallet: "Export wallet",
        exportDescription: "Backup your data",
        technicalSupport: "Technical support",
        supportDescription: "Contact support",
      },
      dangerZone: {
        title: "Danger Zone",
        deleteWallet: "Delete Wallet",
        deleteDescription: "This action is irreversible. All your data will be permanently deleted.",
        deleteConfirm: "Are you absolutely sure?",
        deleteWarning: "This action cannot be undone. This will permanently delete your wallet.",
        deleteButton: "Yes, delete permanently",
      },
      messages: {
        settingsSaved: "Settings saved",
        settingsUpdated: "Your preferences have been updated",
        backupExported: "Backup exported",
        walletBackedUp: "Your wallet has been backed up",
        walletDeleted: "Wallet deleted",
        dataCleared: "All data has been cleared",
      },
    },
    time: {
      minute: "minute",
      minutes: "minutes",
      hour: "hour",
      hours: "hours",
      day: "day",
      days: "days",
      ago: "ago",
      thisMonth: "this month",
    },
    tpe: {
      stats: {
        clients: "Clients",
      },
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      confirm: "Confirm",
      continue: "Continue",
      back: "Back",
      next: "Next",
      finish: "Finish",
      save: "Save",
      export: "Export",
      copy: "Copy",
      paste: "Paste",
      done: "Done",
    },
  },
  de: {
    languageSelection: {
      title: "Wählen Sie Ihre Sprache",
      subtitle: "Wählen Sie Ihre bevorzugte Sprache zum Fortfahren",
      selectLanguage: "Sprache auswählen",
      availableLanguages: "Verfügbare Sprachen",
      otherLanguages: "Andere Sprachen",
      comingSoon: "Bald verfügbar...",
      languages: {
        fr: "Français (France)",
        en: "English (United Kingdom)",
        de: "Deutsch (Deutschland)",
        it: "Italiano (Italia)",
        es: "Español (España)",
        al: "Shqip (Shqipëria)",
      },
    },
    onboarding: {
      title: "Crypto Wallet",
      subtitle: "Ihre sichere und professionelle Krypto-Wallet",
      userTypeSelection: {
        title: "Welcher Benutzertyp sind Sie?",
        subtitle: "Wählen Sie das Profil, das am besten zu Ihren Bedürfnissen passt",
        client: {
          title: "Privatkunde",
          description: "Verwalten Sie Ihre persönlichen Kryptowährungen sicher",
        },
        merchant: {
          title: "Händler",
          description: "Akzeptieren Sie Krypto-Zahlungen in Ihrem Geschäft",
        },
      },
      walletCreation: {
        title: "Erstellen Ihrer Wallet",
        subtitle: "Sichere Generierung Ihrer privaten Schlüssel",
        generating: "Generierung läuft...",
        success: "Wallet erfolgreich erstellt!",
        continue: "Weiter",
      },
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Verwalten Sie Ihre Kryptowährungen",
      professionalTitle: "Professionelles Dashboard",
      professionalSubtitle: "Verwalten Sie Ihr Krypto-Geschäft",
      totalBalance: "Gesamtsaldo",
      portfolio: "Portfolio",
      recentTransactions: "Letzte Transaktionen",
      quickActions: {
        send: "Senden",
        receive: "Empfangen",
        buy: "Kaufen",
        tpeMode: "POS-Modus",
      },
      transactions: {
        viewAll: "Alle anzeigen",
        received: "Empfangen",
        sent: "Gesendet",
        completed: "Abgeschlossen",
        pending: "Ausstehend",
        failed: "Fehlgeschlagen",
      },
      statistics: {
        monthlyTransactions: "Monatliche Transaktionen",
        volumeExchanged: "Ausgetauschtes Volumen",
        monthlyGoal: "Monatliches Ziel",
      },
    },
    settings: {
      title: "Einstellungen",
      tabs: {
        general: "Allgemein",
        security: "Sicherheit",
        notifications: "Benachrichtigungen",
        advanced: "Erweitert",
      },
      general: {
        appearance: "Erscheinungsbild",
        theme: {
          light: "Hell",
          dark: "Dunkel",
          system: "System",
        },
        language: "Sprache",
        currency: "Währung",
        userType: "Benutzertyp",
        userTypes: {
          individual: "Privatperson",
          business: "Unternehmen",
          merchant: "Händler",
        },
      },
      security: {
        title: "Sicherheit",
        pin: "PIN-Code",
        changePinDescription: "Ändern Sie Ihren PIN-Code",
        changePin: "PIN ändern",
        seedPhrase: "Wiederherstellungsphrase",
        seedPhraseDescription: "Zeigen Sie Ihre geheime Phrase an",
        viewPhrase: "Phrase anzeigen",
        biometrics: "Biometrie",
        biometricsDescription: "Fingerabdruck verwenden",
        autoLock: "Automatische Sperre",
        autoLockOptions: {
          oneMinute: "1 Minute",
          fiveMinutes: "5 Minuten",
          fifteenMinutes: "15 Minuten",
          thirtyMinutes: "30 Minuten",
          never: "Nie",
        },
      },
      notifications: {
        title: "Benachrichtigungen",
        priceAlerts: "Preisalarme",
        priceAlertsDescription: "Benachrichtigungen bei Preisänderungen",
        transactions: "Transaktionen",
        transactionsDescription: "Transaktionsbestätigungen",
        security: "Sicherheit",
        securityDescription: "Sicherheitsalarme",
        marketing: "Marketing",
        marketingDescription: "Angebote und Aktionen",
      },
      advanced: {
        backupRecovery: "Sicherung und Wiederherstellung",
        exportWallet: "Wallet exportieren",
        exportDescription: "Ihre Daten sichern",
        technicalSupport: "Technischer Support",
        supportDescription: "Support kontaktieren",
      },
      dangerZone: {
        title: "Gefahrenzone",
        deleteWallet: "Wallet löschen",
        deleteDescription: "Diese Aktion ist irreversibel. Alle Ihre Daten werden dauerhaft gelöscht.",
        deleteConfirm: "Sind Sie absolut sicher?",
        deleteWarning: "Diese Aktion kann nicht rückgängig gemacht werden. Dies wird Ihre Wallet dauerhaft löschen.",
        deleteButton: "Ja, dauerhaft löschen",
      },
      messages: {
        settingsSaved: "Einstellungen gespeichert",
        settingsUpdated: "Ihre Einstellungen wurden aktualisiert",
        backupExported: "Sicherung exportiert",
        walletBackedUp: "Ihre Wallet wurde gesichert",
        walletDeleted: "Wallet gelöscht",
        dataCleared: "Alle Daten wurden gelöscht",
      },
    },
    time: {
      minute: "Minute",
      minutes: "Minuten",
      hour: "Stunde",
      hours: "Stunden",
      day: "Tag",
      days: "Tage",
      ago: "vor",
      thisMonth: "diesen Monat",
    },
    tpe: {
      stats: {
        clients: "Kunden",
      },
    },
    common: {
      loading: "Laden...",
      error: "Fehler",
      success: "Erfolg",
      cancel: "Abbrechen",
      confirm: "Bestätigen",
      continue: "Weiter",
      back: "Zurück",
      next: "Weiter",
      finish: "Beenden",
      save: "Speichern",
      export: "Exportieren",
      copy: "Kopieren",
      paste: "Einfügen",
      done: "Fertig",
    },
  },
  it: {
    languageSelection: {
      title: "Scegli la tua lingua",
      subtitle: "Seleziona la tua lingua preferita per continuare",
      selectLanguage: "Seleziona lingua",
      availableLanguages: "Lingue disponibili",
      otherLanguages: "Altre lingue",
      comingSoon: "Prossimamente...",
      languages: {
        fr: "Français (France)",
        en: "English (United Kingdom)",
        de: "Deutsch (Deutschland)",
        it: "Italiano (Italia)",
        es: "Español (España)",
        al: "Shqip (Shqipëria)",
      },
    },
    onboarding: {
      title: "Crypto Wallet",
      subtitle: "Il tuo portafoglio crypto sicuro e professionale",
      userTypeSelection: {
        title: "Che tipo di utente sei?",
        subtitle: "Scegli il profilo che meglio si adatta alle tue esigenze",
        client: {
          title: "Cliente Privato",
          description: "Gestisci le tue criptovalute personali in sicurezza",
        },
        merchant: {
          title: "Commerciante",
          description: "Accetta pagamenti crypto nella tua attività",
        },
      },
      walletCreation: {
        title: "Creazione del tuo portafoglio",
        subtitle: "Generazione sicura delle tue chiavi private",
        generating: "Generazione in corso...",
        success: "Portafoglio creato con successo!",
        continue: "Continua",
      },
    },
    dashboard: {
      title: "Dashboard",
      subtitle: "Gestisci le tue criptovalute",
      professionalTitle: "Dashboard Professionale",
      professionalSubtitle: "Gestisci la tua attività crypto",
      totalBalance: "Saldo Totale",
      portfolio: "Portafoglio",
      recentTransactions: "Transazioni Recenti",
      quickActions: {
        send: "Invia",
        receive: "Ricevi",
        buy: "Acquista",
        tpeMode: "Modalità POS",
      },
      transactions: {
        viewAll: "Vedi Tutto",
        received: "Ricevuto",
        sent: "Inviato",
        completed: "Completato",
        pending: "In Attesa",
        failed: "Fallito",
      },
      statistics: {
        monthlyTransactions: "Transazioni Mensili",
        volumeExchanged: "Volume Scambiato",
        monthlyGoal: "Obiettivo Mensile",
      },
    },
    settings: {
      title: "Impostazioni",
      tabs: {
        general: "Generale",
        security: "Sicurezza",
        notifications: "Notifiche",
        advanced: "Avanzate",
      },
      general: {
        appearance: "Aspetto",
        theme: {
          light: "Chiaro",
          dark: "Scuro",
          system: "Sistema",
        },
        language: "Lingua",
        currency: "Valuta",
        userType: "Tipo utente",
        userTypes: {
          individual: "Individuale",
          business: "Azienda",
          merchant: "Commerciante",
        },
      },
      security: {
        title: "Sicurezza",
        pin: "Codice PIN",
        changePinDescription: "Cambia il tuo codice PIN",
        changePin: "Cambia PIN",
        seedPhrase: "Frase di recupero",
        seedPhraseDescription: "Mostra la tua frase segreta",
        viewPhrase: "Visualizza frase",
        biometrics: "Biometria",
        biometricsDescription: "Usa impronta digitale",
        autoLock: "Blocco automatico",
        autoLockOptions: {
          oneMinute: "1 minuto",
          fiveMinutes: "5 minuti",
          fifteenMinutes: "15 minuti",
          thirtyMinutes: "30 minuti",
          never: "Mai",
        },
      },
      notifications: {
        title: "Notifiche",
        priceAlerts: "Avvisi di prezzo",
        priceAlertsDescription: "Notifiche di variazioni di prezzo",
        transactions: "Transazioni",
        transactionsDescription: "Conferme di transazione",
        security: "Sicurezza",
        securityDescription: "Avvisi di sicurezza",
        marketing: "Marketing",
        marketingDescription: "Offerte e promozioni",
      },
      advanced: {
        backupRecovery: "Backup e recupero",
        exportWallet: "Esporta portafoglio",
        exportDescription: "Backup dei tuoi dati",
        technicalSupport: "Supporto tecnico",
        supportDescription: "Contatta il supporto",
      },
      dangerZone: {
        title: "Zona pericolosa",
        deleteWallet: "Elimina portafoglio",
        deleteDescription: "Questa azione è irreversibile. Tutti i tuoi dati saranno eliminati permanentemente.",
        deleteConfirm: "Sei assolutamente sicuro?",
        deleteWarning: "Questa azione non può essere annullata. Eliminerà permanentemente il tuo portafoglio.",
        deleteButton: "Sì, elimina permanentemente",
      },
      messages: {
        settingsSaved: "Impostazioni salvate",
        settingsUpdated: "Le tue preferenze sono state aggiornate",
        backupExported: "Backup esportato",
        walletBackedUp: "Il tuo portafoglio è stato salvato",
        walletDeleted: "Portafoglio eliminato",
        dataCleared: "Tutti i dati sono stati cancellati",
      },
    },
    time: {
      minute: "minuto",
      minutes: "minuti",
      hour: "ora",
      hours: "ore",
      day: "giorno",
      days: "giorni",
      ago: "fa",
      thisMonth: "questo mese",
    },
    tpe: {
      stats: {
        clients: "Clienti",
      },
    },
    common: {
      loading: "Caricamento...",
      error: "Errore",
      success: "Successo",
      cancel: "Annulla",
      confirm: "Conferma",
      continue: "Continua",
      back: "Indietro",
      next: "Avanti",
      finish: "Termina",
      save: "Salva",
      export: "Esporta",
      copy: "Copia",
      paste: "Incolla",
      done: "Fatto",
    },
  },
  es: {
    languageSelection: {
      title: "Elige tu idioma",
      subtitle: "Selecciona tu idioma preferido para continuar",
      selectLanguage: "Seleccionar idioma",
      availableLanguages: "Idiomas disponibles",
      otherLanguages: "Otros idiomas",
      comingSoon: "Próximamente...",
      languages: {
        fr: "Français (France)",
        en: "English (United Kingdom)",
        de: "Deutsch (Deutschland)",
        it: "Italiano (Italia)",
        es: "Español (España)",
        al: "Shqip (Shqipëria)",
      },
    },
    onboarding: {
      title: "Crypto Wallet",
      subtitle: "Tu billetera crypto segura y profesional",
      userTypeSelection: {
        title: "¿Qué tipo de usuario eres?",
        subtitle: "Elige el perfil que mejor se adapte a tus necesidades",
        client: {
          title: "Cliente Particular",
          description: "Gestiona tus criptomonedas personales de forma segura",
        },
        merchant: {
          title: "Comerciante",
          description: "Acepta pagos crypto en tu negocio",
        },
      },
      walletCreation: {
        title: "Creando tu billetera",
        subtitle: "Generación segura de tus claves privadas",
        generating: "Generando...",
        success: "¡Billetera creada con éxito!",
        continue: "Continuar",
      },
    },
    dashboard: {
      title: "Panel de Control",
      subtitle: "Gestiona tus criptomonedas",
      professionalTitle: "Panel Profesional",
      professionalSubtitle: "Gestiona tu negocio crypto",
      totalBalance: "Saldo Total",
      portfolio: "Cartera",
      recentTransactions: "Transacciones Recientes",
      quickActions: {
        send: "Enviar",
        receive: "Recibir",
        buy: "Comprar",
        tpeMode: "Modo TPV",
      },
      transactions: {
        viewAll: "Ver Todo",
        received: "Recibido",
        sent: "Enviado",
        completed: "Completado",
        pending: "Pendiente",
        failed: "Fallido",
      },
      statistics: {
        monthlyTransactions: "Transacciones Mensuales",
        volumeExchanged: "Volumen Intercambiado",
        monthlyGoal: "Objetivo Mensual",
      },
    },
    settings: {
      title: "Configuración",
      tabs: {
        general: "General",
        security: "Seguridad",
        notifications: "Notificaciones",
        advanced: "Avanzado",
      },
      general: {
        appearance: "Apariencia",
        theme: {
          light: "Claro",
          dark: "Oscuro",
          system: "Sistema",
        },
        language: "Idioma",
        currency: "Moneda",
        userType: "Tipo de usuario",
        userTypes: {
          individual: "Individual",
          business: "Empresa",
          merchant: "Comerciante",
        },
      },
      security: {
        title: "Seguridad",
        pin: "Código PIN",
        changePinDescription: "Cambia tu código PIN",
        changePin: "Cambiar PIN",
        seedPhrase: "Frase de recuperación",
        seedPhraseDescription: "Muestra tu frase secreta",
        viewPhrase: "Ver frase",
        biometrics: "Biometría",
        biometricsDescription: "Usar huella dactilar",
        autoLock: "Bloqueo automático",
        autoLockOptions: {
          oneMinute: "1 minuto",
          fiveMinutes: "5 minutos",
          fifteenMinutes: "15 minutos",
          thirtyMinutes: "30 minutos",
          never: "Nunca",
        },
      },
      notifications: {
        title: "Notificaciones",
        priceAlerts: "Alertas de precio",
        priceAlertsDescription: "Notificaciones de cambios de precio",
        transactions: "Transacciones",
        transactionsDescription: "Confirmaciones de transacciones",
        security: "Seguridad",
        securityDescription: "Alertas de seguridad",
        marketing: "Marketing",
        marketingDescription: "Ofertas y promociones",
      },
      advanced: {
        backupRecovery: "Respaldo y recuperación",
        exportWallet: "Exportar billetera",
        exportDescription: "Respaldar tus datos",
        technicalSupport: "Soporte técnico",
        supportDescription: "Contactar soporte",
      },
      dangerZone: {
        title: "Zona peligrosa",
        deleteWallet: "Eliminar billetera",
        deleteDescription: "Esta acción es irreversible. Todos tus datos serán eliminados permanentemente.",
        deleteConfirm: "¿Estás absolutamente seguro?",
        deleteWarning: "Esta acción no se puede deshacer. Eliminará permanentemente tu billetera.",
        deleteButton: "Sí, eliminar permanentemente",
      },
      messages: {
        settingsSaved: "Configuración guardada",
        settingsUpdated: "Tus preferencias han sido actualizadas",
        backupExported: "Respaldo exportado",
        walletBackedUp: "Tu billetera ha sido respaldada",
        walletDeleted: "Billetera eliminada",
        dataCleared: "Todos los datos han sido borrados",
      },
    },
    time: {
      minute: "minuto",
      minutes: "minutos",
      hour: "hora",
      hours: "horas",
      day: "día",
      days: "días",
      ago: "hace",
      thisMonth: "este mes",
    },
    tpe: {
      stats: {
        clients: "Clientes",
      },
    },
    common: {
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
      cancel: "Cancelar",
      confirm: "Confirmar",
      continue: "Continuar",
      back: "Atrás",
      next: "Siguiente",
      finish: "Terminar",
      save: "Guardar",
      export: "Exportar",
      copy: "Copiar",
      paste: "Pegar",
      done: "Hecho",
    },
  },
  al: {
    languageSelection: {
      title: "Zgjidhni gjuhën tuaj",
      subtitle: "Zgjidhni gjuhën tuaj të preferuar për të vazhduar",
      selectLanguage: "Zgjidhni gjuhën",
      availableLanguages: "Gjuhët e disponueshme",
      otherLanguages: "Gjuhë të tjera",
      comingSoon: "Së shpejti...",
      languages: {
        fr: "Français (France)",
        en: "English (United Kingdom)",
        de: "Deutsch (Deutschland)",
        it: "Italiano (Italia)",
        es: "Español (España)",
        al: "Shqip (Shqipëria)",
      },
    },
    onboarding: {
      title: "Crypto Wallet",
      subtitle: "Portofoli juaj i sigurt dhe profesional crypto",
      userTypeSelection: {
        title: "Çfarë lloj përdoruesi jeni?",
        subtitle: "Zgjidhni profilin që i përshtatet më mirë nevojave tuaja",
        client: {
          title: "Klient Individual",
          description: "Menaxhoni kriptomonedhën tuaj personale në mënyrë të sigurt",
        },
        merchant: {
          title: "Tregtar",
          description: "Pranoni pagesa crypto në biznesin tuaj",
        },
      },
      walletCreation: {
        title: "Duke krijuar portofolin tuaj",
        subtitle: "Gjenerimi i sigurt i çelësave tuaj privatë",
        generating: "Duke gjeneruar...",
        success: "Portofoli u krijua me sukses!",
        continue: "Vazhdo",
      },
    },
    dashboard: {
      title: "Paneli i Kontrollit",
      subtitle: "Menaxhoni kriptomonedhën tuaj",
      professionalTitle: "Paneli Profesional",
      professionalSubtitle: "Menaxhoni biznesin tuaj crypto",
      totalBalance: "Bilanci Total",
      portfolio: "Portofoli",
      recentTransactions: "Transaksionet e Fundit",
      quickActions: {
        send: "Dërgo",
        receive: "Merr",
        buy: "Bli",
        tpeMode: "Modaliteti POS",
      },
      transactions: {
        viewAll: "Shiko të Gjitha",
        received: "Marrë",
        sent: "Dërguar",
        completed: "Përfunduar",
        pending: "Në Pritje",
        failed: "Dështuar",
      },
      statistics: {
        monthlyTransactions: "Transaksionet Mujore",
        volumeExchanged: "Volumi i Shkëmbyer",
        monthlyGoal: "Objektivi Mujor",
      },
    },
    settings: {
      title: "Cilësimet",
      tabs: {
        general: "Të përgjithshme",
        security: "Siguria",
        notifications: "Njoftimet",
        advanced: "Të avancuara",
      },
      general: {
        appearance: "Pamja",
        theme: {
          light: "E çelët",
          dark: "E errët",
          system: "Sistemi",
        },
        language: "Gjuha",
        currency: "Monedha",
        userType: "Lloji i përdoruesit",
        userTypes: {
          individual: "Individual",
          business: "Biznes",
          merchant: "Tregtar",
        },
      },
      security: {
        title: "Siguria",
        pin: "Kodi PIN",
        changePinDescription: "Ndrysho kodin tënd PIN",
        changePin: "Ndrysho PIN",
        seedPhrase: "Fraza e rikuperimit",
        seedPhraseDescription: "Shfaq frazën tënde sekrete",
        viewPhrase: "Shiko frazën",
        biometrics: "Biometria",
        biometricsDescription: "Përdor gjurmën e gishtit",
        autoLock: "Kyçja automatike",
        autoLockOptions: {
          oneMinute: "1 minutë",
          fiveMinutes: "5 minuta",
          fifteenMinutes: "15 minuta",
          thirtyMinutes: "30 minuta",
          never: "Kurrë",
        },
      },
      notifications: {
        title: "Njoftimet",
        priceAlerts: "Alarmet e çmimit",
        priceAlertsDescription: "Njoftimet e ndryshimeve të çmimit",
        transactions: "Transaksionet",
        transactionsDescription: "Konfirmimet e transaksioneve",
        security: "Siguria",
        securityDescription: "Alarmet e sigurisë",
        marketing: "Marketingu",
        marketingDescription: "Ofertat dhe promovime",
      },
      advanced: {
        backupRecovery: "Backup dhe rikuperim",
        exportWallet: "Eksporto portofolin",
        exportDescription: "Backup të dhënat tuaja",
        technicalSupport: "Mbështetja teknike",
        supportDescription: "Kontakto mbështetjen",
      },
      dangerZone: {
        title: "Zona e rrezikshme",
        deleteWallet: "Fshij portofolin",
        deleteDescription: "Ky veprim është i pakthyeshëm. Të gjitha të dhënat tuaja do të fshihen përgjithmonë.",
        deleteConfirm: "A jeni absolutisht të sigurt?",
        deleteWarning: "Ky veprim nuk mund të zhbëhet. Do të fshijë përgjithmonë portofolin tuaj.",
        deleteButton: "Po, fshije përgjithmonë",
      },
      messages: {
        settingsSaved: "Cilësimet u ruajtën",
        settingsUpdated: "Preferencat tuaja janë përditësuar",
        backupExported: "Backup u eksportua",
        walletBackedUp: "Portofoli juaj u ruajt",
        walletDeleted: "Portofoli u fshi",
        dataCleared: "Të gjitha të dhënat u pastruan",
      },
    },
    time: {
      minute: "minutë",
      minutes: "minuta",
      hour: "orë",
      hours: "orë",
      day: "ditë",
      days: "ditë",
      ago: "më parë",
      thisMonth: "këtë muaj",
    },
    tpe: {
      stats: {
        clients: "Klientë",
      },
    },
    common: {
      loading: "Duke ngarkuar...",
      error: "Gabim",
      success: "Sukses",
      cancel: "Anulo",
      confirm: "Konfirmo",
      continue: "Vazhdo",
      back: "Prapa",
      next: "Tjetër",
      finish: "Përfundo",
      save: "Ruaj",
      export: "Eksporto",
      copy: "Kopjo",
      paste: "Ngjit",
      done: "Përfunduar",
    },
  },
}

export function getTranslation(language: Language): Translations {
  return translations[language] || translations.fr
}
