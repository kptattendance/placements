// config/upload.js
import multer from "multer";
import storage from "./cloudinaryStorage.js";
import { deleteImage } from "../utils/deleteImage.js";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// ✅ One upload setup for every route: images only, 10 MB max
const multerUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);

    const error = new Error("Only JPG, PNG or WEBP images are allowed");
    error.status = 400;
    cb(error);
  },
});

// If the request fails after the image reached Cloudinary (e.g. a missing
// field or duplicate register number), remove the image again so it is
// not left behind unused
const removeImageIfRequestFails = (req, res, next) => {
  res.on("finish", () => {
    if (res.statusCode >= 400 && req.file?.filename) {
      deleteImage(req.file.filename);
    }
  });
  next();
};

const upload = {
  single: (field) => [multerUpload.single(field), removeImageIfRequestFails],
};

export default upload;
