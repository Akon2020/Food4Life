import { DataTypes } from "sequelize";
import db from "../database/db.js";

// Message unifié (contact / partenariat / candidature).
// Aligné sur Frontend/lib/types.ts (ContactMessage) — remplace l'ancien Contact.
const ContactMessage = db.define(
  "ContactMessage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("contact", "partenariat", "candidature"),
      allowNull: false,
      defaultValue: "contact",
    },
    name: { type: DataTypes.STRING(150), allowNull: false },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { isEmail: true },
    },
    // Objet (formulaire de contact) — conservé pour l'admin, hors type front strict
    subject: { type: DataTypes.STRING(255), allowNull: true },
    phone: { type: DataTypes.STRING(50), allowNull: true },
    organization: { type: DataTypes.STRING(255), allowNull: true },
    partnershipType: { type: DataTypes.STRING(255), allowNull: true },
    position: { type: DataTypes.STRING(255), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: false },
    cvUrl: { type: DataTypes.STRING(500), allowNull: true },
    status: {
      type: DataTypes.ENUM("new", "read", "archived"),
      allowNull: false,
      defaultValue: "new",
    },
  },
  {
    tableName: "contact_messages",
    timestamps: true,
    // createdAt nécessaire (tri + rétention CV 12 mois) ; updatedAt inutile
    updatedAt: false,
  },
);

export default ContactMessage;
