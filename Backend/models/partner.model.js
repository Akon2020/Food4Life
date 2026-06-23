import { DataTypes } from "sequelize";
import db from "../database/db.js";

// Partenaire — aligné sur Frontend/lib/types.ts (Partner)
const Partner = db.define(
  "Partner",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    logoUrl: { type: DataTypes.STRING(500), allowNull: true },
    descriptionFr: { type: DataTypes.TEXT, allowNull: true },
    descriptionEn: { type: DataTypes.TEXT, allowNull: true },
    websiteUrl: { type: DataTypes.STRING(500), allowNull: true },
    category: {
      type: DataTypes.ENUM(
        "financier",
        "technique",
        "formation",
        "institutionnel",
      ),
      allowNull: false,
      defaultValue: "institutionnel",
    },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: "partners", timestamps: true },
);

export default Partner;
