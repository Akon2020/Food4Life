import { Router } from "express";
import {
  getArticles,
  getArticleBySlug,
  getProducts,
  getProductBySlug,
  getPartners,
  getTeam,
  getTestimonials,
  getGallery,
  getSettings,
} from "../controllers/content.controller.js";

// Routes publiques (lecture, non authentifiées) — montées sous /api.
const contentRouter = Router();

contentRouter.get("/articles", getArticles);
contentRouter.get("/articles/:slug", getArticleBySlug);
contentRouter.get("/products", getProducts);
contentRouter.get("/products/:slug", getProductBySlug);
contentRouter.get("/partners", getPartners);
contentRouter.get("/team", getTeam);
contentRouter.get("/testimonials", getTestimonials);
contentRouter.get("/gallery", getGallery);
contentRouter.get("/settings", getSettings);

export default contentRouter;
