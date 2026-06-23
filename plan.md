# Food For Life — Plan d'exécution par objectifs (Goals)

> Rédigé en tant que **dev Full-Stack senior / propriétaire produit / UI-UX designer**.
> Format **goal-driven** : chaque objectif a un **résultat attendu**, une **Definition of Done (DoD)** mesurable et des **tâches**. On coche le Goal quand la DoD est verte.
> Cap : amener le projet à **100 %** — backend reconstruit et **aligné sur le contrat du frontend**.
> Date : 2026-06-23.

---

## ✅ Avancement (mis à jour)

| Goal | État |
|---|---|
| G1 — Backend démarre | ✅ fait & vérifié |
| G2 — Modèles UUID bilingues | ✅ fait & vérifié |
| G3 — Endpoints publics + formulaires | ✅ fait & vérifié |
| G4 — Auth réelle | ✅ fait & vérifié |
| G5 — Interconnexion + seed | ✅ API/CORS vérifiés · ⚠️ rendu navigateur bloqué (SWC) |
| G6 — CRUD admin | ✅ backend vérifié · 🔵 front : API + suppression + **formulaires create/edit (6b)** |
| G7 — Uploads | ✅ backend vérifié · 🔵 front : helper + composant d'upload (dialog) |
| G8 — Emails/settings/seed | ✅ accusés, bienvenue, **notif admin**, settings éditables, seed |
| G9 — Sécurité (rate-limit, validation, honeypot, uploads durcis) | ✅ fait & vérifié |
| G10 — UI/UX | ✅ toasts, skeletons, états vides, confirmations, dashboard 1-requête typé · 🔵 polish navigateur |
| G11 — Tests/docs/déploiement | ✅ README, 15 tests unitaires (vérifiés), CI GitHub Actions |
| G12 — Responsive | ✅ admin (drawer mobile) + public (header burger) · 🔵 à valider navigateur |

> Légende : ✅ fait/vérifié · 🔵 code-complete, validation navigateur en attente (SWC bloque `next dev` ici).
> Reste hors code : whitelister SWC pour lancer le front, configurer SMTP/SPF/DKIM, déployer cPanel.

---

## 0. Décisions verrouillées (ne plus rediscuter)

Ces choix sont actés et conditionnent tous les goals ci-dessous :

| # | Sujet | Décision | Impact |
|---|---|---|---|
| D1 | **Périmètre backend** | Domaine Food For Life **+ campagnes newsletter** conservées (modèles `Newsletter`/`Abonne`/`NewsletterAbonne`). Tout le reste du CMS générique (événements, fiches d'identité, fichiers, inscriptions, commentaires) est **abandonné** — suppressions de contrôleurs déjà faites volontairement. | Goal 1 |
| D2 | **Bilinguisme** | **Saisie manuelle FR + EN** dans l'admin (deux champs par contenu). Pas de traduction auto. | Goals 2, 6, 7 |
| D3 | **Identifiants** | **UUID partout** (clés primaires `UUID` v4, relations en UUID). | Goal 2 |
| D4 | **Newsletter** | **Inscription simple** : à la soumission `confirmed=true` + email de bienvenue. Le champ `confirmed` reste pour évolution. Les **campagnes** (envoi en masse) restent disponibles côté admin. | Goals 2, 5, 8 |
| D5 | **Préfixe API** | On **garde `/api`** côté backend et on l'inclut dans `NEXT_PUBLIC_API_BASE_URL`. Zéro modification des chemins frontend. | Goal 3 |
| D6 | **Cookie de session** | Le backend pose le cookie **`ffl_admin_session`** (httpOnly) pour ne pas toucher `proxy.ts`. | Goal 4 |
| D7 | **Réponses API** | **Brutes** (tableaux/objets conformes à `lib/types.ts`), **sans enveloppe** `{ data }`/`{ blogs }`. | Goal 3 |
| D8 | **Port backend** | Fixé à **5000** en dev, aligné dans `.env.local`. | Goals 1, 9 |
| D9 | **Emails** | **SMTP perso** (config Nodemailer existante conservée). Soigner SPF/DKIM/DMARC pour la délivrabilité. | Goal 8 |
| D10 | **Hébergement prod** | **cPanel** (Node.js app + MySQL cPanel). Build front exporté/servi, backend en app Node, base MySQL du cPanel. | Goal 11 |
| D11 | **Campagnes newsletter** | **Templates prédéfinis + variables** au lancement ; éditeur riche reporté. | Goal 6/8 |
| D12 | **Rôles** | `editeur` = contenus (articles, galerie, témoignages) ; `admin` = tout (settings, équipe, partenaires, utilisateurs, campagnes). | Goals 4, 6 |
| D13 | **Rétention CV** | Accès **admin only** ; **purge auto configurable (~12 mois)** pour conformité RGPD. | Goals 7, 9 |

---

## 1. Contexte (rappel court)

- **Frontend** (Next.js 16, FR/EN) terminé, branché sur **mock data** via `lib/api/*` + flag `NEXT_PUBLIC_USE_MOCKS`. La spec du contrat = `lib/types.ts`.
- **Backend** (Express 5 + Sequelize + MySQL) : socle réutilisable (auth JWT, Multer, Nodemailer, MVC) mais **modèle de données à reconstruire** pour matcher le domaine FFL. Des imports morts (modèles/contrôleurs supprimés) empêchent le démarrage → à nettoyer (Goal 1).

---

## 2. Contrat API cible (source de vérité = `lib/types.ts`)

> Base : `NEXT_PUBLIC_API_BASE_URL = http://localhost:5000/api` (dev). Réponses **brutes**.

**Public (GET, libre)**
`/articles?category=` → `Article[]` · `/articles/:slug` → `Article|null` · `/products` → `Product[]` · `/products/:slug` → `Product|null` · `/partners` → `Partner[]` · `/team` → `TeamMember[]` · `/testimonials` → `Testimonial[]` · `/gallery` → `GalleryItem[]` · `/settings` → `SiteSetting`

**Formulaires (POST, libre)**
`/messages` (Contact|Partner|Application + `type`) → `{ok,id}` · `/newsletter/subscribe` `{email,locale}` → `{ok,id}`

**Admin (JWT)**
`GET /admin/articles|messages|subscribers` · CRUD `/admin/{articles,products,partners,team,testimonials,gallery}[/:id]` · `PATCH/DELETE /admin/messages/:id` · `PUT /admin/settings` · `GET /admin/dashboard` · campagnes `/admin/newsletter` (liste, créer, envoyer)

**Auth**
`POST /auth/login` `{email,password}` → `{user}` + cookie `ffl_admin_session` · `POST /auth/logout` · `GET /auth/me` → `{user}`

---

## 🎯 OBJECTIFS

> Légende priorité : 🔴 bloquant · 🟠 cœur du MVP · 🟡 confort · 🟢 finition.

---

### Goal 1 — « Le backend démarre proprement » 🔴
**Résultat** : un serveur Express qui boote sans erreur, débarrassé du code legacy hors périmètre.
**DoD** :
- `npm run dev` démarre sans crash ; `GET http://localhost:5000/` répond 200.
- Plus aucun import mort (modèles/routes/contrôleurs supprimés).
- Cookies lisibles côté serveur, en-têtes de sécurité actifs.

**Tâches**
- [ ] Purger `app.js` : retirer les routeurs hors périmètre (`equipe`, `evenement`, `ficheIdentite`, `fichier`, `dashboard` legacy) et leurs montages.
- [ ] Purger `models/index.model.js` : retirer imports/associations de `Evenement, Equipe, FicheIdentite, InscriptionEvenement, Fichier` (+ commentaires si abandonnés).
- [ ] Supprimer les fichiers de routes/modèles orphelins correspondants.
- [ ] Ajouter `cookie-parser` : `app.use(cookieParser())`.
- [ ] Ajouter `helmet()` + `cors({ allowedHeaders: ["Content-Type","Authorization"], credentials:true })`.
- [ ] Fixer `PORT=5000` (env) ; corriger l'enum rôle (`defaultValue: 'editeur'`).
- [ ] Vérifier la connexion MySQL (`database/db.js` + `.env.development.local`).

---

### Goal 2 — « Le modèle de données reflète le domaine FFL » 🔴
**Résultat** : tous les modèles Sequelize existent, en **UUID**, **bilingues FR+EN**, conformes à `lib/types.ts`.
**DoD** :
- `db.sync()` crée toutes les tables sans erreur.
- Chaque modèle expose exactement les champs du type frontend correspondant.
- Clés primaires et étrangères en **UUID v4**.

**Tâches (un modèle = une sous-tâche)**
- [ ] `Product` : `slug, name, taglineFr/En, descriptionFr/En, ingredients(JSON), benefitsFr/En(JSON), targetAudienceFr/En, imageUrl, gallery(JSON), availabilityFr/En, status ENUM('available','coming_soon'), order`.
- [ ] `Partner` : `name, logoUrl, descriptionFr/En, websiteUrl, category ENUM('financier','technique','formation','institutionnel'), order`.
- [ ] `TeamMember` : `name, roleFr/En, bioFr/En, photoUrl, linkedinUrl, order`.
- [ ] `Testimonial` : `authorName, authorRoleFr/En, quoteFr/En, photoUrl, order`.
- [ ] `GalleryItem` : `titleFr/En, imageUrl, category ENUM('terrain','produits','evenements','equipe'), captionFr/En, type ENUM('image','video'), videoUrl, order`.
- [ ] `Article` (refonte du `Blog`) : `slug, titleFr/En, excerptFr/En, bodyFr/En, coverImageUrl, category ENUM('impact','evenement','presse'), status ENUM('draft','published'), publishedAt, authorId(UUID)`.
- [ ] `ContactMessage` (unifié) : `type ENUM('contact','partenariat','candidature'), name, email, phone, organization, partnershipType, position, message, cvUrl, status ENUM('new','read','archived')`.
- [ ] `NewsletterSubscriber` : `email UNIQUE, locale ENUM('fr','en'), confirmed BOOLEAN default true`.
- [ ] Conserver `Newsletter`/`Abonne`/`NewsletterAbonne` (campagnes) — migrer en **UUID** + ajouter `locale`.
- [ ] `SiteSetting` : singleton JSON (`impact`, `contact`, `socials`).
- [ ] `Utilisateur` : passer la PK en UUID ; rôles `admin/editeur`.
- [ ] Mettre à jour `index.model.js` (associations) ; activer les **defaultValue UUIDV4**.

---

### Goal 3 — « Chaque endpoint répond au shape exact attendu » 🟠
**Résultat** : routes publiques + formulaires opérationnelles, réponses brutes conformes.
**DoD** :
- Tous les GET publics renvoient le tableau/objet typé, **sans enveloppe**, triés/filtrés comme les mocks.
- `POST /messages` (3 types) et `/newsletter/subscribe` renvoient `{ok:true,id}`.
- IDs sérialisés en string (UUID).

**Tâches**
- [ ] Sérialiseurs/mappers backend → shape `lib/types.ts` (dates ISO, `id` string, champs FR/En).
- [ ] Contrôleurs publics : articles (published, filtre `category`, tri `publishedAt desc`), products/partners/team/testimonials/gallery (tri `order`), settings.
- [ ] `POST /messages` : dispatch selon `type` (`contact|partenariat|candidature`) → persistance + email + `{ok,id}`.
- [ ] `POST /newsletter/subscribe` : upsert email + `locale`, `confirmed=true`, email de bienvenue, `{ok,id}`.
- [ ] Monter toutes les routes sous `/api`.

---

### Goal 4 — « L'admin se connecte pour de vrai » 🟠
**Résultat** : authentification réelle frontend ↔ backend, fini le mock.
**DoD** :
- Login avec vraies identifiants → cookie `ffl_admin_session` httpOnly posé → accès `/admin/*`.
- Mauvais identifiants → message d'erreur clair ; logout → cookie effacé.
- `proxy.ts` inchangé fonctionne (même nom de cookie).

**Tâches**
- [ ] Backend : `POST /auth/login` (pose cookie `ffl_admin_session`, httpOnly+SameSite+Secure en prod), `POST /auth/logout`, `GET /auth/me`.
- [ ] Restreindre `/admin/*` aux rôles `admin/editeur` (middleware).
- [ ] Frontend : réécrire `lib/auth.ts` (vrais appels `login/logout/getCurrentUser`).
- [ ] Page login : états chargement/erreur, redirection `from`.
- [ ] Seed d'un compte admin initial (script).

---

### Goal 5 — « Le site public tourne sur le vrai backend » 🟠
**Résultat** : `USE_MOCKS=false` et toutes les pages publiques affichent les données réelles.
**DoD** :
- `.env.local` configuré ; CORS OK ; les 9 GET publics passent la **checklist de parité** (§ bas).
- Aucune régression visuelle vs mode mock.

**Tâches**
- [ ] `.env.local` : `NEXT_PUBLIC_USE_MOCKS=false`, `NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api`.
- [ ] Vérifier `credentials:"include"` ↔ `credentials:true` + origines CORS.
- [ ] Recette parité mock vs réel sur chaque endpoint public.
- [ ] Garder `lib/mock-data` comme fallback offline/dev.

---

### Goal 6 — « L'admin gère tout le contenu (CRUD complet) » 🟠
**Résultat** : créer/éditer/supprimer/réordonner chaque entité depuis l'admin, en FR+EN.
**DoD** :
- Chaque liste admin permet create/edit/delete avec formulaire bilingue (2 champs/contenu).
- Mutations via TanStack Query (invalidation cache + toasts) ; messages passent `new→read→archived`.
- Paramètres du site éditables.

**Tâches**
- [ ] Backend : CRUD `/admin/{articles,products,partners,team,testimonials,gallery}`, `PATCH/DELETE /admin/messages/:id`, `PUT /admin/settings`, `GET /admin/dashboard`, campagnes `/admin/newsletter`.
- [ ] Frontend : étendre `lib/api/admin.ts` (create/update/delete par entité + `updateMessageStatus`, `deleteMessage`, `updateSettings`).
- [ ] Câbler `*-list.tsx`, `row-actions.tsx`, dialogs d'édition (formulaires RHF+Zod bilingues).
- [ ] Réordonnancement (`order`) et export Excel (xlsx) messages/abonnés.

---

### Goal 7 — « Médias & uploads fonctionnels » 🟠
**Résultat** : upload réel d'images (produits, équipe, galerie, articles, logos) et de CV (candidatures).
**DoD** :
- Upload depuis l'admin/formulaires → fichier stocké, URL absolue renvoyée et persistée.
- Validation type/taille ; suppression de l'ancien fichier à la mise à jour.

**Tâches**
- [ ] Backend : endpoints upload (Multer) ; servir `/uploads` ; renvoyer URLs absolues.
- [ ] Frontend : composant d'upload (admin + champ CV candidature), gestion `multipart/form-data` (déjà supporté par `apiSend`).
- [ ] Nettoyage fichiers orphelins (`utils/deletefile.js`).

---

### Goal 8 — « Emails, paramètres & données de démo » 🟡
**Résultat** : emails transactionnels réels, settings pilotant le site, base pré-remplie.
**DoD** :
- Emails envoyés : accusé contact, accusé candidature, bienvenue newsletter, notif admin.
- `/settings` alimente footer + page contact + section impact.
- Seed depuis les mock-data → environnement de démo peuplé en une commande.

**Tâches**
- [ ] Brancher templates `utils/email.template.js` sur les flux réels (locale de l'abonné/contact).
- [ ] `GET/PUT /settings`.
- [ ] Script de seed (produits, partenaires, équipe, témoignages, galerie, articles, settings, admin).

---

### Goal 9 — « Sécurisé et robuste » 🟡
**DoD** : validation serveur sur tous les POST/PUT, rate-limit login+formulaires, erreurs homogènes, secrets hors repo.
**Tâches**
- [ ] Validation (Zod/express-validator) sur toutes les écritures.
- [ ] Rate limiting + anti-spam (honeypot) contact/newsletter/login.
- [ ] Sanitization HTML du corps d'article ; tailles d'upload.
- [ ] `error.middleware.js` homogène + codes HTTP + logs Winston ; cookies `Secure` en prod ; `JWT_SECRET` solide.

---

### Goal 10 — « Finition UI/UX » 🟢
**DoD** : tous les écrans admin ont états vides/skeleton/erreur/toast cohérents, accessibles (AA, clavier), responsives ; SEO dynamique en place.
**Tâches**
- [ ] États vides/chargement/erreur + confirmation avant suppression partout.
- [ ] Accessibilité (focus, labels, contrastes, dialogs/menus clavier).
- [ ] Responsive admin (tables → cartes mobile) — détail complet dans **Goal 12**.
- [ ] Cohérence design system (vert/or/crème, Poppins/Inter), micro-interactions.
- [ ] SEO : `generateMetadata` dynamique (articles/produits), sitemap, OpenGraph, données structurées ; images `next/image`.

---

### Goal 11 — « Testé, documenté, déployé » 🟢
**DoD** : parcours clés couverts par tests, Swagger à jour, README complet, CI verte, prod en ligne.
**Tâches**
- [ ] Tests : contrôleurs (Jest/Vitest + supertest) + e2e (Playwright : login, contact, CRUD article).
- [ ] Swagger reflète le nouveau contrat ; lint/format unifiés + hook pré-commit.
- [ ] README racine (archi, env, lancement front+back+MySQL, seed).
- [ ] CI (build+lint+tests) ; déploiement front (Vercel) + back/DB (infra cible) ; monitoring + healthcheck.

---

### Goal 12 — « Frontend 100 % responsive (public + admin) » 🟠
**Résultat** : **les deux parties du front** — site public **et** panneau d'administration — sont parfaitement utilisables sur mobile, tablette et desktop, sans débordement ni élément coupé.
**DoD** :
- Aucune **scroll horizontale** parasite, aucun chevauchement, aucune cible tactile < 44px, à toutes les largeurs.
- Validation sur les **breakpoints de référence** : **360px** (mobile S), **390/414px** (mobile), **768px** (tablette), **1024px** (laptop), **1280px+** (desktop).
- Testé en **portrait et paysage**, et sur navigateurs réels (Chrome/Safari iOS + Android).

**Tâches — site public**
- [ ] Header : nav → menu mobile (sheet/burger) fonctionnel, bascule FR/EN et CTA accessibles au pouce.
- [ ] Hero, sections impact/services/produits/partenaires/témoignages : grilles fluides (1 col mobile → multi-cols desktop), typographie responsive.
- [ ] Galerie (masonry) + lightbox : adaptés au tactile (swipe), images `next/image` `sizes` corrects.
- [ ] Pages détail (produit, article) : médias et longueurs de ligne lisibles sur mobile.
- [ ] Formulaires (contact, partenaire, candidature, newsletter) : champs pleine largeur, clavier mobile adapté, pas de zoom involontaire (font-size ≥ 16px sur inputs).
- [ ] Footer : colonnes empilées proprement.

**Tâches — panneau admin**
- [ ] Sidebar → off-canvas/drawer sur mobile (overlay + bouton).
- [ ] Tables de données → **vue cartes** empilées en dessous de `md` (ou scroll horizontal maîtrisé avec colonne d'actions figée).
- [ ] Toolbars/filtres/recherche : repli en accordéon ou ligne défilante.
- [ ] Dialogs/formulaires d'édition : plein écran (ou bottom-sheet) sur mobile, scroll interne, boutons d'action toujours visibles.
- [ ] Dashboard (stat cards + graphiques) : reflow en 1 colonne, graphiques redimensionnables.

**Tâches — transverses**
- [ ] Auditer chaque page/écran via DevTools responsive (checklist des 5 breakpoints).
- [ ] Conventions Tailwind cohérentes (mobile-first : base = mobile, `sm/md/lg/xl` ascendants).
- [ ] Images/médias toujours `max-width:100%` ; pas de largeurs fixes en px sur conteneurs.

---

## 📋 Checklist de parité (recette d'interconnexion)

`USE_MOCKS=true` (réf) vs `false` (réel) → **shape identique** :
`/articles` · `/articles/:slug` · `/products` · `/products/:slug` · `/partners` · `/team` · `/testimonials` · `/gallery` · `/settings` · `/admin/articles` · `/admin/messages` · `/admin/subscribers` · `/messages` ×3 · `/newsletter/subscribe` · `/auth/login|me|logout` · CRUD admin complet.

---

## 🗺️ Roadmap (ordre d'exécution)

```
G1 (démarrage) → G2 (modèles UUID) → G3 (endpoints publics+forms) → G4 (auth réelle)
   → G5 (brancher le public)  ▶ JALON « MVP public branché »
   → G6 (CRUD admin) → G7 (uploads)  ▶ JALON « Admin opérationnel »
   → G8 (emails/settings/seed) → G9 (sécurité) → G10 (UI/UX) + G12 (responsive public+admin) → G11 (tests/CI/déploiement)
      ▶ JALON « 100 % »
```

> **G12 (responsive)** est transverse : à vérifier en continu pendant G5/G6 (au fil du branchement des écrans) puis **audité et finalisé** avec G10. Aucune page n'est considérée « finie » sans sa validation responsive.

- **MVP public branché** (fin G5) : le site public consomme le vrai backend.
- **Admin opérationnel** (fin G7) : connexion réelle + CRUD + médias.
- **100 %** (fin G11) : sécurisé, testé, documenté, déployé.

---

## ✅ Décisions — toutes verrouillées

Plus aucune question ouverte : voir §0 (D1→D13). Points d'attention pour l'exécution :

- **SMTP perso (D9)** : configurer **SPF + DKIM + DMARC** sur le domaine d'envoi, sinon les emails (bienvenue, accusés, campagnes) tomberont en spam. Garder un compte d'envoi dédié.
- **cPanel (D10)** : backend en **Application Node.js cPanel** (Passenger) → prévoir `app.js` compatible, variables d'env via l'UI cPanel, `/uploads` sur disque persistant ; MySQL via cPanel. Front : build Next puis service (Node app ou export selon config cPanel). **Vérifier la version de Node disponible sur le cPanel** (Next 16 exige Node ≥ 20).
- **Rôles (D12)** : appliquer la granularité dans le middleware d'autorisation des routes `/admin/*`.
- **Rétention CV (D13)** : tâche planifiée (cron cPanel) de purge + champ date sur `ContactMessage` de type candidature.
