import { DataTypes } from "sequelize";
import db from "../database/db.js";

// Article / actualité — bilingue, remplace l'ancien Blog.
// Aligné sur Frontend/lib/types.ts (Article)
const Article = db.define(
  "Article",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    slug: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    titleFr: { type: DataTypes.STRING(255), allowNull: false },
    titleEn: { type: DataTypes.STRING(255), allowNull: false },
    excerptFr: { type: DataTypes.TEXT, allowNull: true },
    excerptEn: { type: DataTypes.TEXT, allowNull: true },
    bodyFr: { type: DataTypes.TEXT("long"), allowNull: true },
    bodyEn: { type: DataTypes.TEXT("long"), allowNull: true },
    coverImageUrl: { type: DataTypes.STRING(500), allowNull: true },
    category: {
      type: DataTypes.ENUM("impact", "evenement", "presse"),
      allowNull: false,
      defaultValue: "impact",
    },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "draft",
    },
    publishedAt: { type: DataTypes.DATE, allowNull: true },
    authorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "utilisateurs", key: "idUtilisateur" },
    },
  },
  { tableName: "articles", timestamps: true },
);

export default Article;
