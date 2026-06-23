import { DataTypes } from "sequelize";
import db from "../database/db.js";

// Élément de galerie (image/vidéo) — aligné sur Frontend/lib/types.ts (GalleryItem)
const GalleryItem = db.define(
  "GalleryItem",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    titleFr: { type: DataTypes.STRING(255), allowNull: true },
    titleEn: { type: DataTypes.STRING(255), allowNull: true },
    imageUrl: { type: DataTypes.STRING(500), allowNull: false },
    category: {
      type: DataTypes.ENUM("terrain", "produits", "evenements", "equipe"),
      allowNull: false,
      defaultValue: "terrain",
    },
    captionFr: { type: DataTypes.TEXT, allowNull: true },
    captionEn: { type: DataTypes.TEXT, allowNull: true },
    type: {
      type: DataTypes.ENUM("image", "video"),
      allowNull: false,
      defaultValue: "image",
    },
    videoUrl: { type: DataTypes.STRING(500), allowNull: true },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: "gallery_items", timestamps: true },
);

export default GalleryItem;
