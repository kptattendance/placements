import express from "express";
import { getBudget, updateBudget } from "../controllers/budgetController.js";
import { requireRole } from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/", getBudget);      // ⭐ GET 5000 default
router.post("/", requireRole("principal"), updateBudget);  // ⭐ Update budget

export default router;
