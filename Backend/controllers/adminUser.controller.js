// Gestion des utilisateurs (admin only).
import bcrypt from "bcryptjs";
import { Utilisateur } from "../models/index.model.js";

const ROLES = ["admin", "editeur"];

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

export const listUsers = async (req, res, next) => {
  try {
    const rows = await Utilisateur.findAll({
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json(rows.map(serializeUser));
  } catch (e) {
    next(e);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, nomComplet, email, password, role } = req.body;
    const fullName = nomComplet || name;
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nom, email et mot de passe requis." });
    }
    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: "Rôle invalide (admin|editeur)." });
    }
    const exists = await Utilisateur.findOne({ where: { email } });
    if (exists) {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash(password, salt);
    const u = await Utilisateur.create({
      nomComplet: fullName,
      email,
      password: hashed,
      role,
    });
    return res.status(201).json(serializeUser(u));
  } catch (e) {
    next(e);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const u = await Utilisateur.findByPk(req.params.id);
    if (!u) return res.status(404).json({ message: "Introuvable" });

    const { name, nomComplet, email, role, password } = req.body;
    const data = {};
    if (nomComplet || name) data.nomComplet = nomComplet || name;
    if (email) data.email = email;
    if (role && ROLES.includes(role)) data.role = role;
    if (password) {
      const salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(password, salt);
    }
    await u.update(data);
    return res.status(200).json(serializeUser(u));
  } catch (e) {
    if (e?.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Cet email est déjà utilisé." });
    }
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const u = await Utilisateur.findByPk(req.params.id);
    if (!u) return res.status(404).json({ message: "Introuvable" });
    if (u.idUtilisateur === req.user?.idUtilisateur) {
      return res
        .status(400)
        .json({ message: "Vous ne pouvez pas supprimer votre propre compte." });
    }
    await u.destroy();
    return res.status(200).json({ ok: true, id: req.params.id });
  } catch (e) {
    next(e);
  }
};
