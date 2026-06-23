import { DataTypes } from "sequelize";
import db from "../database/db.js";

// Membre de l'équipe — aligné sur Frontend/lib/types.ts (TeamMember)
const TeamMember = db.define(
  "TeamMember",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING(255), allowNull: false },
    roleFr: { type: DataTypes.STRING(255), allowNull: true },
    roleEn: { type: DataTypes.STRING(255), allowNull: true },
    bioFr: { type: DataTypes.TEXT, allowNull: true },
    bioEn: { type: DataTypes.TEXT, allowNull: true },
    photoUrl: { type: DataTypes.STRING(500), allowNull: true },
    linkedinUrl: { type: DataTypes.STRING(500), allowNull: true },
    order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  },
  { tableName: "team_members", timestamps: true },
);

export default TeamMember;
