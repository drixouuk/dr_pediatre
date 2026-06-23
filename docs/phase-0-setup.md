# Plan: Phase 0 — Setup drpediatre

## Contexte

Projet drpediatre — site vitrine pédiatrique (Dr Guinane Aicha, Inezgane). Next.js 15 + Payload CMS v3 + next-intl + Tailwind. 4 locales : fr (défaut), en, ar (RTL), tzm (Tifinagh).

## Décisions actées

| Décision | Choix |
|---|---|
| Structure | Monorepo pnpm : `apps/frontend` + `apps/cms` |
| Locale défaut | `fr` |
| Payload LXC | Config locale uniquement (LXC pas provisionné) |
| Design system | ✅ `design-system/MASTER.md` validé |
| Git | ✅ repo init, connecté à `drixouuk/dr_pediatre` |

## Structure après Phase 0

```
dr_pediatre/
├── pnpm-workspace.yaml
├── package.json
├── .gitignore
├── apps/
│   ├── frontend/
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts          # issu de design-system/MASTER.md §5.1
│   │   ├── tsconfig.json
│   │   ├── postcss.config.mjs
│   │   ├── src/
│   │   │   ├── middleware.ts
│   │   │   ├── i18n/
│   │   │   │   ├── request.ts          # next-intl config
│   │   │   │   └── routing.ts          # locales + default
│   │   │   └── app/
│   │   │       ├── layout.tsx           # redirect / → /fr
│   │   │       ├── page.tsx             # redirect
│   │   │       └── [locale]/
│   │   │           ├── layout.tsx       # fonts + dir + NextIntlClientProvider
│   │   │           └── page.tsx         # placeholder
│   │   └── messages/
│   │       ├── fr.json                  # {}
│   │       ├── en.json                  # {}
│   │       ├── ar.json                  # {}
│   │       └── tzm.json                 # {}
│   └── cms/
│       ├── package.json
│       ├── payload.config.ts            # SQLite + admin
│       ├── next.config.ts
│       ├── tsconfig.json
│       └── src/
│           ├── collections/             # vide, prêt pour Phase 1
│           ├── globals/                 # vide, prêt pour Phase 1
│           └── app/
│               └── (payload)/
│                   └── ...              # routes admin auto
├── design-system/
│   └── MASTER.md                        # ✅ existant
├── components/
│   └── README.md                        # ✅ existant
├── docs/
│   └── PRD.md                           # ✅ existant
└── AGENTS.md                            # ✅ existant
```

## Tasks (ordre d'exécution)

### T1 — Root monorepo

- Créer `pnpm-workspace.yaml` :
  ```yaml
  packages:
    - 'apps/*'
  ```
- Créer `package.json` racine :
  ```json
  {
    "private": true,
    "packageManager": "pnpm@9.15.0"
  }
  ```
- Créer `.gitignore` : `node_modules`, `.next`, `dist`, `.env*`, `*.db`, `*.db-journal`

### T2 — apps/frontend scaffold

- Créer `apps/frontend` avec Next.js 15 + configs Tailwind basées sur `design-system/MASTER.md` §5.1
- **tailwind.config.ts** : alias `primary: colors.teal`, `secondary: colors.amber`, `cta: colors.orange`, `cream` custom, font families `heading`/`body`/`tifinagh`
- **postcss.config.mjs** : standard Tailwind + autoprefixer
- Installer `next-intl`, `lucide-react`

### T3 — apps/cms scaffold

- Créer `apps/cms` avec Payload CMS v3 + SQLite (better-sqlite3)
- **payload.config.ts** : admin activé, db SQLite (`sqlite://payload.db`), collections vides, globals vides
- **next.config.ts** : config Next.js minimale + Payload integration
- Créer répertoires `src/collections/` et `src/globals/` vides (seront remplis en Phase 1)

### T4 — i18n : next-intl + middleware

- **src/i18n/routing.ts** :
  ```ts
  export const locales = ['fr', 'en', 'ar', 'tzm'] as const
  export const defaultLocale = 'fr'
  ```
- **src/i18n/request.ts** : charger `messages/${locale}.json`
- **src/middleware.ts** : locale prefix routing + cookie mémorisation + `Accept-Language` fallback
- **app/layout.tsx** (racine) : `<html>` avec `dir` conditionnel (RTL pour `ar`), pas de locale ici
- **app/page.tsx** : redirect `/` → `/fr`
- **app/[locale]/layout.tsx** : `NextIntlClientProvider`, chargement fonts via `next/font/google`
- **app/[locale]/page.tsx** : placeholder `<main>Phase 0 OK — drpediatre</main>`

### T5 — messages/*.json

Créer 4 fichiers vides `{}` :
- `apps/frontend/messages/fr.json`
- `apps/frontend/messages/en.json`
- `apps/frontend/messages/ar.json`
- `apps/frontend/messages/tzm.json`

(Les UI strings seront remplies en Phase 1)

### T6 — Fonts & RTL

- Charger Figtree + Noto Sans + Noto Sans Tifinagh via `next/font/google` dans `[locale]/layout.tsx`
- Injecter CSS variables : `--font-heading`, `--font-body`, `--font-tifinagh`
- `font-tifinagh` appliquée conditionnellement (`locale === 'tzm'`)
- `dir="rtl"` conditionnellement (`locale === 'ar'`)
- Logiques spatiales RTL : `ms-*`/`me-*`/`ps-*`/`pe-*` (pas `ml-*`/`mr-*` etc.)

### T7 — Build gate validation

```bash
cd apps/frontend && npx tsc --noEmit && npx next build
cd apps/cms && npx tsc --noEmit && npx next build
```

## Fichiers protégés créés

`middleware.ts`, `next.config.ts` × 2, `payload.config.ts`, `messages/*.json` — une fois créés, marqués protégés dans `.kilocode/rules.md`

## Fichiers existants — ne pas toucher

`design-system/MASTER.md`, `components/README.md`, `docs/PRD.md`, `AGENTS.md`, `.kilocode/rules.md`

## Validation

1. `pnpm install` à la racine résout les deux apps
2. `pnpm dev` dans `apps/frontend` démarre sur `http://localhost:3000/fr`
3. `/fr`, `/en`, `/ar`, `/tzm` rendent le placeholder
4. `/ar` a `dir="rtl"` + layout inversé
5. `/tzm` charge `Noto Sans Tifinagh`
6. Cookie `NEXT_LOCALE` mémorise la langue choisie
7. Payload admin accessible sur `http://localhost:3001/admin`
8. Build gate passe (tsc + next build) pour les deux apps

## Hors scope Phase 0

- Payload collections (médecin, services, infos) → Phase 1
- Layout global (header, footer, nav) → Phase 1
- Sélecteur de langue UI → Phase 1
- Contenu réel dans `messages/*.json` → Phase 1
- Reverse proxy Nginx/Caddy sur LXC → post-déploiement Payload
- Provisionnement LXC Proxmox → infra externe
