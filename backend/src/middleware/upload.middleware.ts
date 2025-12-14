import multer from "multer";

// Stockage temporaire en mémoire
const storage = multer.memoryStorage();

// Filtrage des fichiers
const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype.startsWith("audio/") ||
    file.mimetype.startsWith("image/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Format de fichier non autorisé"), false);
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB max
  },
});
