import express from "express";
import upload from "../config/upload.js";

import {
  createMember,
  getMembers,
  getMemberById,
  updateMember,
  deleteMember,
  updateTeamOrder,
} from "../controllers/teamController.js";

const router = express.Router();


// ✅ PLACE THIS FIRST
router.put("/update-order", updateTeamOrder);

// Normal CRUD
router.post("/", upload.single("image"), createMember);
router.get("/", getMembers);
router.get("/:id", getMemberById);
router.put("/:id", upload.single("image"), updateMember);
router.delete("/:id", deleteMember);

export default router;
