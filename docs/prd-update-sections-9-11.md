# Plan: Mise à jour docs/PRD.md — Sections 9 et 11

## Objectif

Mettre à jour `docs/PRD.md` pour refléter l'état réel du projet (v1, v1.5, v2, v3) et marquer comme résolues 3 décisions de la section 11.

## Fichier concerné

`docs/PRD.md` — sections 9 et 11 uniquement.

## Edit 1 — Section 9 (remplacement complet des phases 0-4)

**oldText:** (lignes 114–143)
```
## 9. Phases de développement

### Phase 0 — Setup
- [ ] Init repo GitHub
- [ ] `uipro init --ai kilocode` → validation design system
- [ ] Setup Payload CMS sur LXC Proxmox
- [ ] next-intl + middleware routing + `messages/*.json` vides

### Phase 1 — Foundation
- [ ] Layout global (header, footer, nav)
- [ ] Sélecteur de langue + détection auto
- [ ] Support RTL (`ar`) + Tifinagh (`tzm`)
- [ ] Schemas Payload (médecin, services, infos)

### Phase 2 — Contenu
- [ ] Sections : Présentation, Services, Infos pratiques, Contact
- [ ] Carte Google Maps (coordonnées GPS)
- [ ] Génération drafts IA (4 langues)

### Phase 3 — SEO & Performance
- [ ] Métadonnées + hreflang par locale
- [ ] Sitemap multilingue + robots.txt
- [ ] Optimisation Core Web Vitals (LCP < 2.5s, CLS < 0.1)
- [ ] Audit Lighthouse

### Phase 4 — Audit final (Claude)
- [ ] Sécurité, accessibilité WCAG 2.1 AA
- [ ] Cohérence design system
- [ ] Checklist pré-production
```

**newText:**
```
## 9. Versions

### v1 — ✅ TERMINÉE
Site statique multilingue (Next.js 15, next-intl, Tailwind CSS), 4 locales
(fr, en, ar RTL, tzm Tifinagh), pages : accueil, présentation, services,
infos pratiques, contact. Lighthouse ≈ 99/96/100. Déployé sur
`drguinane.vercel.app`.

### v1.5 — ✅ TERMINÉE
Payload CMS v3.85.1 intégré (collections Doctors, Services, Media, global
PracticeInfo), Neon Postgres, Cloudflare R2, admin sur
`dr-pediatre-cms.vercel.app`. Frontend reste hardcodé — branchement
Payload→frontend reporté à v3 (restructuration multi-tenant rendrait ce
travail obsolète).

### v2 — 🚧 EN COURS
Cal.com opérationnel sur Proxmox LXC (NPM + Cloudflare Tunnel). Objectif :
intégrer widget Cal.com dans le frontend. Condition de passage à v3 :
validation Cal.com par le client + acquisition d'un 2e praticien.

### v3 — 📋 PLANIFIÉE
Infrastructure distribuée managée : Vercel (frontend Next.js), Vercel ou
autre (Payload CMS), Neon Postgres multi-tenant, Cloudflare R2, VPS pour
Cal.com stateless (DB sur Neon). Restructuration Payload multi-tenant,
branchement frontend→Payload, dossier patient, outils cliniques.
```

## Edit 2 — Section 11, ligne "Reverse proxy LXC"

**oldText:**
```
| Reverse proxy LXC (Nginx/Caddy) | À configurer |
```

**newText:**
```
| Reverse proxy LXC | ✅ NPM + Cloudflare Tunnel |
```

## Edit 3 — Section 11, ligne "Migration SQLite → PostgreSQL"

**oldText:**
```
| Migration SQLite → PostgreSQL | À faire en v2 (requis par Cal.com) |
```

**newText:**
```
| Migration SQLite → PostgreSQL | ✅ Neon Postgres en production |
```

## Edit 4 — Section 11, ligne "Cal.com self-hosted"

**oldText:**
```
| Cal.com self-hosted sur Proxmox LXC | À déployer en v2, widget Next.js + shadcn/ui intégré dans le site |
```

**newText:**
```
| Cal.com self-hosted sur Proxmox LXC | ✅ Opérationnel |
```

## Validation

- Relire `docs/PRD.md` après les modifications
- Vérifier que les sections 1-8 et 10 sont inchangées
- Vérifier que les ancres markdown ne sont pas cassées (le titre `## 9. Versions` remplace `## 9. Phases de développement`)
