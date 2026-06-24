// Profil de l'utilisateur connecté (admin ou éditeur) + sécurité (mot de passe).
import bcrypt from "bcryptjs";
import { Utilisateur } from "../models/index.model.js";
import { strongPasswd } from "../utils/user.utils.js";
import transporter from "../config/nodemailer.js";
import { EMAIL, FRONT_URL } from "../config/env.js";
import { passwordChangedEmailTemplate } from "../utils/email.template.js";

function serializeUser(u) {
  return {
    id: u.idUtilisateur,
    name: u.nomComplet,
    email: u.email,
    role: u.role,
    avatar: u.avatar ?? null,
    lastLogin: u.derniereConnexion ? u.derniereConnexion.toISOString() : null,
    createdAt: u.createdAt ? u.createdAt.toISOString() : null,
  };
}

export const getProfile = async (req, res) => {
  return res.status(200).json(serializeUser(req.user));
};

export const updateProfile = async (req, res, next) => {
  try {
    const u = await Utilisateur.findByPk(req.user.idUtilisateur);
    if (!u) return res.status(404).json({ message: "Introuvable" });

    const { name, nomComplet, email, avatar } = req.body;
    const data = {};
    if (nomComplet || name) data.nomComplet = nomComplet || name;
    if (email) data.email = email;
    if (avatar !== undefined) data.avatar = avatar;
    await u.update(data);

    return res.status(200).json(serializeUser(u));
  } catch (e) {
    if (e?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }
    next(e);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Mot de passe actuel et nouveau requis." });
    }

    // req.user exclut le mot de passe -> on recharge l'utilisateur complet.
    const u = await Utilisateur.findByPk(req.user.idUtilisateur);
    if (!u) return res.status(404).json({ message: "Introuvable" });

    const ok = await bcrypt.compare(currentPassword, u.password);
    if (!ok) {
      return res.status(401).json({ message: "Mot de passe actuel incorrect." });
    }
    if (!strongPasswd(newPassword)) {
      return res.status(400).json({
        message:
          "Mot de passe trop faible (6+ caractères, au moins 1 lettre, 1 chiffre et 1 symbole).",
      });
    }

    const salt = await bcrypt.genSalt();
    u.password = await bcrypt.hash(newPassword, salt);
    await u.save();

    // Email informatif (best-effort, non bloquant)
    void (async () => {
      try {
        await transporter.sendMail({
          from: `"Food For Life" <${EMAIL}>`,
          to: u.email,
          subject: "Votre mot de passe a été modifié",
          html: passwordChangedEmailTemplate(u.nomComplet, FRONT_URL),
        });
      } catch (err) {
        console.error("Email mot de passe modifié (non bloquant):", err.message);
      }
    })();

    return res.status(200).json({ ok: true });
  } catch (e) {
    next(e);
  }
};
