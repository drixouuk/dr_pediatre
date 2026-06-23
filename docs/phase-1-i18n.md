# Plan: Phase 1 corrigée — Extraction i18n + nettoyage

## Contexte

Phase 1 structurelle est implémentée (Header, Footer, LanguageSwitcher, RTL, Tifinagh, schemas Payload) mais les UI strings sont hardcodées en français dans les composants, en violation de `.kilocode/rules.md` : « Ne jamais hardcoder une UI string — tout passe par messages/[locale].json ».

Le fichier `proxy.ts` à la racine de `apps/frontend` est du dead code — le middleware next-intl est déjà configuré via `next-intl/plugin` dans `next.config.ts`.

## Objectif

Extraire toutes les UI strings des composants vers `messages/*.json`, avec traductions complètes pour les 4 locales (fr, en, ar, tzm), et supprimer le dead code.

## Clés de messages

```
nav.home
nav.presentation
nav.services
nav.infos
nav.contact
header.doctorName
header.doctorNameShort
header.specialty
footer.specialty
footer.location
lang.fr
lang.en
lang.ar
lang.tzm
hero.welcome
ui.phone
```

## Task 1 — Remplir messages/*.json

### messages/fr.json

```json
{
  "nav": {
    "home": "Accueil",
    "presentation": "Présentation",
    "services": "Services",
    "infos": "Infos",
    "contact": "Contact"
  },
  "header": {
    "doctorName": "Dr Guinane Aicha",
    "doctorNameShort": "Dr Guinane",
    "specialty": "Pédiatre"
  },
  "footer": {
    "specialty": "Pédiatre",
    "location": "Inezgane, Maroc"
  },
  "lang": {
    "fr": "Français",
    "en": "English",
    "ar": "العربية",
    "tzm": "ⵜⴰⵎⴰⵣⵉⵖⵜ"
  },
  "hero": {
    "welcome": "Bienvenue"
  },
  "ui": {
    "phone": "Tél"
  }
}
```

### messages/en.json

```json
{
  "nav": {
    "home": "Home",
    "presentation": "About",
    "services": "Services",
    "infos": "Information",
    "contact": "Contact"
  },
  "header": {
    "doctorName": "Dr Guinane Aicha",
    "doctorNameShort": "Dr Guinane",
    "specialty": "Pediatrician"
  },
  "footer": {
    "specialty": "Pediatrician",
    "location": "Inezgane, Morocco"
  },
  "lang": {
    "fr": "Français",
    "en": "English",
    "ar": "العربية",
    "tzm": "ⵜⴰⵎⴰⵣⵉⵖⵜ"
  },
  "hero": {
    "welcome": "Welcome"
  },
  "ui": {
    "phone": "Phone"
  }
}
```

### messages/ar.json (RTL)

```json
{
  "nav": {
    "home": "الرئيسية",
    "presentation": "نبذة عن الطبيبة",
    "services": "الخدمات",
    "infos": "معلومات",
    "contact": "اتصل بنا"
  },
  "header": {
    "doctorName": "د. غينان عائشة",
    "doctorNameShort": "د. غينان",
    "specialty": "طبيبة أطفال"
  },
  "footer": {
    "specialty": "طبيبة أطفال",
    "location": "إنزكان، المغرب"
  },
  "lang": {
    "fr": "Français",
    "en": "English",
    "ar": "العربية",
    "tzm": "ⵜⴰⵎⴰⵣⵉⵖⵜ"
  },
  "hero": {
    "welcome": "مرحباً"
  },
  "ui": {
    "phone": "الهاتف"
  }
}
```

### messages/tzm.json (Tifinagh)

```json
{
  "nav": {
    "home": "ⴰⵙⵏⵓⴱⴳ",
    "presentation": "ⵖⴼ ⵜⵙⵏⵉⵊⵉⵜ",
    "services": "ⵜⵉⵡⵓⵔⵉⵡⵉⵏ",
    "infos": "ⵉⵏⵖⵎⵉⵙⵏ",
    "contact": "ⴰⵎⵢⴰⵡⴰⴹ"
  },
  "header": {
    "doctorName": "ⴷⵓⴽⵜⵓⵔ ⴳⵉⵏⴰⵏ ⵄⴰⵢⵛⴰ",
    "doctorNameShort": "ⴷⵓⴽⵜⵓⵔ ⴳⵉⵏⴰⵏ",
    "specialty": "ⵜⵙⵏⵉⵊⵉⵜ ⵏ ⵜⴰⵔⵡⴰ"
  },
  "footer": {
    "specialty": "ⵜⵙⵏⵉⵊⵉⵜ ⵏ ⵜⴰⵔⵡⴰ",
    "location": "ⵉⵏⵣⴳⴰⵏ, ⵍⵎⵖⵔⵉⴱ"
  },
  "lang": {
    "fr": "Français",
    "en": "English",
    "ar": "العربية",
    "tzm": "ⵜⴰⵎⴰⵣⵉⵖⵜ"
  },
  "hero": {
    "welcome": "ⴰⵣⵓⵍ"
  },
  "ui": {
    "phone": "ⵜⵉⵍⵉⴼⵓⵏ"
  }
}
```

## Task 2 — Header.tsx : async + getTranslations

Remplacer le tableau `navLinks` hardcodé et les labels par `getTranslations` :

```tsx
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import LanguageSwitcher from './LanguageSwitcher'

type Props = {
  locale: string
}

export default async function Header({ locale }: Props) {
  const nav = await getTranslations({ locale, namespace: 'nav' })
  const h = await getTranslations({ locale, namespace: 'header' })

  const navLinks = [
    { href: '/', label: nav('home') },
    { href: '/presentation', label: nav('presentation') },
    { href: '/services', label: nav('services') },
    { href: '/infos', label: nav('infos') },
    { href: '/contact', label: nav('contact') },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-container items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-primary-700 hover:text-primary-600 transition-colors duration-200"
        >
          <span className="hidden sm:inline">{h('doctorName')}</span>
          <span className="sm:hidden">{h('doctorNameShort')}</span>
          <span className="hidden text-sm font-normal text-stone-500 md:inline">
            {h('specialty')}
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 hover:bg-cream-200 hover:text-primary-700 transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          <LanguageSwitcher currentLocale={locale} />
        </div>
      </div>
    </header>
  )
}
```

## Task 3 — Footer.tsx : async + getTranslations

```tsx
import { getTranslations } from 'next-intl/server'

type Props = {
  locale: string
}

export default async function Footer({ locale }: Props) {
  const f = await getTranslations({ locale, namespace: 'footer' })

  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto max-w-container px-4 py-8 md:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 text-center text-sm text-stone-500">
          <p className="font-medium text-stone-700">
            Dr Guinane Aicha
            <span className="mx-1.5 text-stone-300">|</span>
            <span className="font-normal">{f('specialty')}</span>
          </p>
          <p>{f('location')}</p>
        </div>
      </div>
    </footer>
  )
}
```

## Task 4 — LanguageSwitcher.tsx : useTranslations

```tsx
'use client'

import { useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'

const localeCodes = ['fr', 'ar', 'en', 'tzm'] as const

type Props = {
  currentLocale: string
}

export default function LanguageSwitcher({ currentLocale }: Props) {
  const t = useTranslations('lang')
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav aria-label="Language switcher" className="flex items-center gap-1">
      {localeCodes.map((code) => {
        const isActive = code === currentLocale
        return (
          <button
            key={code}
            onClick={() => router.replace(pathname, { locale: code })}
            className={`
              inline-flex items-center justify-center rounded-lg px-2.5 py-1.5
              text-xs font-medium leading-none
              transition-colors duration-200
              min-h-[36px] min-w-[36px]
              cursor-pointer
              ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-stone-600 hover:bg-cream-200 hover:text-primary-700'
              }
            `}
            aria-current={isActive ? 'true' : undefined}
          >
            {t(code)}
          </button>
        )
      })}
    </nav>
  )
}
```

## Task 5 — page.tsx : remplacer heroTitle par getTranslations

Supprimer l'objet `heroTitle` et le label `'Tél :'` hardcodé :

```tsx
import { setRequestLocale, getTranslations } from 'next-intl/server'

type Props = {
  params: Promise<{ locale: string }>
}

// ... fetchPracticeInfo inchangé ...

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'hero' })
  const u = await getTranslations({ locale, namespace: 'ui' })

  const practice = await fetchPracticeInfo(locale)
  const title = t('welcome')

  return (
    <main className="mx-auto w-full max-w-container flex-1 px-4 py-12 md:px-6 lg:px-8">
      <h1 className="mb-6 text-4xl font-bold text-stone-800 md:text-5xl">
        {title}
      </h1>

      {practice && (
        <div className="space-y-4 text-stone-600">
          {practice.address && <p>{practice.address}</p>}
          {practice.phone && practice.phone !== '—' && (
            <p>
              <span className="font-medium text-stone-700">{u('phone')} :</span>{' '}
              {practice.phone}
            </p>
          )}
        </div>
      )}
    </main>
  )
}
```

Le nom du médecin dans le Header reste hardcodé (`Dr Guinane Aicha`) — il vient du CMS en Phase 2, pas des messages i18n.

## Task 6 — Layout : passer locale à Footer

`[locale]/layout.tsx` doit passer `locale` à Footer (nouvelle prop) :

```tsx
<Footer locale={locale} />
```

## Task 7 — Supprimer dead code

Supprimer `apps/frontend/proxy.ts` — le middleware next-intl est déjà géré via `next-intl/plugin` dans `next.config.ts`.

## Task 8 — Build gate

```bash
cd apps/frontend && npx tsc --noEmit && npx next build
cd apps/cms && npx tsc --noEmit && npx next build
```

## Fichiers protégés modifiés

- `messages/fr.json`
- `messages/en.json`
- `messages/ar.json`
- `messages/tzm.json`

## Fichiers existants — ne pas toucher

`design-system/MASTER.md`, `components/README.md`, `docs/PRD.md`, `AGENTS.md`, `.kilocode/rules.md`, `payload.config.ts`, `next.config.ts`

## Validation

1. `tsc --noEmit` passe sans erreur dans `apps/frontend`
2. `next build` réussit
3. `/fr` affiche les labels en français
4. `/en` affiche les labels en anglais
5. `/ar` affiche les labels en arabe + layout RTL
6. `/tzm` affiche les labels en Tifinagh
7. Le sélecteur de langue commute entre les 4 locales
8. Cookie `NEXT_LOCALE` mémorise le choix
9. Aucune string hardcodée ne subsiste dans les composants UI
