import bcrypt from "bcryptjs";
import { Utilisateur } from "../models/index.model.js";
import {
  ADMIN_EMAIL,
  ADMIN_NAME,
  DEFAULT_PASSWD,
  NODE_ENV,
} from "../config/env.js";

// Crée un compte admin initial s'il n'existe aucun utilisateur.
// Utile en dev (la base est recréée à chaque boot via DB_SYNC_FORCE).
export const bootstrapAdmin = async () => {
  const count = await Utilisateur.count();
  if (count > 0) return;

  const email = ADMIN_EMAIL || "admin@foodforlife.cd";
  const password = DEFAULT_PASSWD || "Food4Life@2026";
  const salt = await bcrypt.genSalt();
  const hashed = await bcrypt.hash(password, salt);

  await Utilisateur.create({
    nomComplet: ADMIN_NAME || "Administrateur",
    email,
    password: hashed,
    role: "admin",
  });

  console.log(
    `Compte admin initial créé : ${email}` +
      (NODE_ENV !== "production" ? `  (mot de passe : ${password})` : ""),
  );
};
