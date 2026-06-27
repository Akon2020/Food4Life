# Food For Life — Rapport d'audit & plan de complétion

> Audit technique du système (frontend Next.js 16 + backend Express/Sequelize/MySQL).
> Rédigé en tant que dev Full-Stack senior / propriétaire produit.
> Date : 2026-06-24 · Branche : `dev`.

---

## 1. Verdict global

**Niveau de complétion : ~88 % vers un « 100 % production-grade ».**

- **Complétude fonctionnelle : ~95 %** — toutes les fonctionnalités prévues existent,
  sont câblées de bout en bout et vérifiées (CRUD, auth, uploads, campagnes, dashboard,
  emails, SEO, responsive, bilingue).
- **Maturité / qualité de production : ~80 %** — ce qui pèse sur le score : couverture
  de tests faible, observabilité absente, quelques dettes de durcissement et de contenu.

> En clair : **le produit marche et est déployable** (il l'est déjà en prod). Les 12 %
> manquants sont surtout de la **robustesse, des tests, de l'observabilité et du polish**,
> pas des fonctionnalités.

### Inventaire (mesuré)
| Périmètre | Chiffres |
|---|---|
| Backend | 11 contrôleurs · 8 routes · 13 modèles · 6 middlewares · **15 tests unitaires ✓** |
| Frontend | 33 pages · 88 composants · 6 modules API · **build « Compiled successfully », 0 erreur TS source** |

---

## 2. Ce qui est fait (et vérifié)

### Backend
- ✅ Démarrage propre, helmet, CORS restreint (origines + credentials), cookie-parser.
- ✅ Modèle de données **UUID + bilingue** aligné sur le contrat frontend (`lib/types.ts`).
- ✅ Endpoints publics (articles, products, partners, team, testimonials, gallery, settings)
  en réponses brutes, tri/filtre serveur.
- ✅ Formulaires publics (`/messages` 3 types, `/newsletter/subscribe` + `unsubscribe`).
- ✅ **Auth** : login/logout/me ; cookie httpOnly **et** jeton **Bearer** (le front utilise le Bearer).
- ✅ **CRUD admin** complet protégé par rôles (admin/editeur) : articles, products, partners,
  team, testimonials, gallery, messages, subscribers, settings, **users**, **campagnes**.
- ✅ **Uploads** (Multer, filtrés type + 5 Mo), servis en statique, URLs absolues.
- ✅ **Dashboard** : compteurs étendus, répartitions, **séries mensuelles** (DATE_FORMAT), récents.
- ✅ **Campagnes newsletter** : envoi en arrière-plan + **suivi par destinataire** (statut/date).
- ✅ **Sécurité** : rate limiting (login + formulaires), validation, honeypot, sanitization HTML,
  gestion d'erreurs homogène, JWT secret contrôlé au démarrage.
- ✅ **Emails** transactionnels : accusés contact/candidature, bienvenue, notif admin,
  mot de passe modifié.

### Frontend
- ✅ Site public **bilingue FR/EN**, responsive, **SEO** (sitemap, robots, OpenGraph,
  hreflang, JSON-LD Organization/Article/Product).
- ✅ Layout racine Next 16 correct (`<html>/<body>`), 404 à la marque (header+footer).
- ✅ **Admin** complet : listes avec **cartes de stats + filtres**, CRUD bilingue (dialogs),
  **éditeur riche TipTap** (articles + campagnes en page dédiée), **dashboard graphique** (recharts),
  **profil + sécurité**, **gestion utilisateurs**, **abonnés / campagnes séparés**.
- ✅ États vides informatifs et stylés sur les listes/sections publiques.
- ✅ Interconnexion réelle (mocks opt-in, **jamais en prod**), auth Bearer fiable cross-domaine.

---

## 3. Dette technique (énumérée par sévérité)

### 🔴 Élevée — à traiter avant de parler de « 100 % »
1. **Couverture de tests faible.** 15 tests unitaires (validation + sérialiseurs) côté backend ;
   **0 test d'intégration** (routes/DB) et **0 test e2e** ; **0 test frontend**. Les parcours
   critiques (login, CRUD, upload, campagne) ne sont pas couverts automatiquement.
2. **Observabilité absente.** Pas de suivi d'erreurs (Sentry/équiv.), pas de logs structurés
   centralisés, healthcheck minimal (`GET /`). Un incident en prod passerait inaperçu.
3. **Schéma DB via `db.sync()`** au démarrage plutôt que des **migrations versionnées**
   exécutées en CD. (3 fichiers de migration existent mais le boot utilise `sync` →
   risque d'écart schéma/migrations et de modifications non tracées en prod.)

### 🟠 Moyenne — robustesse & cohérence
4. **JWT en `localStorage`** (auth Bearer) : surface **XSS** (un script injecté peut lire le
   jeton). Pas de **refresh token** ni de rotation ; expiration = 1 jour → reconnexion brutale.
5. **Rate limiting en mémoire** (express-rate-limit défaut) : remis à zéro à chaque redémarrage
   et **non partagé entre instances** (KO si scaling horizontal). Prévoir un store (Redis).
6. **Pas de pagination.** Listes admin et publiques chargent **toutes** les lignes puis filtrent
   côté client. OK à petite échelle, problématique au-delà de quelques centaines d'éléments.
7. **Uploads sur disque local** (cPanel) : pas de sauvegarde/CDN, couplage au serveur,
   pas de purge des fichiers orphelins à la suppression d'une entité.
8. **`typescript.ignoreBuildErrors: true`** dans `next.config`. Aujourd'hui 0 erreur, mais le
   garde-fou est désactivé → une régression de type passerait en prod silencieusement.
9. **Réinitialisation de mot de passe** : endpoints backend présents (`reset`, `resetpassword`)
   mais **aucun écran frontend** (« mot de passe oublié »).
10. **Honeypot** : géré côté backend (champ `_hp`) mais **le champ caché n'est pas posé**
    dans les formulaires front → protection inactive en pratique.

### 🟡 Basse — polish & contenu
11. **Templates emails** : **11 URLs de logo pointent encore vers `food4life.vercel.app`**
    (au lieu de `foodforlifedrc.org`) et **1 typo** `contact@foodforlidedrc.org`.
12. **`images.unoptimized: true`** : l'optimisation d'images Next est désactivée (poids/CWV).
13. **Accessibilité** non auditée formellement (focus visibles, contrastes AA, ARIA des dialogs/menus).
14. **CI sans déploiement** : build + tests uniquement ; le déploiement cPanel reste manuel.
15. **`force-dynamic`** sur les pages détail produit/article → rendu à chaque requête (pas de
    cache/ISR), choix sûr mais sous-optimal en perf/coût.
16. **Settings = singleton JSON** : pas de versionnement ni d'historique des changements.
17. **Cookie de session prod en `SameSite=None`** : acceptable, mais l'idéal en prod reste
    front et API **same-site** (`foodforlifedrc.org` + `api.foodforlifedrc.org`) avec `Lax`.

---

## 4. Plan de complétion — en GOALS

> Légende priorité : 🔴 bloquant qualité · 🟠 robustesse · 🟡 finition.
> Chaque goal a un **résultat** et une **Definition of Done (DoD)**.

### Goal A — Filet de tests automatisés 🔴
**Résultat** : les parcours critiques sont couverts et la CI casse en cas de régression.
**DoD** :
- [ ] Tests d'intégration backend (Jest/Vitest + supertest, DB de test) : auth (login/me/logout),
      CRUD d'au moins 2 entités, upload (type/limite/401), campagne (création + suivi),
      formulaires publics (validation, honeypot).
- [ ] Tests e2e (Playwright) : connexion admin → créer un article (éditeur) → le voir publié ;
      soumettre le formulaire de contact ; changer de langue.
- [ ] Quelques tests de composants front clés (formulaire, RichTextEditor).
- [ ] CI exécute tout et bloque le merge si rouge.

### Goal B — Observabilité & exploitation 🔴
**DoD** :
- [ ] Suivi d'erreurs (Sentry ou équivalent) côté backend **et** frontend.
- [ ] Logs structurés (déjà Winston) + niveau configurable + rotation.
- [ ] Endpoint `GET /health` (DB ping, version, uptime) pour la supervision cPanel/uptime-robot.
- [ ] Alerte basique (email) sur erreurs 5xx répétées.

### Goal C — Migrations & cycle DB propre 🔴
**DoD** :
- [ ] Remplacer `db.sync()` au boot par l'exécution de **migrations** versionnées (sequelize-cli).
- [ ] Script de déploiement : `migrate` puis `seed` (idempotent) au lieu de `sync`.
- [ ] Documenter le flux d'évolution du schéma (créer une migration, l'appliquer).

### Goal D — Durcissement de l'authentification 🟠
**DoD** :
- [ ] Réduire la surface XSS : envisager cookie httpOnly **same-site** en prod comme canal
      principal (front+API sous `foodforlifedrc.org`) et garder Bearer en repli.
- [ ] **Refresh token** (ou ré-auth silencieuse) pour éviter la déconnexion brutale à 24 h.
- [ ] Écran **« mot de passe oublié »** + reset (les endpoints existent déjà).
- [ ] Verrouillage progressif après N échecs (au-delà du rate-limit IP).

### Goal E — Scalabilité des listes & médias 🟠
**DoD** :
- [ ] **Pagination** serveur (limit/offset ou cursor) sur les endpoints de liste + UI admin paginée.
- [ ] Rate limiting avec **store Redis** (multi-instances).
- [ ] Uploads : nettoyage des fichiers orphelins à la suppression ; option de stockage objet
      (S3/Backblaze) + CDN ; sauvegarde du dossier `uploads/`.

### Goal F — Qualité de build & perf 🟠
**DoD** :
- [ ] Retirer `ignoreBuildErrors` (corriger les éventuelles erreurs résiduelles) → la CI échoue
      sur une régression de type.
- [ ] Réactiver l'optimisation d'images (`next/image`) là où c'est possible (ou loader cPanel).
- [ ] Réévaluer `force-dynamic` → ISR/`revalidate` sur produits/articles pour le cache.

### Goal G — Finition contenu, a11y & déploiement 🟡
**DoD** :
- [ ] **Emails** : remplacer les 11 URLs `food4life.vercel.app` → `foodforlifedrc.org`,
      corriger la typo `foodforlidedrc`. Brancher SPF/DKIM/DMARC (délivrabilité).
- [ ] **Honeypot** : ajouter le champ caché `_hp` dans les formulaires publics.
- [ ] **Accessibilité** : audit (axe/Lighthouse), focus visibles, ARIA des dialogs/menus, contrastes AA.
- [ ] **CD** : étape de déploiement cPanel (ou webhook) après CI verte.
- [ ] Historique/versionnement léger des **settings**.

---

## 5. Ordre recommandé

```
A (tests) → C (migrations) → B (observabilité)   ▶ socle « exploitable en confiance »
   → D (auth durcie) → E (scalabilité)            ▶ « prêt à grandir »
   → F (build/perf) → G (finition/a11y/CD)        ▶ « 100 % production-grade »
```

- **Jalon « Exploitable en confiance »** (A+B+C) : on peut faire évoluer le système sans
  casser la prod à l'aveugle. → passe à **~93 %**.
- **Jalon « Prêt à grandir »** (D+E) : tient la charge et l'auth est robuste. → **~97 %**.
- **Jalon « 100 % »** (F+G) : qualité, perf, a11y, contenu et déploiement automatisé.

---

## 6. Résumé exécutif (1 ligne)

> Système **fonctionnellement complet (~95 %) et déjà en production**, à **~88 %** d'un niveau
> « production-grade » ; les écarts sont des **tests, de l'observabilité et du durcissement**,
> pas des fonctionnalités. Les Goals A→C sont les plus rentables pour sécuriser la suite.
