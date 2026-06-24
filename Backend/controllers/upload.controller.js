import { HOST_URL } from "../config/env.js";

// Construit l'URL absolue d'un fichier uploadé (servi via /uploads statique).
export function fileToUrl(file) {
  if (!file) return null;
  const rel = file.path.replace(/\\/g, "/"); // ex: uploads/images/123.png
  return `${HOST_URL}/${rel}`;
}

// POST /admin/uploads  (champ "image") -> { url, path }
export const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier reçu." });
  }
  const url = fileToUrl(req.file);
  return res.status(201).json({ url, path: req.file.path.replace(/\\/g, "/") });
};
