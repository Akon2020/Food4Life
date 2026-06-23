import { DataTypes } from "sequelize";
import db from "../database/db.js";

// Produit nutritionnel — bilingue FR/EN, aligné sur Frontend/lib/types.ts (Product)
const Product = db.define(
  "Product",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    taglineFr: { type: DataTypes.STRING(255), allowNull: true },
    taglineEn: { type: DataTypes.STRING(255), allowNull: true },
    descriptionFr: { type: DataTypes.TEXT, allowNull: true },
    descriptionEn: { type: DataTypes.TEXT, allowNull: true },
    // Tableaux stockés en JSON
    ingredients: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    benefitsFr: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    benefitsEn: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    targetAudienceFr: { type: DataTypes.STRING(255), allowNull: true },
    targetAudienceEn: { type: DataTypes.STRING(255), allowNull: true },
    imageUrl: { type: DataTypes.STRING(500), allowNull: true },
    gallery: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    availabilityFr: { type: DataTypes.STRING(255), allowNull: true },
    availabilityEn: { type: DataTypes.STRING(255), allowNull: true },
    status: {
      type: DataTypes.ENUM("available", "coming_soon"),
      allowNull: false,
      defaultValue: "available",
    },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: "products", timestamps: true },
);

export default Product;
