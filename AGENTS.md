# AGENTS.md — drpediatre

> Règles techniques dans `.kilocode/rules.md`. Périmètre produit et données praticien dans `docs/PRD.md`.

---

## Stack

| Couche | Technologie |
|---|---|
| Framework | Next.js 15 + TypeScript |
| CMS | Payload CMS v3 |
| DB | SQLite (v1) → PostgreSQL (v3 SaaS) |
| i18n | next-intl |
| Styles | Tailwind CSS + tokens design system |
| Design system | UI UX Pro Max → `design-system/MASTER.md` |
| Front | Vercel |
| CMS | Proxmox LXC |

## Locales

| Code | Langue | Direction | Police |
|---|---|---|---|
| `fr` | Français | LTR | — |
| `en` | Anglais | LTR | — |
| `ar` | Arabe | RTL | — |
| `tzm` | Tamazight (Tifinagh) | LTR | Noto Sans Tifinagh |

Routes : `/fr/...` `/en/...` `/ar/...` `/tzm/...`
Détection : `Accept-Language` + cookie de mémorisation.

## Architecture des contenus

```
UI strings (labels, boutons, nav)    →  messages/[locale].json
Contenu métier (bio, services, infos) →  Payload CMS (champs localisés)
```

## Infra

```
Vercel (Next.js)
    ↕ HTTPS
Proxmox LXC
    └── Payload CMS v3
        └── SQLite (drpediatre.db)
```

SSH MCP : activer uniquement après déploiement Payload sur le LXC.

---

## Workflow agents

### Phase 0 — Setup
1. `uipro init --ai kilocode` → `design-system/MASTER.md`
2. Validation design system
3. Init repo GitHub
4. Setup Payload CMS sur LXC
5. Configuration next-intl + middleware routing

### Phase 1 — Planning (DeepSeek V4 Pro)
- Lire `docs/PRD.md` + `design-system/MASTER.md`
- Décomposer en issues GitHub
- Valider architecture i18n et schemas Payload

### Phase 2 — Exécution (DeepSeek V4 Flash)
- Une issue à la fois
- Contexte par prompt : issue + fichiers concernés + fichiers protégés + `design-system/MASTER.md` + `components/README.md`
- Build gate obligatoire en fin d'issue

### Phase 3 — Audit (Claude)
- Sécurité, performance, accessibilité
- Cohérence design system
- Checklist pré-production

---

## Séparation V4 Pro / V4 Flash
- **V4 Pro** : planning, audit, architecture, décomposition en issues
- **V4 Flash** : exécution issue par issue, génération de composants
- Ne jamais mixer sur le même contexte (prefix cache hit rate)
