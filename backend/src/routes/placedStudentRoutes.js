import express from "express";
import upload from "../config/upload.js";

import {
  createPlacedStudent,
  getAllPlacedStudents,
  updatePlacedStudent,
  deletePlacedStudent,
} from "../controllers/placedStudentController.js";

const router = express.Router();

router.post("/", upload.single("image"), createPlacedStudent);
router.get("/", getAllPlacedStudents);
router.put("/:id", upload.single("image"), updatePlacedStudent);
router.delete("/:id", deletePlacedStudent);

export default router;
