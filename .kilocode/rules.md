# .kilocode/rules.md — drpediatre

## Build Gate (obligatoire avant chaque push)

```bash
npx tsc --noEmit && npx next build
```

Toute réponse Kilo se termine par le résultat du build gate. En cas d'erreur TypeScript sur Vercel : diagnostic via logs d'abord, jamais de fix aveugle.

---

## Fichiers protégés (ne jamais modifier sans instruction explicite)

```
design-system/MASTER.md
components/README.md
messages/fr.json
messages/en.json
messages/ar.json
messages/tzm.json
payload.config.ts
next.config.ts
middleware.ts
migrations/*.ts
docs/PRD.md
AGENTS.md
```

---

## Internationalisation

- Ne jamais hardcoder une UI string — tout passe par `messages/[locale].json`
- `ar` est RTL → tout composant doit supporter `dir="rtl"` via la prop locale
- `tzm` utilise Tifinagh → police `Noto Sans Tifinagh` chargée uniquement pour la locale `tzm` via `next/font`
- Séparation stricte : UI strings → `messages/*.json` / contenu métier → Payload CMS

---

## Payload CMS

- Ne jamais modifier un schema Payload sans générer et afficher la migration d'abord
- Dev : `payload migrate:fresh` autorisé
- Prod : migrations reviewées et approuvées avant apply
- Ne pas introduire de dépendances PostgreSQL-only (DB cible v1 = SQLite)

---

## Migrations Payload — règle obligatoire

Avant tout commit modifiant un fichier de collection dans `apps/cms/src/collections/`,
ou tout changement de schéma dans `payload.config.ts` :

1. Lancer `npx payload migrate:create` en LOCAL (jamais en prod)
2. Vérifier le contenu du fichier généré — s'assurer qu'il ne contient QUE le diff attendu
   (pas de CREATE TABLE en double pour des tables déjà existantes — signe de désync du
   snapshot de migration)
3. Ajouter le nouveau fichier au tableau `migrations` dans `apps/cms/src/migrations/index.ts`
4. Commit le fichier de migration ET le changement de collection dans le MÊME commit
5. Ne jamais commit un changement de collection sans la migration correspondante

Ne jamais utiliser `push: true` — il est silencieusement ignoré en `NODE_ENV=production`
et créera un décalage entre le schéma réel et l'historique des migrations.

---

## Composants

- Toute création ou modification de composant met à jour `components/README.md` (nom, props, variantes)
- Avant de créer un composant, vérifier dans `components/README.md` qu'il n'existe pas déjà

## Design System

- Toujours lire `design-system/MASTER.md` avant de générer ou modifier un composant UI
- Ne jamais introduire de valeurs de couleur, typographie ou espacement en dur — tokens CSS uniquement

---

## GitHub & Git

- Jamais de git manuel — tout passe par GitHub MCP
- Toujours lire les fichiers via GitHub MCP (ne jamais supposer que le local reflète le remote)
- Chaque prompt = périmètre fichiers explicite + liste des fichiers à ne pas toucher

---

## Checkpoints

- Checkpoint obligatoire à ~400K tokens → `.kilocode/checkpoint-[phase]-[date].md`

---

## Interdits

- Pas de `any` TypeScript sans commentaire justificatif
- Pas de `console.log` en production
- Pas de contenu hardcodé en une seule langue
- Pas de styles inline — Tailwind + tokens uniquement
