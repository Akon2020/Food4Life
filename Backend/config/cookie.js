import { NODE_ENV } from "./env.js";

// Nom du cookie de session admin — aligné avec le proxy Next (D6).
export const SESSION_COOKIE = "ffl_admin_session";

// Options du cookie de session JWT.
// secure uniquement en prod (sinon le navigateur refuse le cookie sur http://localhost).
// sameSite "lax" : suffisant car front et API sont "same-site" (localhost en dev,
// *.foodforlifedrc.org en prod). En prod, ajouter `domain: ".foodforlifedrc.org"` pour le
// partager entre le site et l'API (voir README déploiement).
export const sessionCookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  path: "/",
};
