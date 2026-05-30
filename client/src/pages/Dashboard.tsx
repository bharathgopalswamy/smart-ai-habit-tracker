import Layout from "../components/Layout";
import { useHabits } from "../context/HabitContext";
import {
  Activity,
  Brain,
  Flame,
  ShieldAlert,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";

function getLastNDays(days: number) {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - index));
    return date.toISOString().split("T")[0];
  });
}

export default function Dashboard() {
  const { habits, toggleHabit, loading } = useHabits();

  const totalHabits = habits.length;
  const completedToday = habits.filter((habit) => habit.completed).length;
  const missedToday = totalHabits - completedToday;

  const bestStreak = habits.length
    ? Math.max(...habits.map((habit) => habit.streak))
    : 0;

  const totalCompletions = habits.reduce(
    (sum, habit) => sum + habit.completions.length,
    0
  );

  const completionRate = totalHabits
    ? Math.round((completedToday / totalHabits) * 100)
    : 0;

  const focusScore = Math.min(
    100,
    Math.round(completionRate * 0.65 + bestStreak * 1.6)
  );

  const productivityLevel =
    focusScore >= 85
      ? "Elite"
      : focusScore >= 65
      ? "Strong"
      : focusScore >= 40
      ? "Building"
      : "At Risk";

  const burnoutRisk =
    missedToday >= Math.ceil(totalHabits / 2) && totalHabits > 0
      ? "High"
      : missedToday >= 2
      ? "Medium"
      : "Low";

  const categoryData = Object.values(
    habits.reduce((acc: any, habit) => {
      acc[habit.category] = acc[habit.category] || {
        name: habit.category,
        value: 0,
      };

      acc[habit.category].value += 1;

      return acc;
    }, {})
  );

  const last7Days = getLastNDays(7);

  const weeklyData = last7Days.map((date) => {
    const count = habits.reduce((sum, habit) => {
      return (
        sum +
        habit.completions.filter((completion) => completion.date === date)
          .length
      );
    }, 0);

    const day = new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
    });

    const score = totalHabits ? Math.round((count / totalHabits) * 100) : 0;

    return {
      day,
      score,
      completions: count,
    };
  });

  const completionDates = habits.flatMap((habit) =>
    habit.completions.map((completion) => completion.date)
  );

  const heatmapDays = getLastNDays(35).map((date) => {
    const count = completionDates.filter((item) => item === date).length;

    return {
      id: date,
      level: Math.min(count, 4),
    };
  });

  const riskHabits = habits.filter(
    (habit) => !habit.completed || habit.difficulty === "Hard"
  );

  const strongestHabit = habits.length
    ? habits.reduce((max, habit) => (habit.streak > max.streak ? habit : max))
    : null;

  const aiInsight =
    burnoutRisk === "High"
      ? "You missed several habits today. Reduce intensity and complete one easy habit first."
      : completionRate >= 80
      ? "Your consistency is strong today. Keep the same routine tomorrow."
      : "You are close to momentum. Finish one small habit in the next 30 minutes.";

  if (loading) {
    return (
      <Layout>
        <div className="text-gray-300">Loading dashboard...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <p className="text-cyan-400 font-medium">
          AI Performance Command Center
        </p>
        <h1 className="text-4xl font-bold mt-2">Smart Habit Analytics</h1>
        <p className="text-gray-400 mt-2">
          Real-time dashboard powered by MongoDB habit completions.
        </p>
      </div>

      <div className="grid xl:grid-cols-6 md:grid-cols-3 gap-5 mb-8">
        <Stat
          title="Total Habits"
          value={totalHabits.toString()}
          icon={<Zap />}
        />
        <Stat
          title="Completed Today"
          value={`${completedToday}/${totalHabits}`}
          icon={<Target />}
        />
        <Stat
          title="Best Streak"
          value={`${bestStreak} days`}
          icon={<Flame />}
        />
        <Stat
          title="Focus Score"
          value={`${focusScore}%`}
          icon={<Brain />}
        />
        <Stat
          title="Total Completions"
          value={totalCompletions.toString()}
          icon={<Trophy />}
        />
        <Stat
          title="Burnout Risk"
          value={burnoutRisk}
          icon={<ShieldAlert />}
        />
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">Productivity Level</h2>
              <p className="text-gray-400">
                Calculated from today's completion rate and streak strength.
              </p>
            </div>

            <span className="bg-cyan-400 text-black px-5 py-2 rounded-full font-bold">
              {productivityLevel}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative h-72 w-72 mx-auto rounded-full bg-black/30 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#22d3ee ${
                    focusScore * 3.6
                  }deg, rgba(255,255,255,0.08) 0deg)`,
                }}
              />

              <div className="absolute h-56 w-56 rounded-full bg-[#050816] flex flex-col items-center justify-center">
                <Activity className="text-cyan-400 mb-3" size={34} />
                <p className="text-5xl font-bold">{focusScore}%</p>
                <p className="text-gray-400">Focus Score</p>
              </div>
            </div>

            <div className="space-y-4">
              <InsightCard
                text={`You completed ${completionRate}% of today's habits.`}
              />
              <InsightCard
                text={
                  strongestHabit
                    ? `${strongestHabit.name} is your strongest habit with a ${strongestHabit.streak}-day streak.`
                    : "Add your first habit to unlock stronger insights."
                }
              />
              <InsightCard text={aiInsight} />
            </div>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-4">Category Breakdown</h2>

          {categoryData.length === 0 ? (
            <div className="bg-black/30 rounded-2xl p-6 text-gray-400">
              No habit categories yet.
            </div>
          ) : (
            <>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={index} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                {categoryData.map((item: any) => (
                  <div
                    key={item.name}
                    className="flex justify-between text-sm text-gray-300"
                  >
                    <span>{item.name}</span>
                    <span>{item.value} habits</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <div className="grid xl:grid-cols-3 gap-6 mt-8">
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-4">Streak Heatmap</h2>

          <div className="grid grid-cols-7 gap-2">
            {heatmapDays.map((day) => (
              <div
                key={day.id}
                title={day.id}
                className={`h-9 rounded-xl ${
                  day.level === 0
                    ? "bg-white/10"
                    : day.level === 1
                    ? "bg-cyan-400/20"
                    : day.level === 2
                    ? "bg-cyan-400/40"
                    : day.level === 3
                    ? "bg-cyan-400/70"
                    : "bg-cyan-400"
                }`}
              />
            ))}
          </div>

          <p className="text-gray-400 text-sm mt-4">
            Last 35 days based on real habit completion dates.
          </p>
        </section>

        <section className="xl:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-5">Weekly Performance</h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#22d3ee"
                  strokeWidth={4}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mt-8">
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-5">Today's Habit List</h2>

          {habits.length === 0 ? (
            <div className="bg-black/30 rounded-2xl p-6 text-gray-400">
              No habits yet. Create one from the Habits page.
            </div>
          ) : (
            <div className="space-y-4">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="bg-black/30 rounded-2xl p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold">{habit.name}</p>
                    <p className="text-sm text-gray-400">
                      {habit.category} · {habit.difficulty} · {habit.streak} day
                      streak
                    </p>
                  </div>

                  <button
                    onClick={() => toggleHabit(habit.id)}
                    className={`px-4 py-2 rounded-xl font-semibold ${
                      habit.completed
                        ? "bg-emerald-400 text-black"
                        : "bg-cyan-400 text-black"
                    }`}
                  >
                    {habit.completed ? "Done" : "Complete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-5">AI Risk Analysis</h2>

          <div className="space-y-4">
            {riskHabits.slice(0, 5).map((habit) => (
              <div
                key={habit.id}
                className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4"
              >
                <div className="flex gap-3">
                  <ShieldAlert className="text-red-300" />
                  <div>
                    <p className="font-semibold text-red-200">{habit.name}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Risk:{" "}
                      {habit.completed
                        ? "High difficulty habit"
                        : "Not completed today"}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {riskHabits.length === 0 && (
              <div className="bg-emerald-400/10 border border-emerald-400/20 rounded-2xl p-5">
                <Trophy className="text-emerald-300 mb-3" />
                <p className="font-semibold">No risk habits detected today.</p>
                <p className="text-gray-400 text-sm mt-1">
                  You are maintaining strong consistency.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}

function Stat({ title, value, icon }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
      <div className="text-cyan-400 mb-4">{icon}</div>
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}

function InsightCard({ text }: { text: string }) {
  return (
    <div className="bg-black/30 rounded-2xl p-4 text-gray-300">{text}</div>
  );
}