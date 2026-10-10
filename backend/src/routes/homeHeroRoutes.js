import express from "express";
import upload from "../config/upload.js";

import {
  uploadHeroImage,
  getHeroImages,
  deleteHeroImage,
  updateHeroOrder,   // <-- ADD THIS LINE
} from "../controllers/homeHeroController.js";


const router = express.Router();

router.post("/", upload.single("image"), uploadHeroImage);
router.get("/", getHeroImages);
router.delete("/:id", deleteHeroImage);
router.put("/update-order", updateHeroOrder);

export default router;
