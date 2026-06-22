# design-system/MASTER.md — drpediatre

**Version:** 1.0  
**Statut:** Draft  
**Généré par:** UI UX Pro Max + personnalisation  
**Direction artistique:** Doux + rassurant + premium  

> Ce fichier est la Source of Truth design pour le projet drpediatre.  
> Toute décision visuelle (couleurs, typo, espacement, effets) est documentée ici.  
> Les pages spécifiques peuvent déroger via `design-system/pages/<page>.md`.

---

## 1. Identité projet

| Champ | Valeur |
|---|---|
| Projet | drpediatre — Site vitrine pédiatrique |
| Praticien | Dr Guinane Aicha, pédiatre à Inezgane |
| Audience | Parents marocains (Inezgane/Agadir), majorité arabophones/berbérophones |
| Locales | `fr`, `en`, `ar` (RTL), `tzm` (Tifinagh) |
| Stack | Next.js 15 + Tailwind CSS + next-intl |

### Direction artistique

- **Doux** : palette chaude, courbes douces, espacement généreux
- **Rassurant** : badges de confiance, certifications, témoignages, accessibilité WCAG AA+
- **Premium** : typographie forte, hiérarchie claire, finitions soignées (ombres subtiles, transitions fluides)

---

## 2. Palette de couleurs

### 2.1 Couleurs primaires

| Token | Hex | Usage |
|---|---|---|
| `primary-50` | `#F0FDFA` | Surfaces teal très claires |
| `primary-100` | `#CCFBF1` | Badges, tags |
| `primary-200` | `#99F6E4` | Bordures décoratives |
| `primary-300` | `#5EEAD4` | Icônes, accents légers |
| `primary-400` | `#2DD4BF` | Liens secondaires |
| `primary-500` | `#14B8A6` | États hover primaires |
| **`primary-600`** | **`#0D9488`** | **Couleur principale (brand)** |
| `primary-700` | `#0F766E` | Hover foncé, états actifs |
| `primary-800` | `#115E59` | Textes sur fond clair |
| `primary-900` | `#134E4A` | Textes, icônes foncés |
| `primary-950` | `#042F2E` | Très foncé, rare |

> Ces tokens mappent sur l'échelle native Tailwind `teal`. Aucune extension nécessaire.

### 2.2 Couleurs secondaires (chaleur marocaine)

| Token | Hex | Usage |
|---|---|---|
| `secondary-50` | `#FFFBEB` | Surfaces ambrées très claires |
| `secondary-100` | `#FEF3C7` | Badges, highlights |
| `secondary-200` | `#FDE68A` | Accents décoratifs |
| `secondary-300` | `#FCD34D` | Icônes warning doux |
| `secondary-400` | `#FBBF24` | Accents actifs |
| **`secondary-500`** | **`#F59E0B`** | **Couleur secondaire (accents chauds)** |
| `secondary-600` | `#D97706` | Hover secondaire |
| `secondary-700` | `#B45309` | Textes sur fond clair |
| `secondary-800` | `#92400E` | Textes, icônes foncés |
| `secondary-900` | `#78350F` | Très foncé |

> Ces tokens mappent sur l'échelle native Tailwind `amber`.

### 2.3 Couleur CTA (call-to-action)

| Token | Hex | Usage |
|---|---|---|
| `cta-50` | `#FFF7ED` | Surfaces CTA claires |
| `cta-100` | `#FFEDD5` | Badges CTA |
| `cta-200` | `#FED7AA` | — |
| `cta-300` | `#FDBA74` | — |
| `cta-400` | `#FB923C` | — |
| **`cta-500`** | **`#F97316`** | **CTA principal (boutons, liens d'action)** |
| `cta-600` | `#EA580C` | Hover CTA |
| `cta-700` | `#C2410C` | Press/active CTA |
| `cta-800` | `#9A3412` | — |
| `cta-900` | `#7C2D12` | — |

> Ces tokens mappent sur l'échelle native Tailwind `orange`.

### 2.4 Neutres chauds (fond crème, pas blanc clinique)

| Token | Hex | Usage |
|---|---|---|
| `cream-50` | `#FFFDF7` | Fond le plus clair |
| **`cream-100`** | **`#FFFBF0`** | **Fond de page principal** |
| `cream-200` | `#FFF7E0` | Fond alternatif |
| `cream-300` | `#FEF0C7` | Surfaces surélevées |
| `cream-400` | `#FDE8A7` | Bordures chaudes |
| `cream-500` | `#FDE08A` | Accents fond |
| `cream-600` | `#F5D06A` | — |
| `cream-700` | `#E8B84B` | — |
| `cream-800` | `#D4A02D` | — |
| `cream-900` | `#A67C1A` | — |

> ⚠️ **Custom Tailwind** : `cream` n'existe pas nativement. Déclarer dans `extend.colors` (voir §5).

### 2.5 Neutres texte & bordures (pierre chaude, pas gris froid)

| Token | Hex | Usage |
|---|---|---|
| `stone-50` | `#FAFAF9` | Surface alternative |
| `stone-100` | `#F5F5F4` | — |
| `stone-200` | `#E7E5E4` | Bordures, séparateurs |
| `stone-300` | `#D6D3D1` | Bordures focus, disabled |
| `stone-400` | `#A8A29E` | Texte muted, placeholders |
| `stone-500` | `#78716C` | Texte secondaire |
| **`stone-600`** | **`#57534E`** | **Texte body** |
| `stone-700` | `#44403C` | Texte headings secondaires |
| **`stone-800`** | **`#292524`** | **Texte principal (headings)** |
| `stone-900` | `#1C1917` | Texte très foncé |
| `stone-950` | `#0C0A09` | — |

> Ces tokens mappent sur l'échelle native Tailwind `stone`. Aucune extension.

### 2.6 Couleurs sémantiques

| Token | Hex | Usage |
|---|---|---|
| `success-500` | `#22C55E` | Succès, confirmation |
| `success-600` | `#16A34A` | Texte succès |
| `success-50` | `#F0FDF4` | Fond succès |
| `error-500` | `#EF4444` | Erreur, danger |
| `error-600` | `#DC2626` | Texte erreur |
| `error-50` | `#FEF2F2` | Fond erreur |
| `warning-500` | `#F59E0B` | Avertissement (réutilise secondary-500) |
| `warning-50` | `#FFFBEB` | Fond avertissement |
| `info-500` | `#0EA5E9` | Information |
| `info-50` | `#F0F9FF` | Fond info |

### 2.7 Règle d'usage des couleurs

- **Ne jamais** utiliser les tokens Tailwind bruts (`teal-600`, `amber-500`) dans les composants
- **Toujours** utiliser les alias sémantiques (`primary`, `secondary`, `cta`, `cream`, `stone`)
- Exception : couleurs sémantiques (`success`, `error`) et couleurs one-shot dans `extend`

---

## 3. Typographie

### 3.1 Font families par locale

| Locale | Heading | Body | Direction |
|---|---|---|---|
| `fr` | Figtree | Noto Sans | LTR |
| `en` | Figtree | Noto Sans | LTR |
| `ar` | Figtree | Noto Sans | **RTL** |
| `tzm` | Figtree | **Noto Sans Tifinagh** | LTR |

- **Figtree** : Sans-serif géométrique chaud, excellente lisibilité, poids variables (300–700)
- **Noto Sans** : Sans-serif humaniste, couverture Unicode exhaustive (latin + arabe)
- **Noto Sans Tifinagh** : Police spécifique pour le script Tifinagh (tzm)

### 3.2 Échelle typographique

| Token | Taille | Line-height | Poids | Usage |
|---|---|---|---|---|
| `text-xs` | `0.75rem` (12px) | `1rem` (16px) | 400 | Labels, badges |
| `text-sm` | `0.875rem` (14px) | `1.25rem` (20px) | 400 | Texte secondaire, captions |
| `text-base` | `1rem` (16px) | `1.5rem` (24px) | 400 | **Body (minimum 16px)** |
| `text-lg` | `1.125rem` (18px) | `1.75rem` (28px) | 400 | Body large, citations |
| `text-xl` | `1.25rem` (20px) | `1.75rem` (28px) | 500 | Sous-titres |
| `text-2xl` | `1.5rem` (24px) | `2rem` (32px) | 600 | Titres de section mobile |
| `text-3xl` | `1.875rem` (30px) | `2.25rem` (36px) | 600 | Titres de section desktop |
| `text-4xl` | `2.25rem` (36px) | `2.5rem` (40px) | 700 | Hero mobile |
| `text-5xl` | `3rem` (48px) | `1` (tight) | 700 | Hero desktop |
| `text-6xl` | `3.75rem` (60px) | `1` (tight) | 700 | Hero large (optionnel) |

### 3.3 Poids de police

| Poids | Token | Usage |
|---|---|---|
| 300 | `font-light` | Texte décoratif, citations |
| 400 | `font-normal` | Body, labels |
| 500 | `font-medium` | Sous-titres, navigation |
| 600 | `font-semibold` | Titres, CTA |
| 700 | `font-bold` | Hero, emphasis forte |

### 3.4 Chargement des polices

Les polices sont chargées via `next/font/google` dans le code, pas via CSS `@import`.

```ts
// Exemple d'utilisation dans un composant layout
import { Figtree, Noto_Sans, Noto_Sans_Tifinagh } from 'next/font/google'

const figtree = Figtree({
  subsets: ['latin', 'arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading',
})

const notoSans = Noto_Sans({
  subsets: ['latin', 'arabic'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-body',
})

const tifinagh = Noto_Sans_Tifinagh({
  subsets: ['tifinagh'],
  weight: ['400'],
  variable: '--font-tifinagh',
})
```

> Référence Next.js : https://nextjs.org/docs/app/building-your-application/optimizing/fonts

---

## 4. Tokens de design

### 4.1 Espacement — Échelle 4px-based

Utiliser l'échelle Tailwind par défaut (basée sur `0.25rem` = 4px).

| Token | Valeur | Usage |
|---|---|---|
| `space-1` | `0.25rem` (4px) | Micro-espacement |
| `space-2` | `0.5rem` (8px) | Icône↔texte, inline gaps |
| `space-4` | `1rem` (16px) | Padding interne par défaut |
| `space-6` | `1.5rem` (24px) | Gap sections, cartes |
| `space-8` | `2rem` (32px) | Padding sections mobiles |
| `space-12` | `3rem` (48px) | Padding sections desktop |
| `space-16` | `4rem` (64px) | Gap entre sections majeures |
| `space-20` | `5rem` (80px) | Hero padding |
| `space-24` | `6rem` (96px) | — |

### 4.2 Bordures & Radius

| Token | Valeur | Usage |
|---|---|---|
| `rounded-sm` | `0.125rem` (2px) | Inputs, champs formulaire |
| `rounded` | `0.25rem` (4px) | Cartes, conteneurs |
| `rounded-md` | `0.375rem` (6px) | — |
| `rounded-lg` | `0.5rem` (8px) | **Boutons, cartes interactives (défaut)** |
| `rounded-xl` | `0.75rem` (12px) | Cartes premium, modales |
| `rounded-2xl` | `1rem` (16px) | Hero cards, grandes surfaces |
| `rounded-full` | `9999px` | Avatars, badges, pills |

**Règle :** `rounded-lg` (8px) par défaut pour tous les éléments interactifs.

### 4.3 Ombres

| Token | Valeur | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | Élévation minimale |
| **`shadow`** | **`0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.05)`** | **Cartes (défaut)** |
| `shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)` | Cartes hover, dropdowns |
| `shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)` | Modales, navigation sticky |
| `shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.05)` | Hero cards |

**Règle :** Ombres naturelles, pas de glow néon. Profondeur douce.

### 4.4 Transitions & Animations

| Token | Valeur | Usage |
|---|---|---|
| `duration-150` | `150ms` | Micro-interactions (hover boutons) |
| **`duration-200`** | **`200ms`** | **Transitions standard (défaut)** |
| `duration-300` | `300ms` | Transitions de page, modales |
| `duration-500` | `500ms` | Animations décoratives (max) |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entrées, apparitions |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transitions UI standard |

**Règles animation :**
- `transition-colors duration-200` sur tous les éléments interactifs
- Pas d'animations >500ms
- `prefers-reduced-motion` : désactiver toutes les animations
- Pas de `transform: scale()` sur hover (layout shift)

### 4.5 Focus & Accessibilité

| Propriété | Valeur |
|---|---|
| Focus ring | `focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2` |
| Focus ring offset | `2px` |
| Touch target min | `44x44px` (WCAG) |
| Contrast ratio min | `4.5:1` (texte normal), `3:1` (texte large) |

---

## 5. Configuration Tailwind

### 5.1 `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:   colors.teal,
        secondary: colors.amber,
        cta:       colors.orange,
        cream: {
          '50':  '#FFFDF7',
          '100': '#FFFBF0',  // Fond de page principal
          '200': '#FFF7E0',
          '300': '#FEF0C7',
          '400': '#FDE8A7',
          '500': '#FDE08A',
          '600': '#F5D06A',
          '700': '#E8B84B',
          '800': '#D4A02D',
          '900': '#A67C1A',
        },
      },
      fontFamily: {
        heading:   ['var(--font-heading)', 'Figtree', 'sans-serif'],
        body:      ['var(--font-body)', 'Noto Sans', 'sans-serif'],
        tifinagh:  ['var(--font-tifinagh)', 'Noto Sans Tifinagh', 'Noto Sans', 'sans-serif'],
      },
      maxWidth: {
        'container': '1200px',
      },
    },
  },
  plugins: [],
}

export default config
```

### 5.2 Convention de nommage Tailwind

| Règle | Exemple |
|---|---|
| **Alias sémantiques UNIQUEMENT** | `bg-primary-600`, `text-primary-700`, `border-stone-200` |
| Jamais de couleurs Tailwind brutes | ❌ `bg-teal-600` → ✅ `bg-primary-600` |
| Couleurs custom via `extend` | `bg-cream-100` |
| États via préfixes Tailwind | `hover:bg-primary-700`, `focus:ring-primary-500` |
| Responsive via préfixes Tailwind | `md:px-12`, `lg:text-5xl` |

---

## 6. Conventions RTL & i18n

### 6.1 Direction par locale

| Locale | Direction | Classe racine |
|---|---|---|
| `fr` | LTR | `<html dir="ltr">` |
| `en` | LTR | `<html dir="ltr">` |
| `ar` | RTL | `<html dir="rtl">` |
| `tzm` | LTR | `<html dir="ltr">` |

### 6.2 RTL avec Tailwind

- Utiliser les préfixes **logiques** : `ms-*` (margin-start), `me-*` (margin-end), `ps-*` (padding-start), `pe-*` (padding-end)
- ❌ `ml-4`, `mr-4` → ✅ `ms-4`, `me-4`
- ❌ `pl-4`, `pr-4` → ✅ `ps-4`, `pe-4`
- ❌ `text-left`, `text-right` → ✅ `text-start`, `text-end`
- ❌ `rounded-l`, `rounded-r` → ✅ `rounded-s`, `rounded-e`

### 6.3 Font Tifinagh (`tzm`)

La locale `tzm` utilise `font-tifinagh` pour le body :

```tsx
// layout.tsx pour la locale tzm
<body className={`font-heading ${locale === 'tzm' ? 'font-tifinagh' : 'font-body'}`}>
```

### 6.4 Images & icônes directionnelles

- Icônes directionnelles mirrorées en RTL avec `rtl:scale-x-[-1]`
- Exemple : `<ChevronRight className="rtl:scale-x-[-1]" />`

---

## 7. Conventions composants

### 7.1 Icônes

| Règle | ✅ Do | ❌ Don't |
|---|---|---|
| Bibliothèque | Lucide React (tree-shakeable) | Emojis comme icônes |
| Taille | `size-5` (20px) ou `size-6` (24px) | Tailles variables aléatoires |
| ViewBox | `0 0 24 24` standard | ViewBox non standard |
| Touch target | Min 44x44px autour de l'icône | Icône seule sans padding cliquable |

### 7.2 Boutons

```tsx
// ✅ Bouton primaire
<button className="
  inline-flex items-center justify-center gap-2
  px-6 py-3 rounded-lg
  bg-primary-600 text-white font-semibold
  hover:bg-primary-700
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  transition-colors duration-200
  cursor-pointer
  min-h-[44px] min-w-[44px]
">
  <IconName className="size-5" />
  {label}
</button>
```

| Variante | Classes |
|---|---|
| **Primary** | `bg-primary-600 text-white hover:bg-primary-700` |
| **Secondary** | `bg-cream-200 text-primary-800 hover:bg-cream-300 border border-cream-400` |
| **CTA** | `bg-cta-500 text-white hover:bg-cta-600 font-bold` |
| **Ghost** | `text-stone-600 hover:text-primary-600 hover:bg-cream-100` |
| **Disabled** | `opacity-50 cursor-not-allowed pointer-events-none` |

### 7.3 Cartes

```tsx
// ✅ Carte standard
<div className="
  bg-white rounded-lg shadow
  border border-stone-200
  p-6
  hover:shadow-md transition-shadow duration-200
  cursor-pointer
">
```

### 7.4 Formulaire

```tsx
// ✅ Input standard
<input className="
  w-full px-4 py-3 rounded-lg
  bg-white border border-stone-300
  text-stone-800 placeholder:text-stone-400
  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
  transition-colors duration-200
  min-h-[44px]
" />
```

### 7.5 Skip-to-content

```tsx
// ✅ Premier élément focusable
<a href="#main-content" className="
  sr-only focus:not-sr-only
  focus:fixed focus:top-4 focus:left-4 focus:z-50
  focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg
">
  Skip to main content
</a>
```

### 7.6 Responsive

| Breakpoint | Largeur | Usage |
|---|---|---|
| **Base** | `< 640px` | Mobile (défaut) |
| `sm` | `640px` | Grand mobile |
| `md` | `768px` | Tablette |
| **`lg`** | **`1024px`** | **Desktop (point de bascule principal)** |
| `xl` | `1280px` | Grand écran |
| `2xl` | `1536px` | Très grand écran |

- **Mobile-first** : commencer par le style mobile, ajouter `md:` puis `lg:`
- **Container** : `max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8`

---

## 8. Anti-patterns & Règles

### 8.1 Ne jamais faire

| ❌ Anti-pattern | ✅ Correction |
|---|---|
| `bg-teal-600` (couleur Tailwind brute) | `bg-primary-600` (alias sémantique) |
| `ml-4` (margin physique) | `ms-4` (margin logique RTL-compatible) |
| `outline-none` sans remplacement | `focus:ring-2 focus:ring-primary-500` |
| Emojis comme icônes (🎨 🚀 ⚙️) | Lucide React SVG |
| `transform scale-105` sur hover | `transition-shadow` + `shadow-md` |
| Textes `< 16px` pour le body | Minimum `text-base` (16px) |
| Blanc pur `#FFFFFF` pour le fond page | `bg-cream-100` (chaud) |
| Noir pur `#000000` pour le texte | `text-stone-800` (chaud) |
| Animations > 500ms | Max `duration-300` |
| Dégradés violet/rose (AI-looking) | Palette teal/amber définie |

### 8.2 Spécifique médical

- **Badges de confiance** : afficher certifications, années d'expérience, affiliations
- **Photos authentiques** : pas de stock photos génériques — photo réelle du Dr Guinane
- **Langage clair** : éviter le jargon médical excessif, rester accessible aux parents
- **Coordonnées visibles** : adresse, téléphone, horaires toujours à portée de clic

---

## 9. Checklist pré-livraison

### Qualité visuelle
- [ ] Aucun emoji utilisé comme icône (Lucide React uniquement)
- [ ] Icônes cohérentes (`size-5` ou `size-6`, ViewBox 24x24)
- [ ] Hover states sans layout shift (pas de `scale`)
- [ ] Couleurs sémantiques (`primary`, pas `teal-600`)

### Interaction
- [ ] `cursor-pointer` sur tous les éléments cliquables
- [ ] Hover states avec feedback visuel clair
- [ ] Transitions `duration-200` sur tous les éléments interactifs
- [ ] Focus rings visibles (2px + offset 2px)

### Accessibilité
- [ ] Contraste texte ≥ 4.5:1 (normal), ≥ 3:1 (large)
- [ ] Touch targets ≥ 44x44px
- [ ] Skip-to-content link présent
- [ ] `alt` text sur toutes les images
- [ ] `aria-label` sur les boutons icônes seuls
- [ ] `role="alert"` sur les messages d'erreur
- [ ] `prefers-reduced-motion` respecté

### RTL & i18n
- [ ] Margins/paddings logiques (`ms-*`, `me-*`, `ps-*`, `pe-*`)
- [ ] Textes alignés logiquement (`text-start`, `text-end`)
- [ ] Icônes directionnelles mirrorées (`rtl:scale-x-[-1]`)
- [ ] Layout testé en arabe (RTL)
- [ ] Police Tifinagh chargée et fonctionnelle en `tzm`

### Responsive
- [ ] Testé à 375px, 768px, 1024px, 1440px
- [ ] Pas de scroll horizontal
- [ ] Contenu non caché derrière la navbar
- [ ] `max-w-[1200px]` cohérent sur toutes les sections

### Performance
- [ ] Fonts chargées via `next/font` (pas de CDN bloquant)
- [ ] Images avec `width`/`height` ou `fill` (pas de layout shift)
- [ ] Lighthouse ≥ 90 sur toutes les métriques

---

## 10. Références

| Ressource | Lien |
|---|---|
| Figtree (Google Fonts) | https://fonts.google.com/specimen/Figtree |
| Noto Sans (Google Fonts) | https://fonts.google.com/noto/specimen/Noto+Sans |
| Noto Sans Tifinagh (Google Fonts) | https://fonts.google.com/noto/specimen/Noto+Sans+Tifinagh |
| Lucide React (icônes) | https://lucide.dev |
| Tailwind CSS docs | https://tailwindcss.com/docs |
| WCAG 2.1 AA | https://www.w3.org/TR/WCAG21/ |
| RTL Styling (Tailwind) | https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support |
