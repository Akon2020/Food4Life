import { Router } from "express";
import {
  authenticationJWT,
  authorizeRoles,
} from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { normalizeUploadPaths } from "../utils/normalizeUploadPaths.js";
import { uploadFile } from "../controllers/upload.controller.js";
import {
  listCampaigns,
  getCampaign,
  createCampaign,
  deleteCampaign,
} from "../controllers/campaign.controller.js";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/adminUser.controller.js";
import {
  productsCrud,
  partnersCrud,
  teamCrud,
  testimonialsCrud,
  galleryCrud,
  listAdminArticles,
  getAdminArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  listMessages,
  updateMessageStatus,
  deleteMessage,
  listSubscribers,
  deleteSubscriber,
  getAdminSettings,
  updateSettings,
  getDashboard,
} from "../controllers/admin.controller.js";

const adminRouter = Router();

// Toutes les routes admin nécessitent une authentification.
adminRouter.use(authenticationJWT);

// Garde de rôles (D12)
const adminOnly = authorizeRoles("admin");
const editors = authorizeRoles("admin", "editeur"); // contenus éditoriaux

// Helper : enregistre un CRUD complet pour une ressource
function mountCrud(path, crud, guard) {
  adminRouter.get(`/${path}`, guard, crud.list);
  adminRouter.get(`/${path}/:id`, guard, crud.getOne);
  adminRouter.post(`/${path}`, guard, crud.create);
  adminRouter.put(`/${path}/:id`, guard, crud.update);
  adminRouter.delete(`/${path}/:id`, guard, crud.remove);
}

// Dashboard
adminRouter.get("/dashboard", adminOnly, getDashboard);

// Upload d'image (admin + editeur) -> { url, path }
adminRouter.post(
  "/uploads",
  editors,
  upload.single("image"),
  normalizeUploadPaths,
  uploadFile,
);

// Contenus éditoriaux (admin + editeur)
adminRouter.get("/articles", editors, listAdminArticles);
adminRouter.get("/articles/:id", editors, getAdminArticle);
adminRouter.post("/articles", editors, createArticle);
adminRouter.put("/articles/:id", editors, updateArticle);
adminRouter.delete("/articles/:id", editors, deleteArticle);

mountCrud("gallery", galleryCrud, editors);
mountCrud("testimonials", testimonialsCrud, editors);

// Ressources réservées à l'admin
mountCrud("products", productsCrud, adminOnly);
mountCrud("partners", partnersCrud, adminOnly);
mountCrud("team", teamCrud, adminOnly);

// Messages
adminRouter.get("/messages", adminOnly, listMessages);
adminRouter.patch("/messages/:id", adminOnly, updateMessageStatus);
adminRouter.delete("/messages/:id", adminOnly, deleteMessage);

// Abonnés newsletter
adminRouter.get("/subscribers", adminOnly, listSubscribers);
adminRouter.delete("/subscribers/:id", adminOnly, deleteSubscriber);

// Campagnes newsletter (composition, envoi, suivi des destinataires)
adminRouter.get("/newsletters", adminOnly, listCampaigns);
adminRouter.get("/newsletters/:id", adminOnly, getCampaign);
adminRouter.post("/newsletters", adminOnly, createCampaign);
adminRouter.delete("/newsletters/:id", adminOnly, deleteCampaign);

// Gestion des utilisateurs
adminRouter.get("/users", adminOnly, listUsers);
adminRouter.post("/users", adminOnly, createUser);
adminRouter.put("/users/:id", adminOnly, updateUser);
adminRouter.delete("/users/:id", adminOnly, deleteUser);

// Paramètres du site
adminRouter.get("/settings", adminOnly, getAdminSettings);
adminRouter.put("/settings", adminOnly, updateSettings);

export default adminRouter;
