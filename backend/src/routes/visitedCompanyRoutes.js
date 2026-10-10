import express from "express";
import upload from "../config/upload.js";

import {
  createVisitedCompany,
  getAllVisitedCompanies,
  getVisitedCompanyById,
  updateVisitedCompany,
  deleteVisitedCompany,
} from "../controllers/visitedCompanyController.js";

const router = express.Router();

router.get("/", getAllVisitedCompanies);
router.get("/:id", getVisitedCompanyById);

router.post("/", upload.single("image"), createVisitedCompany);
router.put("/:id", upload.single("image"), updateVisitedCompany);
router.delete("/:id", deleteVisitedCompany);

export default router;
