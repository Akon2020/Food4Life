import { Router } from "express";
import {
  createMessage,
  subscribeNewsletter,
} from "../controllers/forms.controller.js";

// Routes formulaires (écriture publique, non authentifiées) — montées sous /api.
const formsRouter = Router();

formsRouter.post("/messages", createMessage);
formsRouter.post("/newsletter/subscribe", subscribeNewsletter);

export default formsRouter;
