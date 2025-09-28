# Internationalization (i18n) Setup

This directory contains the internationalization configuration and message files for the PayMatch application.

## Structure

```
src/i18n/
├── routing.ts          # Routing configuration with supported locales
├── request.ts          # Request configuration for server-side rendering
├── navigation.ts       # Navigation APIs with locale support
└── messages/           # Message files organized by locale
    ├── en/             # English messages
    │   ├── index.json  # Main messages
    │   └── features.json # Feature-specific messages
    └── de-CH/          # German (Swiss) messages
        ├── index.json  # Main messages
        └── features.json # Feature-specific messages
```

## Supported Locales

- **en**: English (default)
- **de-CH**: German (Switzerland)
- **fr-CH**: French (Switzerland) - planned
- **it-CH**: Italian (Switzerland) - planned

## Usage

### In Components

```tsx
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('common');

  return <h1>{t('title')}</h1>;
}
```

### In Server Components

```tsx
import { getTranslations } from 'next-intl/server';

async function MyServerComponent() {
  const t = await getTranslations('common');

  return <h1>{t('title')}</h1>;
}
```

### Navigation

```tsx
import { Link, useRouter } from '@/i18n/navigation';

// Localized links
<Link href="/about">About</Link>;

// Programmatic navigation
const router = useRouter();
router.push('/about');
```

## Adding New Messages

1. Add the message to the appropriate JSON file in `messages/[locale]/`
2. Use the message in your component with `useTranslations()`
3. Ensure all locales have the same message keys

## Language Switcher

The `LanguageSwitcher` component is available in `src/components/ui/LanguageSwitcher.tsx` and provides:

- Dropdown variant (default)
- Button variant for mobile
- Flag display option
- Automatic locale switching

## Routing

The application uses prefix-based routing:

- `/` - English (default)
- `/de-CH/` - German (Switzerland)
- `/fr-CH/` - French (Switzerland)
- `/it-CH/` - Italian (Switzerland)

## Configuration

- **Middleware**: Handles locale detection and routing
- **Next.js Plugin**: Processes the i18n configuration
- **Request Config**: Loads messages and sets up formatting

## Swiss Market Focus

The i18n setup is specifically designed for the Swiss market with:

- Swiss German (de-CH) as the primary non-English locale
- Swiss-specific formatting for dates, numbers, and currency
- Swiss timezone (Europe/Zurich)
- Swiss QR-bill compliance messaging
