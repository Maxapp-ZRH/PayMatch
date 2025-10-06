/**
 * Stripe Checkout Branding Configuration
 *
 * Swiss market optimized branding settings for PayMatch.
 * Ensures professional appearance and Swiss locale support.
 */

export const STRIPE_BRANDING_CONFIG = {
  // Swiss market colors (Swiss flag inspired)
  colors: {
    primary: '#2563EB', // Professional blue
    background: '#FFFFFF', // Clean white
    accent: '#059669', // Emerald green accent
  },

  // Swiss business fonts (Swiss locale compatible)
  fonts: {
    // Inter - supports German, French, Italian (Swiss languages)
    family: 'Inter',
    // Fallback fonts for Swiss locales
    fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
  },

  // Swiss business messaging
  customText: {
    submit: {
      message:
        'Sichere Zahlung mit PayMatch - Ihr vertrauensvoller Partner für Schweizer Rechnungsstellung',
    },
    terms_and_conditions: {
      message:
        'Durch die Zahlung stimmen Sie unseren AGB und Datenschutzbestimmungen zu.',
    },
    after_submit: {
      message:
        'Erfahren Sie mehr über **Ihr Abonnement** in Ihrem [Dashboard](https://paymatch.app/dashboard) oder verwalten Sie es im [Kundenportal](https://paymatch.app/portal).',
    },
    terms_of_service_acceptance: {
      message:
        'Ich stimme den [Allgemeinen Geschäftsbedingungen](https://paymatch.app/terms) und der [Datenschutzerklärung](https://paymatch.app/privacy) zu.',
    },
  },

  // Swiss locale support
  locales: {
    primary: 'de-CH', // German (Switzerland) - primary Swiss business language
    supported: ['de-CH', 'fr-CH', 'it-CH', 'en-CH'], // All Swiss languages
    auto: true, // Auto-detect customer locale
  },

  // Swiss business branding
  business: {
    name: 'PayMatch',
    description: 'Schweizer Rechnungsstellung mit QR-Bill Compliance',
    logo: '/logo/paymatch-logo.png', // Swiss flag inspired logo
  },

  // Swiss receipt and invoice configuration
  receipts: {
    enabled: true, // Enable automatic receipts
    invoice_creation: true, // Enable invoice creation for Swiss compliance
    description:
      'PayMatch - Schweizer Rechnungsstellung mit QR-Bill Compliance',
    custom_fields: [
      {
        name: 'Service Description',
        value: 'Swiss invoicing platform with QR-bill compliance',
      },
      {
        name: 'Compliance',
        value: 'Swiss QR-bill compliant invoicing',
      },
    ],
    footer: 'PayMatch - Ihr Partner für Schweizer Rechnungsstellung',
    // Swiss business information
    business_info: {
      name: 'PayMatch',
      description: 'Schweizer Rechnungsstellung mit QR-Bill Compliance',
      website: 'https://paymatch.app',
      support_email: 'support@paymatch.app',
    },
  },
} as const;

/**
 * Get Swiss locale-specific custom text
 */
export function getSwissCustomText(locale: string = 'de-CH') {
  const messages = {
    'de-CH': {
      submit:
        'Sichere Zahlung mit PayMatch - Ihr vertrauensvoller Partner für Schweizer Rechnungsstellung',
      terms:
        'Durch die Zahlung stimmen Sie unseren AGB und Datenschutzbestimmungen zu.',
      after_submit:
        'Erfahren Sie mehr über **Ihr Abonnement** in Ihrem [Dashboard](https://paymatch.app/dashboard) oder verwalten Sie es im [Kundenportal](https://paymatch.app/portal).',
      terms_of_service:
        'Ich stimme den [Allgemeinen Geschäftsbedingungen](https://paymatch.app/terms) und der [Datenschutzerklärung](https://paymatch.app/privacy) zu.',
    },
    'fr-CH': {
      submit:
        'Paiement sécurisé avec PayMatch - Votre partenaire de confiance pour la facturation suisse',
      terms:
        'En effectuant le paiement, vous acceptez nos CGV et notre politique de confidentialité.',
      after_submit:
        'Découvrez plus sur **votre abonnement** dans votre [Tableau de bord](https://paymatch.app/dashboard) ou gérez-le dans le [Portail client](https://paymatch.app/portal).',
      terms_of_service:
        "J'accepte les [Conditions générales](https://paymatch.app/terms) et la [Politique de confidentialité](https://paymatch.app/privacy).",
    },
    'it-CH': {
      submit:
        'Pagamento sicuro con PayMatch - Il vostro partner di fiducia per la fatturazione svizzera',
      terms:
        'Effettuando il pagamento, accettate i nostri T&C e la nostra politica sulla privacy.',
      after_submit:
        'Scoprite di più sul **vostro abbonamento** nella vostra [Dashboard](https://paymatch.app/dashboard) o gestitelo nel [Portale clienti](https://paymatch.app/portal).',
      terms_of_service:
        "Accetto i [Termini di servizio](https://paymatch.app/terms) e l'[Informativa sulla privacy](https://paymatch.app/privacy).",
    },
    'en-CH': {
      submit:
        'Secure payment with PayMatch - Your trusted partner for Swiss invoicing',
      terms:
        'By making the payment, you agree to our Terms & Conditions and Privacy Policy.',
      after_submit:
        'Learn more about **your subscription** in your [Dashboard](https://paymatch.app/dashboard) or manage it in the [Customer Portal](https://paymatch.app/portal).',
      terms_of_service:
        'I agree to the [Terms of Service](https://paymatch.app/terms) and [Privacy Policy](https://paymatch.app/privacy).',
    },
  };

  return messages[locale as keyof typeof messages] || messages['de-CH'];
}

/**
 * Get Swiss-compatible font family
 */
export function getSwissFontFamily() {
  // Inter supports all Swiss languages (German, French, Italian, English)
  return 'Inter, Helvetica Neue, Arial, sans-serif';
}
