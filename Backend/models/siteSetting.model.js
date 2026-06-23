import { DataTypes } from "sequelize";
import db from "../database/db.js";

// Paramètres globaux du site (singleton). Aligné sur Frontend/lib/types.ts (SiteSetting).
// On garde une seule ligne ; les 3 blocs sont stockés en JSON.
const SiteSetting = db.define(
  "SiteSetting",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    impact: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        tonnesProduced: 0,
        householdsServed: 0,
        farmersSupported: 0,
        jobsCreated: 0,
      },
    },
    contact: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: { address: "", phone: "", email: "", mapUrl: "" },
    },
    socials: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        facebook: "",
        instagram: "",
        linkedin: "",
        x: "",
        youtube: "",
      },
    },
  },
  { tableName: "site_settings", timestamps: true },
);

export default SiteSetting;
