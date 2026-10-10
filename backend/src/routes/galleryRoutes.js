import express from "express";
import upload from "../config/upload.js";

import {
  createGalleryPhoto,
  getAllGalleryPhotos,
  deleteGalleryPhoto,
  updateGalleryPhoto,
} from "../controllers/galleryController.js";

const router = express.Router();

router.post("/", upload.single("image"), createGalleryPhoto);
router.get("/", getAllGalleryPhotos);
router.delete("/:id", deleteGalleryPhoto);
router.put("/:id", upload.single("image"), updateGalleryPhoto);

export default router;
