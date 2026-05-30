import { useState } from "react";
import Layout from "../components/Layout";
import { useHabits } from "../context/HabitContext";
import { Plus, Flame, CheckCircle2, Target, Calendar } from "lucide-react";

export default function Habits() {
  const { habits, addHabit, toggleHabit, deleteHabit, resetHabits } = useHabits();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Productivity",
    frequency: "Daily",
    difficulty: "Easy",
  });

  const completedCount = habits.filter((h) => h.completed).length;
  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;

  function handleAddHabit() {
    if (!form.name.trim()) return;

    addHabit({
      name: form.name,
      category: form.category,
      frequency: form.frequency,
      difficulty: form.difficulty,
    });

    setForm({
      name: "",
      category: "Productivity",
      frequency: "Daily",
      difficulty: "Easy",
    });

    setShowModal(false);
  }

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
        <div>
          <p className="text-cyan-400 font-medium">Habit Control Center</p>
          <h1 className="text-4xl font-bold mt-2">Manage Your Habits</h1>
          <p className="text-gray-400 mt-2">
            Context API now powers habits across the whole app.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={resetHabits}
            className="bg-white/10 text-white px-5 py-4 rounded-2xl font-semibold hover:bg-white/20 transition"
          >
            Reset Demo
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-cyan-400 text-black px-6 py-4 rounded-2xl font-semibold hover:bg-cyan-300 transition"
          >
            <Plus size={20} />
            Add Habit
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <SummaryCard title="Total Habits" value={habits.length.toString()} icon={<Target />} />
        <SummaryCard title="Completed Today" value={`${completedCount}/${habits.length}`} icon={<CheckCircle2 />} />
        <SummaryCard title="Best Streak" value={`${bestStreak} days`} icon={<Flame />} />
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-xs bg-cyan-400/20 text-cyan-300 px-3 py-1 rounded-full">
                  {habit.category}
                </span>
                <h2 className="text-2xl font-bold mt-4">{habit.name}</h2>
              </div>

              <button
                onClick={() => toggleHabit(habit.id)}
                className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                  habit.completed
                    ? "bg-emerald-400 text-black"
                    : "bg-black/30 text-gray-400"
                }`}
              >
                <CheckCircle2 />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <MiniInfo icon={<Calendar />} label="Frequency" value={habit.frequency} />
              <MiniInfo icon={<Target />} label="Difficulty" value={habit.difficulty} />
            </div>

            <div className="mt-6 bg-black/30 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Current streak</p>
                <p className="text-2xl font-bold">{habit.streak} days</p>
              </div>
              <Flame className="text-orange-400" size={32} />
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => toggleHabit(habit.id)}
                className={`flex-1 py-3 rounded-2xl font-semibold transition ${
                  habit.completed
                    ? "bg-emerald-400 text-black"
                    : "bg-cyan-400 text-black hover:bg-cyan-300"
                }`}
              >
                {habit.completed ? "Completed" : "Mark Complete"}
              </button>

              <button
                onClick={() => deleteHabit(habit.id)}
                className="px-4 rounded-2xl bg-red-500/20 text-red-300 hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-2">Create New Habit</h2>
            <p className="text-gray-400 mb-6">
              This habit will instantly appear in Dashboard analytics.
            </p>

            <div className="space-y-4">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Habit name"
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400"
              />

              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400"
              >
                <option>Productivity</option>
                <option>Health</option>
                <option>Learning</option>
                <option>Mindfulness</option>
                <option>Career</option>
              </select>

              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400"
              >
                <option>Daily</option>
                <option>Weekdays</option>
                <option>Weekends</option>
                <option>3x per week</option>
              </select>

              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-white/10 py-3 rounded-2xl"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHabit}
                className="flex-1 bg-cyan-400 text-black py-3 rounded-2xl font-semibold"
              >
                Save Habit
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

function SummaryCard({ title, value, icon }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
      <div className="text-cyan-400 mb-4">{icon}</div>
      <p className="text-gray-400">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
    </div>
  );
}

function MiniInfo({ icon, label, value }: any) {
  return (
    <div className="bg-black/30 rounded-2xl p-4">
      <div className="text-cyan-400 mb-2">{icon}</div>
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}