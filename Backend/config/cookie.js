import { NODE_ENV } from "./env.js";

// Nom du cookie de session admin — aligné avec le proxy Next (D6).
export const SESSION_COOKIE = "ffl_admin_session";

// Options du cookie de session JWT.
// - secure uniquement en prod (le navigateur refuse un cookie Secure sur http://localhost).
// - En prod : sameSite "none" pour que le cookie httpOnly de l'API soit envoyé sur les
//   requêtes cross-site (ex. front foodforlifedrc.org ou localhost -> api.foodforlifedrc.org).
//   "none" exige Secure (OK en prod, HTTPS). En dev (localhost, http) on garde "lax".
const isProd = NODE_ENV === "production";

export const sessionCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  path: "/",
};
