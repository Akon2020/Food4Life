import { Router } from "express";

import { authenticationJWT } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/profile.controller.js";

// Profil de l'utilisateur connecté — accessible à tout compte authentifié.
const profileRouter = Router();

profileRouter.use(authenticationJWT);
profileRouter.get("/", getProfile);
profileRouter.put("/", updateProfile);
profileRouter.put("/password", changePassword);

export default profileRouter;
