// config/upload.js
import multer from "multer";
import storage from "./cloudinaryStorage.js";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// ✅ One upload setup for every route: images only, 10 MB max
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);

    const error = new Error("Only JPG, PNG or WEBP images are allowed");
    error.status = 400;
    cb(error);
  },
});

export default upload;
