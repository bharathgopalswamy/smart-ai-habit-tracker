import express from "express";
import {
  deleteAIPlan,
  generateHabitPlan,
  getAIPlans,
} from "../controllers/aiController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/plan", protect, generateHabitPlan);
router.get("/plans", protect, getAIPlans);
router.delete("/plans/:id", protect, deleteAIPlan);

export default router;