import { Router } from "express";
import {
  createMessage,
  subscribeNewsletter,
} from "../controllers/forms.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { normalizeUploadPaths } from "../utils/normalizeUploadPaths.js";

// Routes formulaires (écriture publique, non authentifiées) — montées sous /api.
const formsRouter = Router();

// upload.single("cv") gère le multipart (candidature) ET laisse passer le JSON.
formsRouter.post(
  "/messages",
  upload.single("cv"),
  normalizeUploadPaths,
  createMessage,
);
formsRouter.post("/newsletter/subscribe", subscribeNewsletter);

export default formsRouter;
