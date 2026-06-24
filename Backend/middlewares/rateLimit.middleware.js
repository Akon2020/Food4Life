import rateLimit from "express-rate-limit";

// Limiteur pour l'authentification (anti brute-force).
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Trop de tentatives de connexion. Réessayez dans 15 minutes.",
  },
});

// Limiteur pour les formulaires publics (anti-spam).
export const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 h
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Trop d'envois depuis cette adresse. Réessayez plus tard.",
  },
});
