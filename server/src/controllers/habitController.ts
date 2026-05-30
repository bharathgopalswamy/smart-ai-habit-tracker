import { Request, Response } from "express";
import Habit from "../models/Habit

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

function calculateStreak(completions: { date: string }[]) {
  const dates = completions.map((c) => c.date).sort().reverse();
  let streak = 0;
  const current = new Date();

  for (let i = 0; i < dates.length; i++) {
    const expected = new Date();
    expected.setDate(current.getDate() - i);
    const key = expected.toISOString().split("T")[0];

    if (dates.includes(key)) streak++;
    else break;
  }

  return streak;
}

export const getHabits = async (req: Request, res: Response) => {
  const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });

  const formatted = habits.map((habit: any) => ({
    id: habit._id,
    name: habit.name,
    category: habit.category,
    frequency: habit.frequency,
    difficulty: habit.difficulty,
    reminderTime: habit.reminderTime,
    completions: habit.completions,
    completed: habit.completions.some((c: any) => c.date === todayKey()),
    streak: calculateStreak(habit.completions),
  }));

  res.json(formatted);
};

export const createHabit = async (req: Request, res: Response) => {
  const { name, category, frequency, difficulty, reminderTime } = req.body;

  const habit = await Habit.create({
    user: req.user._id,
    name,
    category,
    frequency,
    difficulty,
    reminderTime,
    completions: [],
  });

  res.status(201).json(habit);
};

export const toggleHabitToday = async (req: Request, res: Response) => {
  const habit = await Habit.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!habit) {
    return res.status(404).json({ message: "Habit not found" });
  }

  const today = todayKey();
  const alreadyDone = habit.completions.some((c: any) => c.date === today);

  if (alreadyDone) {
  habit.completions.pull({ date: today });
} else {
  habit.completions.push({ date: today });
}

  await habit.save();

  res.json({ message: "Habit updated" });
};

export const deleteHabit = async (req: Request, res: Response) => {
  await Habit.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  res.json({ message: "Habit deleted" });
};