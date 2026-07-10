# Roadmap post-v3 — Digitalisation santé Maroc (AMO / FSE / DMP)

**Contexte** : dr-tabibi (v1 vitrine, v2 réservation Cal.com, v3 SaaS multi-tenant déclenché au 2e client).
Cette roadmap prépare une **v4 "Interopérabilité santé publique"**, à activer selon la dynamique commerciale — pas forcément dans l'ordre strict, certaines briques (référentiels, conformité) sont utiles même en v3.

---

## 0. Contexte réglementaire et calendrier (à date)

- Pilote FSE à **Kénitra fin mars 2026**, généralisation nationale **avril-juin 2026**, coexistence papier/électronique pendant la transition.
- Loi 54.23 (BO 29/01/2026) : transfert AMO public CNOPS → CNSS, enfants à charge couverts jusqu'à 30 ans — pertinent en pédiatrie.
- **DMP (dossier patient partagé) et FSE partagent le même identifiant santé unique** et la même plateforme : ce n'est pas deux chantiers séparés dans le temps, c'est une seule architecture de données à concevoir ensemble.
- La CNSS a lancé un **chantier d'homologation des éditeurs de logiciels** (appel d'offres, tests/audits depuis fin 2025) ; des éditeurs marocains (ex. Nabady) sont déjà en phase d'interfaçage avancée.
- Le marché des logiciels de cabinet a déjà intégré l'argumentaire "OCR carte CNSS + FSE" comme standard attendu (ex. GestiCab) — donc la simple "feuille de soins PDF pré-remplie" ne sera plus un vrai différenciateur d'ici la généralisation.
- Le circuit prescripteur : ordonnance créée via le logiciel du médecin (s'il est homologué) OU via le portail FSE gratuit de la CNSS → **QR code + numéro FSE unique** transmis au patient, scanné ensuite par pharmacien/labo/radiologue.

**Conséquence stratégique** : ne pas traiter FSE et DMP comme deux features à ajouter à la fin, mais concevoir dès maintenant le dossier patient (collection Payload) avec les champs et l'identifiant qui seront réutilisables pour les deux.

---

## Étape 1 — Fondations conformité & souveraineté des données

**Horizon : avant tout traitement de données CNSS/santé sensibles, donc idéalement en parallèle du reste de v3**

- **Hébergement** : ton infra tourne déjà sur Proxmox homelab (Coolify LXC 128). Pour la roadmap v3 tu prévois déjà OVHcloud Rabat (HDS/ISO 27001) — c'est le bon choix, et c'est un prérequis légal pour manipuler des données AMO/CNSS de patients (loi 09-08).
- **Dossier CNDP "clé en main"** : template de déclaration de traitement pré-rempli, fourni à chaque médecin client. Argument de vente rassurant, différenciateur commercial fort dans le discours face aux médecins hésitants.
- **Consentement patient** : les règles de consentement pour le DMP restent explicitement non finalisées côté CNSS à ce stade — prévoir un module de consentement configurable dans le dossier patient plutôt que de coder une logique figée, pour pouvoir s'adapter sans refonte quand la CNSS publiera ses règles définitives.
- **Modélisation de l'identifiant santé unique** dès maintenant dans le schéma Payload (`PracticeInfo`/`Patient` collection), même si non branché à un système externe encore — évite une migration douloureuse plus tard, cohérent avec ta discipline "migrations Payload propres".

---

## Étape 2 — Module AMO/CNSS orienté cabinet (workflow, pas juste PDF)

**Horizon : dès que le 2e client SaaS se profile, ou avant si Dr. Guinane en a besoin en solo**

Objectif : gagner du temps admin sans dépendre d'une API CNSS encore fermée, mais construire des **données structurées réutilisables**, pas juste un formulaire imprimable.

1. **Capture patient** : champ immatriculation CNSS/AMO + upload carte d'affiliation/CIN, avec recadrage/OCR (comme GestiCab — c'est devenu un standard, pas un luxe).
2. **Fiche patient enrichie** : ces données remontent dans le dossier patient Payload, avec `localized: true` là où pertinent (déjà ta pratique pour `PracticeInfo`).
3. **Génération FSE "hybride"** :

- Génère un PDF conforme au format CNSS actuel (comme prévu initialement), MAIS
- Structure en parallèle chaque acte/consultation avec un code catalogue (voir étape 3), pour que le passage à la vraie FSE électronique soit un changement de canal de transmission, pas une refonte de données.

4. **Suivi des remboursements** (différenciateur vs simple génération de PDF) : statut FSE envoyée → acceptée → remboursée, avec alerte si délai anormal — le marché (GestiCab) positionne déjà ça comme argument n°1 (trésorerie du cabinet), donc ne pas le sous-estimer même en version "papier".

---

## Étape 3 — Référentiels officiels & DMP-ready dès la conception

**Horizon : à mener en parallèle de l'étape 2, pas après**

- **Nomenclature des actes (NGAP marocaine)** en base, avec code officiel par acte — permet le calcul du reste à charge (TNR).
- **Modéliser le dossier patient comme un futur nœud DMP**, pas comme une simple fiche interne : historique de consultations structuré, exportable, avec l'identifiant santé unique en clé de référence. C'est ce que la CNSS appelle le "dossier patient partagé" — les données du DMP alimentent directement la FSE, donc autant construire ta structure de données dans cette logique dès l'étape 2/3 plutôt que de la retravailler à l'étape 4.
- **Calculateur de reste à charge** patient/AMO basé sur ces codes.

---

## Étape 4 — Interopérabilité réelle : homologation CNSS

**Horizon : décision à prendre selon la traction commerciale, probablement 2027 pour un acteur de ta taille**

Point important : l'homologation est **déjà ouverte** (appel d'offres, tests/audits en cours depuis fin 2025), pas un futur hypothétique. La vraie question n'est pas "quand ça ouvrira" mais **"est-ce que ça vaut le coup de candidater maintenant en tant que petit éditeur, ou vaut-il mieux s'appuyer sur le portail FSE gratuit de la CNSS en attendant d'avoir plusieurs clients"** :

- **Il n'existe pas de documentation technique publique du protocole FSE** (specs API, format d'échange, authentification). Le protocole est communiqué directement aux éditeurs entrés dans le dispositif d'homologation (appel d'offres + convention avec la CNSS), pas en téléchargement libre. Pour l'obtenir, il faut candidater au processus d'homologation.
- **Ressource publique déjà disponible** : le portail des professionnels de santé existant (`cnss.ma/portailps`), qui gère aujourd'hui le tiers payant AMO classique (hors FSE), publie des sections _Référentiels et codifications_, _Prise en charge et facturation_, _Médicaments/dispositifs remboursables_, ainsi que des guides PDF publics (établissement, pharmacien). C'est une base utile pour construire la nomenclature des actes (étape 3) avant même l'ouverture de l'API FSE proprement dite.
- **Première phase FSE = soins ambulatoires uniquement**, les hospitalisations viendront dans un second temps — pertinent pour un cabinet pédiatrique de ville, moins prioritaire si un futur client SaaS gère aussi des hospitalisations.
- **Option A — Portail FSE en marque blanche/iframe** : le prescripteur passe par le portail CNSS gratuit depuis ton interface (pattern déjà connu chez toi avec l'embed Cal.com en iframe pour contourner le hardcoding `app.cal.com`). Rapide à livrer, zéro dépendance à une homologation longue.
- **Option B — Candidater à l'homologation CNSS** comme éditeur : plus lourd (appel d'offres, sessions de tests/audits, convention), mais différenciant si dr-tabibi devient une vraie plateforme multi-tenant pour plusieurs praticiens marocains — l'investissement se rentabilise mieux à l'échelle SaaS qu'à l'échelle d'un cabinet unique.
- **Connecteur DMP** : synchronisation du dossier patient partagé via le même identifiant santé unique que la FSE — techniquement, un seul chantier d'interopérabilité, pas deux connecteurs séparés.

---

## Points de vigilance pour l'implémentation

- **FSE et DMP ne sont pas deux features indépendantes** : même identifiant santé unique, même plateforme côté CNSS. Concevoir le schéma du dossier patient (Payload) en conséquence dès l'étape 1-2, pas en étape 4.
- **Le calendrier CNSS avance vite** (généralisation avril-juin 2026, homologation éditeurs déjà ouverte) : ne pas concevoir l'étape 2 comme une solution figée "papier only" — structurer les données comme si l'électronique arrivait dans les mois qui viennent.
- **Le "PDF pré-rempli" seul n'est pas différenciant** : le marché des logiciels de cabinet au Maroc propose déjà OCR carte CNSS + suivi de remboursement comme standard attendu. Le vrai différenciateur est le workflow de suivi (statut FSE, alertes de délai) et l'intégration native au dossier patient/booking déjà existants sur dr-tabibi.
- **Consentement patient DMP** : règles pas encore figées côté CNSS → module de consentement configurable plutôt que logique codée en dur.
- **Décision homologation (étape 4)** : à trancher selon la traction commerciale — portail FSE CNSS en iframe (rapide, faible investissement) vs. homologation éditeur propre (lourde, mais cohérente si dr-tabibi devient une vraie plateforme multi-tenant).

---

_Document à faire évoluer avec Kilo Code / DeepSeek au fil de l'avancement de v3 et des annonces CNSS (généralisation prévue avril-juin 2026)._
