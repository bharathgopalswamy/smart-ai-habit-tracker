import Layout from "../components/Layout";
import { useHabits } from "../context/HabitContext";
import {
  Brain,
  Flame,
  ShieldAlert,
  Target,
  Trophy,
  TrendingUp,
  Activity,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Insights() {
  const { habits } = useHabits();

  const totalHabits = habits.length;
  const completedToday = habits.filter((habit) => habit.completed).length;
  const completionRate =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const bestStreak =
    habits.length > 0 ? Math.max(...habits.map((habit) => habit.streak)) : 0;

  const strongestHabit =
    habits.length > 0
      ? habits.reduce((max, habit) => (habit.streak > max.streak ? habit : max))
      : null;

  const weakestHabit =
    habits.length > 0
      ? habits.reduce((min, habit) => (habit.streak < min.streak ? habit : min))
      : null;

  const hardHabits = habits.filter((habit) => habit.difficulty === "Hard").length;
  const missedHabits = habits.filter((habit) => !habit.completed).length;

  const burnoutRisk =
    hardHabits >= 3 || missedHabits >= Math.ceil(totalHabits / 2)
      ? "High"
      : hardHabits >= 1 || missedHabits >= 2
      ? "Medium"
      : "Low";

  const consistencyScore = Math.min(
    100,
    Math.round(completionRate * 0.7 + bestStreak * 1.4)
  );

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

  const difficultyData = ["Easy", "Medium", "Hard"].map((difficulty) => ({
    difficulty,
    count: habits.filter((habit) => habit.difficulty === difficulty).length,
  }));

  const aiRecommendations = [
    completionRate < 50
      ? "Start with one easy habit today to rebuild momentum."
      : "Your completion rate is strong. Add one medium-level habit next week.",
    burnoutRisk === "High"
      ? "Reduce hard habits temporarily. Too many demanding routines may cause burnout."
      : "Your workload looks manageable. Maintain your current rhythm.",
    strongestHabit
      ? `${strongestHabit.name} is your strongest habit. Use the same timing strategy for weaker habits.`
      : "Create your first habit to unlock personalized insights.",
  ];

  return (
    <Layout>
      <div className="mb-8">
        <p className="text-cyan-400 font-medium">AI Insight Engine</p>
        <h1 className="text-4xl font-bold mt-2">Habit Intelligence Report</h1>
        <p className="text-gray-400 mt-2">
          Real analytics generated from your saved habit behavior.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <Metric title="Completion Rate" value={`${completionRate}%`} icon={<TrendingUp />} />
        <Metric title="Consistency Score" value={`${consistencyScore}%`} icon={<Activity />} />
        <Metric title="Best Streak" value={`${bestStreak} days`} icon={<Flame />} />
        <Metric title="Burnout Risk" value={burnoutRisk} icon={<ShieldAlert />} />
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-2">Difficulty Distribution</h2>
          <p className="text-gray-400 mb-6">
            Understand whether your routine is too easy, balanced, or overloaded.
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={difficultyData}>
                <XAxis dataKey="difficulty" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#22d3ee" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-4">Category Summary</h2>

          {categoryData.length === 0 ? (
            <div className="bg-black/30 p-6 rounded-2xl text-gray-400">
              No category data yet.
            </div>
          ) : (
            <>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={85}
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
                  <div key={item.name} className="flex justify-between text-sm text-gray-300">
                    <span>{item.name}</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <div className="grid xl:grid-cols-3 gap-6 mt-8">
        <InsightBox
          icon={<Trophy />}
          title="Strongest Habit"
          value={strongestHabit ? strongestHabit.name : "No habits yet"}
          description={
            strongestHabit
              ? `${strongestHabit.streak} day streak. Keep this routine stable.`
              : "Add habits to identify your strongest pattern."
          }
        />

        <InsightBox
          icon={<AlertTriangle />}
          title="Weakest Habit"
          value={weakestHabit ? weakestHabit.name : "No habits yet"}
          description={
            weakestHabit
              ? `${weakestHabit.streak} day streak. Make this habit easier or schedule it earlier.`
              : "No weak habits detected yet."
          }
        />

        <InsightBox
          icon={<Target />}
          title="Today's Progress"
          value={`${completedToday}/${totalHabits}`}
          description="Completed habits out of total active habits today."
        />
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mt-8">
        <section className="bg-gradient-to-br from-cyan-400 to-blue-600 text-black rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Brain />
            <h2 className="text-2xl font-bold">AI Recommendations</h2>
          </div>

          <div className="space-y-4">
            {aiRecommendations.map((item) => (
              <div key={item} className="bg-black/20 rounded-2xl p-4 text-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-5">Risk Analysis Cards</h2>

          <div className="space-y-4">
            <RiskCard
              title="Missed Habits"
              level={missedHabits > 2 ? "High" : missedHabits > 0 ? "Medium" : "Low"}
              description={`${missedHabits} habits are incomplete today.`}
            />

            <RiskCard
              title="Difficulty Load"
              level={hardHabits >= 3 ? "High" : hardHabits >= 1 ? "Medium" : "Low"}
              description={`${hardHabits} hard habits currently active.`}
            />

            <RiskCard
              title="Consistency Risk"
              level={consistencyScore < 40 ? "High" : consistencyScore < 70 ? "Medium" : "Low"}
              description={`Your consistency score is ${consistencyScore}%.`}
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}

function Metric({ title, value, icon }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-5">
      <div className="text-cyan-400 mb-4">{icon}</div>
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}

function InsightBox({ icon, title, value, description }: any) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
      <div className="text-cyan-400 mb-4">{icon}</div>
      <p className="text-gray-400">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
      <p className="text-gray-400 text-sm mt-3">{description}</p>
    </div>
  );
}

function RiskCard({
  title,
  level,
  description,
}: {
  title: string;
  level: string;
  description: string;
}) {
  const levelClass =
    level === "High"
      ? "text-red-300 border-red-500/20 bg-red-500/10"
      : level === "Medium"
      ? "text-orange-300 border-orange-500/20 bg-orange-500/10"
      : "text-emerald-300 border-emerald-500/20 bg-emerald-500/10";

  return (
    <div className={`border rounded-2xl p-4 ${levelClass}`}>
      <div className="flex justify-between gap-4">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
        <span className="font-bold">{level}</span>
      </div>
    </div>
  );
}