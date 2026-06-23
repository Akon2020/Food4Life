import multer from "multer";
import fs from "fs";
import path from "path";

const dossierMap = {
  avatar: "uploads/avatars",
  image: "uploads/images",
  logo: "uploads/images",
  photo: "uploads/images",
  cover: "uploads/images",
  gallery: "uploads/images",
  cv: "uploads/cv",
  file: "uploads/files",
  autre: "uploads/autres",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dossier = dossierMap[file.fieldname] || "uploads/autres";
    if (!fs.existsSync(dossier)) {
      fs.mkdirSync(dossier, { recursive: true });
    }
    cb(null, dossier);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

// Types autorisés par champ
const IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const CV_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const imageFields = ["avatar", "image", "logo", "photo", "cover", "gallery"];

const uploadError = (msg) => {
  const e = new Error(msg);
  e.status = 400;
  e.name = "UploadValidationError";
  return e;
};

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "cv") {
    return CV_MIMES.includes(file.mimetype)
      ? cb(null, true)
      : cb(uploadError("Format de CV non autorisé (PDF ou Word uniquement)."));
  }
  if (imageFields.includes(file.fieldname)) {
    return IMAGE_MIMES.includes(file.mimetype)
      ? cb(null, true)
      : cb(uploadError("Format d'image non autorisé."));
  }
  return cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo
});

export default upload;