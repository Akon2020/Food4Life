import { Router } from "express";
import {
  createMessage,
  subscribeNewsletter,
} from "../controllers/forms.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { normalizeUploadPaths } from "../utils/normalizeUploadPaths.js";
import { formLimiter } from "../middlewares/rateLimit.middleware.js";
import {
  validate,
  messageSchema,
  subscribeSchema,
} from "../middlewares/validate.middleware.js";

// Routes formulaires (écriture publique, non authentifiées) — montées sous /api.
const formsRouter = Router();

// upload.single("cv") gère le multipart (candidature) ET laisse passer le JSON.
formsRouter.post(
  "/messages",
  formLimiter,
  upload.single("cv"),
  normalizeUploadPaths,
  validate(messageSchema),
  createMessage,
);
formsRouter.post(
  "/newsletter/subscribe",
  formLimiter,
  validate(subscribeSchema),
  subscribeNewsletter,
);

export default formsRouter;
