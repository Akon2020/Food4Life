import { DataTypes } from "sequelize";
import db from "../database/db.js";

const Abonne = db.define(
  "Abonne",
  {
    idAbonne: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nomComplet: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // Langue de l'abonné (pour l'envoi localisé) — aligné NewsletterSubscriber.locale
    locale: {
      type: DataTypes.ENUM('fr', 'en'),
      allowNull: false,
      defaultValue: 'fr',
    },
    // Inscription simple (D4) : confirmé d'office ; champ conservé pour évolution
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    statut: {
      type: DataTypes.ENUM('actif', 'inactif', 'desabonne'),
      defaultValue: 'actif',
    },
    dateAbonnement: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    dateDesabonnement: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "abonnes",
    timestamps: false,
  }
);

export default Abonne;