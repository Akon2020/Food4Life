# Food For Life — Walkthrough du build (Frontend)

> Journal de bord mis à jour à chaque étape. Périmètre : **frontend Next.js uniquement**, alimenté par mock data via une couche `lib/api`. Backend (Express + MySQL) branché plus tard via `NEXT_PUBLIC_USE_MOCKS=false`.

## Stack confirmée
- Next.js 16 (App Router, layout racine plat), React 19, TS strict
- Tailwind v4 (CSS-first, `@theme`), shadcn/ui (preset `b0`, base-ui)
- TanStack Query, React Hook Form + Zod, next-intl (FR/EN)
- Framer Motion (micro-interactions) + GSAP/ScrollTrigger (marketing)
- xlsx, lucide-react, date-fns — **Pas de dark mode**

---

## Phase 1 — Foundation  ✅ TERMINÉ

### Fait
- [x] Projet déjà scaffolté (Next 16 + shadcn b0 + Tailwind v4), `tsconfig` avec `@/* -> ./*` (layout plat, pas de `src/`).
- [x] Dépendances installées : `@tanstack/react-query`, `react-hook-form`, `zod`, `@hookform/resolvers`, `framer-motion`, `gsap`, `next-intl`, `xlsx`, `date-fns`.
- [x] Composants shadcn ajoutés : input, textarea, label, select, tabs, table, badge, card, dialog, sheet, sonner, dropdown-menu, skeleton, separator.
- [x] `components/ui/form.tsx` écrit manuellement (fallback compatible base-ui, sans Radix Slot).
- [x] Logos enregistrés dans `public/` (logo-white.png, logo-green.jpeg, leaf-mark.jpeg).
- [x] Tokens design (vert/or/crème, typo, radius) dans `globals.css` — pas de dark mode.
- [x] Polices Poppins (titres `font-heading`) + Inter (corps `font-sans`) via `next/font/google`.
- [x] next-intl : routage préfixe `/fr` (défaut) + `/en`, `messages/fr.json`, `messages/en.json`.
- [x] Couche données : `lib/api/client.ts`, `lib/api/{content,forms,admin}.ts`, `lib/mock-data/*`, `lib/types.ts`.
- [x] `.env.example` + `.env.local` (NEXT_PUBLIC_USE_MOCKS, API_BASE_URL, SITE_URL).
- [x] Root layout plat + `app/[locale]/layout.tsx` : Providers (QueryClient + NextIntlClientProvider + Toaster).
- [x] Layout public : header sticky crème (blur on scroll) + nav + bascule FR/EN + CTA or, footer premium vert.
- [x] `proxy.ts` (ex middleware) : i18n + protection `/admin/*` via cookie de session factice.
- [x] Pages système : `not-found.tsx`, `error.tsx`, `loading.tsx`.
- [x] Icônes sociales custom (`components/icons/social-icons.tsx`) car lucide build sans marques.
- [x] Vérifié navigateur : `/` → 307 `/fr`, `/fr` et `/en` → 200, header + footer OK.

### Notes techniques
- `lucide-react@1.17.0` ne contient PAS les icônes de marque (Facebook/Instagram/…). SVG inline créés.
- Next 16 : `middleware.ts` renommé `proxy.ts`. Renommer nécessite un **restart** du dev server (chunk edge en cache).

---

## Phase 2 — Site public  ✅ TERMINÉ

### Fait
- [x] 20 images générées (`public/images/*`) : hero, produits, news, galerie, équipe, témoignages, à-propos.
- [x] Primitives motion (`components/motion/reveal.tsx` : Reveal, fadeUp, StaggerGroup/RevealGroup).
- [x] `SectionHeading`, `LinkButton` (base-ui n'a pas `asChild`), helper `lib/format.ts`.
- [x] Cartes réutilisables : `ProductCard`, `ArticleCard`, `PartnersCarousel` (marquee infini CSS, wordmarks).
- [x] **Page d'accueil** complète : Hero cinématique + compteurs d'impact animés + Services + Produits + Partenaires (carrousel) + Témoignages + Galerie (masonry) + Actualités + CTA.
- [x] Traductions FR/EN étendues (home, services, about, products, gallery, partners, blog, contact, newsletter).
- [x] Vérifié navigateur : accueil rendu, animations au scroll, images OK, FR/EN OK.

### Pages livrées (vérifiées navigateur, FR + EN, HTTP 200)
- [x] `components/site/page-hero.tsx` — bannière réutilisable (motion + accents glow).
- [x] **À propos** (`/a-propos`) : histoire + mission/vision + valeurs + équipe (fetch `getTeam`).
- [x] **Services** (`/services`) : grille 6 services numérotés + CTA.
- [x] **Produits** (`/produits`) : grille + **détail `[slug]`** (ingrédients, bienfaits, audience, dispo).
- [x] **Galerie** (`/galerie`) : filtres catégorie + masonry + **lightbox** (image/vidéo, backdrop blur).
- [x] **Partenaires** (`/partenaires`) : groupé par catégorie + bloc CTA.
- [x] **Actualités** (`/actualites`) : filtres + grille + **détail `[slug]`** (cover, corps paragraphes).
- [x] **Contact** (`/contact`) : cartes coordonnées + carte OpenStreetMap (formulaires → Phase 3).
- [x] Metadata SEO (`generateMetadata`) sur chaque page.

### Pièges rencontrés (résolus)
- `lucide-react` n'exporte pas `Linkedin` ici → utiliser `LinkedinIcon` de `components/icons/social-icons.tsx`.
- Helper i18n = `pick` / `pickArray` (pas `localized`).
- `getArticles(category?)` prend une string, pas un objet d'options.
- Sections home auto-fetch via React Query (pas de props passées par la page).

### Notes
- Les images générées peuvent disparaître lors d'un redémarrage du sandbox ; régénérées avec extension `.png` (les mocks pointaient en `.jpg` → corrigés).
- Logos partenaires : pas de vraies marques → tuiles wordmark stylées.

---

## Phase 3 — Formulaires & leads  ✅ TERMINÉ

### Livré (react-hook-form + zod + React Query, vérifié navigateur FR/EN)
- [x] `components/forms/fields.tsx` — primitives premium (TextField, TextAreaField, SelectField, FieldShell) avec états d'erreur `aria-invalid`.
- [x] **Formulaire Contact** (`contact-form.tsx`) : nom, email, sujet, message + validation + carte de succès + toast.
- [x] **Formulaire Partenariat** (`partner-form.tsx`) : nom, organisation, email, tél, type (select natif → enum zod), message.
- [x] **Formulaire Candidature** (`application-form.tsx`) : poste, coordonnées, **upload CV simulé** (nom de fichier), message.
- [x] **Wrapper à onglets** (`contact-forms.tsx`) : segmented control animé (motion `layoutId`), deep-link `?tab=partner|career` via `useSearchParams` (+ `Suspense`).
- [x] Bouton « Devenir partenaire » du header → `/contact?tab=partner` (route `/devenir-partenaire` inexistante corrigée).
- [x] Newsletter déjà en place (`newsletter-form.tsx`) — non modifié.
- [x] **Page `/impact`** créée (était dans la nav mais manquante → 404) : hero + intro + compteurs + témoignages + CTA.
- [x] Clés i18n ajoutées : `contact.cvHint`, `contact.cvUpload`, namespace `impactPage`.

### Vérifications navigateur
- Validation à vide → bordures rouges + messages inline. ✅
- Soumission Contact → toast + carte de succès. ✅
- Deep-link Partenariat → onglet présélectionné, select + soumission OK. ✅

### Notes
- Soumissions via `lib/api/forms.ts` en mode mock (ids factices) — prêtes à brancher sur un vrai backend en Phase 5.
- Select natif HTML choisi (plutôt que base-ui Select) pour fiabilité avec RHF + zod enum.

---

## Phase 4 — Admin back-office  ✅ TERMINÉ

### Livré (React Query + données mock, vérifié navigateur FR/EN, auth gardée par cookie)
- [x] Primitives admin : `stat-card.tsx`, `status-badge.tsx` (+ helper `statusTone`), `admin-table.tsx` (Table/Thead/Tr/Th/Td + `Tr onClick`), `admin-toolbar.tsx` (recherche + filtres pills + bouton Ajouter), `row-actions.tsx`, `table-skeleton.tsx`.
- [x] **Tableau de bord** (`dashboard-overview.tsx`) : 6 stats calculées (articles, produits, partenaires, équipe, messages, abonnés) + messages récents avec badges type/statut.
- [x] **Actualités** (`articles-list.tsx`) : filtres catégorie + statut publié/brouillon (via `getAdminArticles` = brouillons inclus).
- [x] **Produits** (`products-list.tsx`) : vignette, catégorie, statut dispo/bientôt.
- [x] **Partenaires** (`partners-list.tsx`) : filtre catégorie, logo, ordre.
- [x] **Équipe** (`team-list.tsx`) : avatar, rôle, ordre.
- [x] **Témoignages** (`testimonials-list.tsx`) : auteur, rôle, extrait.
- [x] **Galerie** (`gallery-list.tsx`) : filtre catégorie, vignette, badge type image/vidéo.
- [x] **Messages** (`messages-list.tsx`) : filtres statut + type, **panneau latéral détail** (slide-over motion) avec email/CV.
- [x] **Newsletter** (`subscribers-list.tsx`) : stats abonnés + tableau confirmés/en attente + langue.
- [x] **Réglages** (`settings-view.tsx`) : chiffres d'impact, coordonnées, réseaux sociaux (lecture seule + note backend).
- [x] 9 routes sous `app/[locale]/admin/(panel)/*` + dashboard réel branché.
- [x] Namespace i18n `adminUI` (FR + EN) ajouté + getter `getAdminArticles`.

### Bug corrigé (vérifié)
- **Hydration mismatch** dans `admin-sidebar.tsx` : `getCurrentUser()` (localStorage) était lu pendant le render → différence serveur/client. Déplacé dans un `useEffect` + état `user`. Overlay Next.js désormais propre.

### Notes
- Les actions Modifier/Ajouter/Supprimer sont désactivées (« Bientôt ») — données mock en lecture seule, à brancher en Phase 5.
- Auth = cookie `ffl_admin_session` (proxy.ts garde `/admin/*`), user affiché depuis localStorage.

---

## Phase 5 — Polish  ✅ TERMINÉ (dark mode reporté)

### Livré (vérifié navigateur FR/EN, console propre)
- [x] **Modal « Built by Isaac Akonkwa »** (`components/site/built-by-modal.tsx`) : glassmorphism, backdrop blur, motion spring, avatar IA, chips stack, CTAs portfolio/contact, fermeture Échap + scroll lock. Déclencheur dans le footer.
- [x] **Header auth** (`components/layout/auth-menu.tsx`) : bouton Connexion si déconnecté ; sinon avatar + dropdown (Espace admin, Déconnexion). Lecture user en `useEffect` (pas de hydration mismatch). Versions desktop + mobile.
- [x] **Warnings images corrigés** : ratios `width/height` alignés sur l'intrinsèque (logo header 842×595, logo footer 594×420, leaf-mark 842×595). Plus aucun warning aspect-ratio.
- [x] **SEO par page** : `generateMetadata` ajouté à l'accueil (description + OpenGraph + image) ; toutes les autres pages en avaient déjà.
- [x] **Pages légales** : `/mentions-legales`, `/politique-confidentialite` (composant partagé `legal-sections.tsx` + contenu i18n via `t.raw("sections")`), `/carrieres` (intro + atouts + `ApplicationForm` réutilisé).
- [x] Liens footer cassés corrigés : `/devenir-partenaire` → `/contact?tab=partner`.
- [x] Nav : `whitespace-nowrap` (fix « À propos » qui passait sur 2 lignes).
- [x] Langues : switcher FR/EN vérifié (nav + contenu traduits, `/en/*` OK).
- [x] Clés i18n ajoutées (FR+EN) : `nav.login/dashboard/logout/account`, namespaces `builtBy`, `careersPage`, `legalPage`, `privacyPage`.

### Reporté (décision utilisateur)
- [ ] **Dark mode** : reporté — le site utilise des classes de marque codées en dur (`bg-cream`, `text-ink`, `bg-paper`…) plutôt que des tokens sémantiques duaux ; un vrai dark mode nécessite un refactor token par token.

### Notes
- L'avatar/portfolio du modal pointe vers des URLs placeholder (`github.com/isaac-akonkwa`, `mailto:`) — à mettre à jour avec les vrais liens d'Isaac.
- Auth toujours en mode mock (cookie `ffl_admin_session` + user localStorage).

---

## Phase 6 — Branchement backend  ⬜ À VENIR
- [ ] Remplacer les mocks `lib/api/*` par un vrai backend (DB + endpoints).
- [ ] Auth réelle (remplacer `lib/auth.ts` mock).
- [ ] Persistance des soumissions de formulaires + actions CRUD admin.
