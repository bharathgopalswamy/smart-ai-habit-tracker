import express from "express";
import {
  createHabit,
  deleteHabit,
  getHabits,
  toggleHabitToday,
} from "../controllers/habitController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getHabits);
router.post("/", protect, createHabit);
router.patch("/:id/toggle", protect, toggleHabitToday);
router.delete("/:id", protect, deleteHabit);

export default router;