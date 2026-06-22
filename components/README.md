# Composants — drpediatre

## Layout

### Header
| Champ | Valeur |
|---|---|
| Fichier | `src/components/layout/Header.tsx` |
| Type | Server Component |
| Props | `locale: string` |
| Description | Barre de navigation sticky avec logo, liens de navigation et LanguageSwitcher. Les liens de navigation sont masqués sur mobile (< `md`). Fond blanc avec `backdrop-blur-sm`. |
| Variantes | — |

### LanguageSwitcher
| Champ | Valeur |
|---|---|
| Fichier | `src/components/layout/LanguageSwitcher.tsx` |
| Type | Client Component (`'use client'`) |
| Props | `currentLocale: string` |
| Description | Sélecteur de langue affichant les 4 locales (fr, ar, en, tzm). La locale active est surlignée en `primary-600`. Utilise `usePathname` + `useRouter` de `next-intl/navigation` pour changer la locale sans perdre la route courante. |
| Locales | fr→Français, ar→العربية, en→English, tzm→ⵜⴰⵎⴰⵣⵉⵖⵜ |
| Variantes | — |

### Footer
| Champ | Valeur |
|---|---|
| Fichier | `src/components/layout/Footer.tsx` |
| Type | Server Component |
| Props | Aucune |
| Description | Pied de page simple centré : Dr Guinane Aicha \| Pédiatre — Inezgane, Maroc. |
| Variantes | — |
