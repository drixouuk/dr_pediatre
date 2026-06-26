# PRD — drpediatre v1

**Version** : 1.0 — Statut : Draft — Scope : Vitrine (v1)

> Stack, locales et workflow agents dans `AGENTS.md`. Règles Kilo dans `.kilocode/rules.md`.

---

## 1. Praticien

| Champ | Valeur |
|---|---|
| Nom | Dr Guinane Aicha |
| Spécialité | Pédiatre |
| Adresse | Face au souk Al Houria, porte 10, Immeuble Nassim, 1er étage, bureau 4, Inezgane |
| GPS | 30.3576702, -9.5279038 |
| Horaires | Lun–Ven 08:30–16:30 / Sam 09:00–13:00 |
| Paiement | Espèces |
| Langues parlées | Français, Arabe |

**Données manquantes (à fournir par le médecin) :**
- Téléphone
- Email
- Bio / parcours médical
- Spécialités détaillées
- Photo professionnelle
- Nom de domaine

---

## 2. Problème & Solution

**Problème** : Le Dr Guinane n'a pas de site propre. Les parents qui cherchent un pédiatre à Inezgane ne la trouvent qu'à travers des plateformes tierces (tbibclic, Google Maps), sans pouvoir évaluer son profil ni obtenir ses infos directement.

**Solution v1** : Site vitrine multilingue, SEO-optimisé, géré de façon autonome par le médecin via Payload CMS.

**Roadmap** : vitrine (v1) → prise de rendez-vous (v2) → SaaS multi-cabinet (v3)

---

## 3. Utilisateurs cibles

**Parents de nouveaux patients** (région Inezgane / Agadir)
- Cherchent un pédiatre pour leur enfant
- Profil linguistique : majorité arabophones/berbérophones, une partie francophone
- Sensibles à la confiance et à la chaleur humaine

**Le médecin** (administrateur)
- Gère son contenu en autonomie via Payload CMS

---

## 4. Objectifs v1

| Objectif | Indicateur |
|---|---|
| Référencement local | Top 3 Google "pédiatre Inezgane" / "طبيب أطفال إنزكان" |
| Crédibilité | Taux de rebond < 50% |
| Multilingue | Site fonctionnel en fr, en, ar, tzm |
| Autonomie médecin | Contenu modifiable sans développeur |
| Performance | Lighthouse ≥ 90 sur toutes les métriques |

---

## 5. Périmètre v1

**Inclus**
- Page d'accueil unique (hero, présentation, services, infos pratiques)
- Navigation multilingue + sélecteur de langue
- Détection automatique de langue (navigateur + cookie)
- Support RTL (arabe) + Tifinagh (tamazight)
- Formulaire de contact
- Back-office Payload CMS
- SEO : métadonnées, Open Graph, hreflang, sitemap, robots.txt

**Exclus**
- Prise de rendez-vous (v2)
- Espace patient, auth, paiement (v3)
- Blog / articles santé

---

## 6. Structure de la page

```
Header        logo + navigation + sélecteur de langue
Hero          photo médecin + accroche + CTA contact
Présentation  parcours, approche, valeurs
Services      spécialités traitées
Infos         adresse, horaires, téléphone, carte
Contact       formulaire simple
Footer
```

---

## 7. Contenu

**Stratégie** : drafts générés par IA (Claude) dans les 4 langues, importés dans Payload, affinés par le médecin.

**Mots-clés SEO cibles** : "pédiatre Inezgane", "pédiatre Agadir", "طبيب أطفال إنزكان", "دكتور أطفال إنزكان"

---

## 8. Direction artistique

**Doux + rassurant + premium**
- Couleurs chaudes, espaces généreux → parents rassurés
- Typographie forte, mise en page maîtrisée → crédibilité médicale
- Palette et fonts définitives → `design-system/MASTER.md` (via UI UX Pro Max)

---

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

---

## 10. Vision SaaS v3

### Positionnement
Plateforme SaaS pour praticiens indépendants au Maroc.
Différenciateurs : prix accessible + site brandé propre (vs fiche anonyme sur Doctolib/tbibclic).

### Cible
Tout praticien indépendant (pédiatre, généraliste, kiné, psy, dermato...) et cabinets multi-praticiens — acquisition progressive par segment.

### Modèle économique
Abonnement mensuel par cabinet. Acquisition commerciale (démarchage manuel + onboarding assisté pour tous les tiers).

### Domaines
- Sous-domaine par défaut : `dr-guinane.tondomaine.ma`
- Domaine custom en option premium : `drguinane.ma`

### 4 tiers d'abonnement

| Tier | Contenu |
|---|---|
| 1 | Site vitrine brandé |
| 2 | Vitrine + prise de rendez-vous (Cal.com) |
| 3 | Vitrine + RDV + dossier patient basique |
| 4 | Tout + fonctions métier (ordonnances, certificats, suivi...) |

### Géographie
Maroc uniquement (v3). Expansion Maghreb + diaspora en v4.

### Décisions ouvertes v3
- Pricing par tier (montants)
- Stack fonctions métier tier 4 (from scratch vs intégration EMR existant)
- Modèle multi-tenant technique (schema PostgreSQL par cabinet vs row-level security)

---

## 11. Décisions ouvertes

| Décision | Statut |
|---|---|
| Nom de domaine | À définir |
| Coordonnées contact | À fournir par le médecin |
| Bio + spécialités | À fournir par le médecin |
| Photo professionnelle | À fournir par le médecin |
| Reverse proxy LXC | ✅ NPM + Cloudflare Tunnel |
| Migration SQLite → PostgreSQL | ✅ Neon Postgres en production |
| Cal.com self-hosted sur Proxmox LXC | ✅ Opérationnel |
| Cal.com API multi-tenant | À architecturer en v3 (un event type par cabinet) |
| Rôles utilisateurs v2 | Médecin (contenu) + Assistante (gestion RDV/agenda) — permissions séparées dans Payload et Cal.com |
