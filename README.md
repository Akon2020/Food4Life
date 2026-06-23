# Food For Life — Plateforme web (Frontend + Backend)

Site vitrine bilingue (FR/EN) + panneau d'administration pour **Food For Life**
(lutte contre la malnutrition au Sud-Kivu, RDC). Monorepo à deux applications :

- **`Frontend/`** — Next.js 16 (App Router, React 19, TypeScript, Tailwind v4, shadcn/ui,
  TanStack Query, next-intl, Framer Motion).
- **`Backend/`** — Express 5 + Sequelize + MySQL (JWT, Multer, Nodemailer, Swagger).

> Le frontend définit le **contrat** (`Frontend/lib/types.ts`) ; le backend l'expose
> tel quel. Voir [`plan.md`](plan.md) pour la feuille de route par objectifs.

---

## Architecture & contrat API

Base API : `NEXT_PUBLIC_API_BASE_URL` (dev : `http://localhost:5000/api`).
Réponses **brutes** (tableaux/objets conformes aux types front), id en **UUID**, dates ISO.

**Public (GET, libre)**
`/articles` (`?category=`) · `/articles/:slug` · `/products` · `/products/:slug` ·
`/partners` · `/team` · `/testimonials` · `/gallery` · `/settings`

**Formulaires (POST, libre)**
`/messages` (`contact|partenariat|candidature`) · `/newsletter/subscribe`

**Auth**
`POST /auth/login` (cookie `ffl_admin_session`) · `POST /auth/logout` · `GET /auth/me`

**Admin (JWT + rôles)**
`GET /admin/{articles,messages,subscribers,dashboard,settings}` ·
CRUD `/admin/{articles,products,partners,team,testimonials,gallery}[/:id]` ·
`PATCH|DELETE /admin/messages/:id` · `PUT /admin/settings` ·
`POST /admin/uploads` (image) · `DELETE /admin/subscribers/:id`

Rôles : `admin` = tout ; `editeur` = contenus éditoriaux (articles, galerie, témoignages).

Documentation interactive : **Swagger** sur `http://localhost:5000/api-docs/`.

---

## Prérequis

- **Node.js ≥ 20** (Next 16 l'exige).
- **MySQL ≥ 8** en local (base `foodforlife`).

---

## Installation & lancement (développement)

### 1. Backend

```bash
cd Backend
cp .env.example .env.development.local   # puis renseigner DB_*, EMAIL*, JWT_SECRET…
npm install
npm run seed       # crée le schéma + données de démo + compte admin
npm run dev        # http://localhost:5000  (Swagger: /api-docs)
```

Variables clés (`.env.development.local`) :

| Variable | Rôle |
|---|---|
| `PORT` | Port API (def. 5000) |
| `DB_HOST/DB_USER/DB_PASS/DB_NAME` | Connexion MySQL |
| `DB_SYNC_FORCE` | `true` = DROP & RECREATE au boot/seed (**dev only**) ; sinon `false` |
| `JWT_SECRET` | Secret JWT (≥ 32 caractères, obligatoire en prod) |
| `EMAIL/EMAIL_PASSWORD/EMAIL_HOST` | SMTP perso (accusés, bienvenue, notifications) |
| `ADMIN_EMAIL/ADMIN_NAME/DEFAULT_PASSWD` | Compte admin initial (seedé si base vide) |
| `FRONT_URL` | URL du frontend (liens emails, CORS) |

**Compte admin par défaut** (dev) : `admin@foodforlife.cd` / `Food4Life@2026`
(affiché dans la console au premier démarrage).

Scripts : `npm run dev` · `npm run seed` · `npm run seed:reset` (vide puis re-seed) ·
`npm start` (prod).

### 2. Frontend

```bash
cd Frontend
# .env.local :
#   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
#   NEXT_PUBLIC_USE_MOCKS=false        # true = données mock, sans backend
#   NEXT_PUBLIC_SITE_URL=http://localhost:3000
npm install
npm run dev        # http://localhost:3000  (→ /fr ou /en)
```

> **Mode mock** : `NEXT_PUBLIC_USE_MOCKS=true` fait tourner tout le front sans backend
> (données dans `Frontend/lib/mock-data`). Pratique pour le design/offline.

#### ⚠️ Note environnement Windows (binaire SWC bloqué)

Si `next dev` échoue avec *« Une stratégie de contrôle d'application a bloqué ce fichier :
swc.win32-x64-msvc.node »*, c'est une **politique de sécurité Windows** (AppLocker/WDAC/
antivirus) qui bloque le binaire natif SWC. Autoriser/whitelister
`Frontend/node_modules/@swc/**` puis relancer.

---

## Authentification (admin)

1. Le frontend protège `/admin/*` via `proxy.ts` (présence du cookie `ffl_admin_session`).
2. `POST /api/auth/login` pose ce cookie **httpOnly** (Secure en prod, SameSite=Lax).
3. En prod, front et API doivent être **same-site** (ex. `foodforlife.cd` et
   `api.foodforlife.cd`) ; ajouter `domain: ".foodforlife.cd"` au cookie pour le partage.

---

## Déploiement (cPanel)

- **Backend** : *Application Node.js* cPanel (Passenger). Renseigner les variables
  d'environnement via l'UI cPanel (ne pas committer les `.env.*.local`). Base **MySQL**
  du cPanel. Dossier `uploads/` sur disque persistant (servi en statique sur `/uploads`).
  Mettre `DB_SYNC_FORCE=false` en prod ; exécuter `npm run seed` une seule fois si besoin.
- **Frontend** : build Next (`npm run build`) servi en application Node cPanel.
  Variables `NEXT_PUBLIC_*` définies à la construction.
- **Emails (SMTP perso)** : configurer **SPF + DKIM + DMARC** sur le domaine d'envoi
  pour la délivrabilité.

---

## Structure

```
Backend/
  app.js                 # bootstrap Express (helmet, cors, cookies, routes)
  config/                # env, db, cookie, nodemailer
  models/                # Sequelize (UUID, bilingue) + index (associations)
  controllers/           # content (public), forms, admin (CRUD), auth, upload
  routes/                # content, forms, admin, auth, …
  middlewares/           # auth (JWT+rôles), validate, rateLimit, upload, error
  utils/                 # serialize, bootstrap (admin), email templates
  seed.js                # données de démonstration
Frontend/
  app/[locale]/          # (public) + admin/(panel)
  components/            # site, home, admin, forms, ui (shadcn)…
  lib/api/               # client (mock/réel), content, forms, admin
  lib/types.ts           # CONTRAT (source de vérité)
  lib/mock-data/         # jeux de données mock
  messages/{fr,en}.json  # i18n
```

---

## Sécurité

- JWT (cookie httpOnly), gardes de rôle sur `/admin/*`.
- Rate limiting (login 10/15 min ; formulaires 20/h), honeypot anti-spam.
- Validation des entrées (formulaires), uploads filtrés (type + 5 Mo max).
- `helmet`, CORS restreint, gestion d'erreurs homogène + logs Winston.
