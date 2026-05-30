import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

export type Habit = {
  id: string;
  name: string;
  category: string;
  frequency: string;
  difficulty: string;
  reminderTime?: string;
  completed: boolean;
  streak: number;
  completions: { date: string }[];
};

type HabitContextType = {
  habits: Habit[];
  loading: boolean;
  fetchHabits: () => Promise<void>;
  addHabit: (habit: {
    name: string;
    category: string;
    frequency: string;
    difficulty: string;
    reminderTime?: string;
  }) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
};

const HabitContext = createContext<HabitContextType | null>(null);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchHabits() {
    const token = localStorage.getItem("habitiq_token");
    if (!token) return;

    setLoading(true);
    const response = await api.get("/habits");
    setHabits(response.data);
    setLoading(false);
  }

  async function addHabit(habit: {
    name: string;
    category: string;
    frequency: string;
    difficulty: string;
    reminderTime?: string;
  }) {
    await api.post("/habits", habit);
    await fetchHabits();
  }

  async function toggleHabit(id: string) {
    await api.patch(`/habits/${id}/toggle`);
    await fetchHabits();
  }

  async function deleteHabit(id: string) {
    await api.delete(`/habits/${id}`);
    await fetchHabits();
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <HabitContext.Provider
      value={{ habits, loading, fetchHabits, addHabit, toggleHabit, deleteHabit }}
    >
      {children}
    </HabitContext.Provider>
  );
}

export function useHabits() {
  const context = useContext(HabitContext);
  if (!context) throw new Error("useHabits must be used inside HabitProvider");
  return context;
}