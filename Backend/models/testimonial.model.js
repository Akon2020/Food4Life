import { DataTypes } from "sequelize";
import db from "../database/db.js";

// Témoignage — aligné sur Frontend/lib/types.ts (Testimonial)
const Testimonial = db.define(
  "Testimonial",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    authorName: { type: DataTypes.STRING(255), allowNull: false },
    authorRoleFr: { type: DataTypes.STRING(255), allowNull: true },
    authorRoleEn: { type: DataTypes.STRING(255), allowNull: true },
    quoteFr: { type: DataTypes.TEXT, allowNull: true },
    quoteEn: { type: DataTypes.TEXT, allowNull: true },
    photoUrl: { type: DataTypes.STRING(500), allowNull: true },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: "testimonials", timestamps: true },
);

export default Testimonial;
