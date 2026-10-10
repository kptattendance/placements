import express from "express";
import upload from "../config/upload.js";

import {
  createRecruiterLogo,
  getRecruiterLogos,
  deleteRecruiterLogo,
  updateRecruiterLogo,
} from "../controllers/recruiterLogoController.js";

const router = express.Router();

router.post("/", upload.single("image"), createRecruiterLogo);
router.get("/", getRecruiterLogos);
router.delete("/:id", deleteRecruiterLogo);
router.put("/:id", upload.single("image"), updateRecruiterLogo);

export default router;
