import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import path from "path";
import logger from "morgan";
import { PORT, HOST_URL, JWT_SECRET, NODE_ENV } from "./config/env.js";
import { syncModels } from "./models/index.model.js";
import { bootstrapAdmin } from "./utils/bootstrap.js";
import errorMiddleware, { errorLogs } from "./middlewares/error.middleware.js";
import { setupSwagger } from "./swagger.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/utilisateur.route.js";
import abonneRouter from "./routes/abonne.route.js";
import newsletterRouter from "./routes/newsletter.route.js";
import contentRouter from "./routes/content.route.js";
import formsRouter from "./routes/forms.route.js";
import adminRouter from "./routes/admin.route.js";

const app = express();

app.use(
  helmet({
    // Permet au frontend (autre origine) de charger les médias servis depuis /uploads
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1024mb" }));
app.use(bodyParser.json({ limit: "1024mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "https://foodforlifedrc.org",
      "https://api.foodforlifedrc.org",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

setupSwagger(app);

app.get("/", (req, res) => {
  return res.status(200).json({
    message: `Checking Food For Life API\n=> Passed successfully at ${new Date().toLocaleString("fr-FR")}`,
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/abonnes", abonneRouter);
app.use("/api/newsletters", newsletterRouter);
// Domaine FFL — lectures publiques + formulaires (contrat Frontend/lib/types.ts)
app.use("/api", contentRouter);
app.use("/api", formsRouter);
// Admin (CRUD protégé par JWT + rôles)
app.use("/api/admin", adminRouter);

app.get("/error", errorLogs);
app.use(errorMiddleware);

// Contrôle de robustesse du secret JWT au démarrage.
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  const msg =
    "JWT_SECRET manquant ou trop court (< 32 caractères). Définissez un secret fort.";
  if (NODE_ENV === "production") {
    throw new Error(msg);
  }
  console.warn(`⚠️  ${msg}`);
}

app.listen(PORT, async (err) => {
  if (err) {
    console.log(`Une erreur s'est produite: ${err}`);
  } else {
    try {
      await syncModels();
      await bootstrapAdmin();
      console.log(`Le serveur est lancé au http://localhost:${PORT}/`);
      console.log(`Documentation Swagger sur ${HOST_URL}/api-docs/`);
    } catch (error) {
      console.error("Erreur lors de la synchronisation des modèles:", error);
    }
  }
});

export default app;
