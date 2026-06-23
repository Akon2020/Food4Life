import { DataTypes } from "sequelize";
import db from "../database/db.js";

const NewsletterAbonne = db.define(
  "NewsletterAbonne",
  {
    idNewsletterAbonne: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    idNewsletter: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'newsletters',
        key: 'idNewsletter',
      },
    },
    idAbonne: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'abonnes',
        key: 'idAbonne',
      },
    },
    statut: {
      type: DataTypes.ENUM('envoye', 'echec', 'attente'),
      defaultValue: 'attente',
    },
    dateEnvoi: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "newslettersabonnes",
    timestamps: false,
  }
);

export default NewsletterAbonne;