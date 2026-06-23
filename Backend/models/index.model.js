import db from "../database/db.js";
import { DB_SYNC_FORCE } from "../config/env.js";
import Utilisateur from "./utilisateur.model.js";
import Article from "./article.model.js";
import Product from "./product.model.js";
import Partner from "./partner.model.js";
import TeamMember from "./teamMember.model.js";
import Testimonial from "./testimonial.model.js";
import GalleryItem from "./galleryItem.model.js";
import ContactMessage from "./contactMessage.model.js";
import SiteSetting from "./siteSetting.model.js";
import Abonne from "./abonne.model.js";
import Newsletter from "./newsletter.model.js";
import NewsletterAbonne from "./newsletterAbonne.model.js";

// ---- Associations ----

// Article -> auteur (Utilisateur)
Article.belongsTo(Utilisateur, { foreignKey: "authorId", as: "auteur" });
Utilisateur.hasMany(Article, { foreignKey: "authorId", as: "articles" });

// Newsletter (campagne) -> rédacteur (Utilisateur)
Newsletter.belongsTo(Utilisateur, { foreignKey: "writedBy", as: "redacteur" });
Utilisateur.hasMany(Newsletter, { foreignKey: "writedBy", as: "newsletters" });

// Newsletter <-> Abonne (Many-to-Many, campagnes)
Newsletter.belongsToMany(Abonne, {
  through: NewsletterAbonne,
  foreignKey: "idNewsletter",
  otherKey: "idAbonne",
  as: "abonnes",
});
Abonne.belongsToMany(Newsletter, {
  through: NewsletterAbonne,
  foreignKey: "idAbonne",
  otherKey: "idNewsletter",
  as: "newsletters",
});

// Associations directes (statistiques d'envoi)
NewsletterAbonne.belongsTo(Newsletter, {
  foreignKey: "idNewsletter",
  as: "newsletter",
});
Newsletter.hasMany(NewsletterAbonne, {
  foreignKey: "idNewsletter",
  as: "envois",
});
NewsletterAbonne.belongsTo(Abonne, { foreignKey: "idAbonne", as: "abonne" });
Abonne.hasMany(NewsletterAbonne, { foreignKey: "idAbonne", as: "receptions" });

// ---- Synchronisation ----
// DB_SYNC_FORCE=true (dev uniquement) => drop & recreate de tout le schéma.
// À remettre à false une fois le schéma stabilisé.
const dropAllTables = async () => {
  // Drop robuste : on désactive les contraintes FK puis on supprime TOUTES les
  // tables (y compris d'anciennes tables legacy hors modèles) sans blocage.
  const qi = db.getQueryInterface();
  await db.query("SET FOREIGN_KEY_CHECKS = 0");
  const [rows] = await db.query("SHOW TABLES");
  for (const row of rows) {
    const tableName = Object.values(row)[0];
    await qi.dropTable(tableName);
  }
  await db.query("SET FOREIGN_KEY_CHECKS = 1");
};

const syncModels = async () => {
  try {
    const force = DB_SYNC_FORCE === "true";
    if (force) {
      await dropAllTables();
      await db.sync();
      console.log("Modèles synchronisés (DROP & RECREATE — mode dev)");
    } else {
      await db.sync();
      console.log("Modèles synchronisés avec succès");
    }
  } catch (error) {
    console.error("Erreur lors de la synchronisation des modèles:", error);
    throw error;
  }
};

export {
  Utilisateur,
  Article,
  Product,
  Partner,
  TeamMember,
  Testimonial,
  GalleryItem,
  ContactMessage,
  SiteSetting,
  Abonne,
  Newsletter,
  NewsletterAbonne,
  syncModels,
};
