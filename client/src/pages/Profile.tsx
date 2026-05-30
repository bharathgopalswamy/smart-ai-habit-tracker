import Layout from "../components/Layout";
import { Mail, Target, Trophy, Flame, User, Brain } from "lucide-react";
import { useHabits } from "../context/HabitContext";

export default function Profile() {
  const { habits } = useHabits();

  const savedUser = localStorage.getItem("habitiq_user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  const completedHabits = habits.filter((habit) => habit.completed).length;
  const bestStreak =
    habits.length > 0 ? Math.max(...habits.map((habit) => habit.streak)) : 0;

  const completionRate =
    habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;

  return (
    <Layout>
      <div className="mb-8">
        <p className="text-cyan-400 font-medium">Account Center</p>
        <h1 className="text-4xl font-bold mt-2">Your Profile</h1>
        <p className="text-gray-400 mt-2">
          Dynamic profile generated from your account and habit activity.
        </p>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <section className="xl:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="h-24 w-24 rounded-full bg-cyan-400 text-black flex items-center justify-center text-4xl font-bold mb-5">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
          </div>

          <h2 className="text-2xl font-bold">
            {user?.fullName || "HabitIQ User"}
          </h2>

          <div className="flex items-center gap-2 text-gray-400 mt-2">
            <Mail size={18} />
            <p>{user?.email || "No email available"}</p>
          </div>

          <div className="mt-6 bg-black/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Target size={18} />
              <p className="font-semibold">Primary Goal</p>
            </div>
            <p className="text-gray-300">
              {user?.primaryGoal || "Build consistency"}
            </p>
          </div>
        </section>

        <section className="xl:col-span-2 grid md:grid-cols-3 gap-5">
          <Stat title="Total Habits" value={habits.length} icon={<Brain />} />
          <Stat title="Completed Today" value={completedHabits} icon={<Trophy />} />
          <Stat title="Best Streak" value={`${bestStreak} days`} icon={<Flame />} />
        </section>
      </div>

      <div className="grid xl:grid-cols-2 gap-6 mt-8">
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-5">Productivity Summary</h2>

          <div className="bg-black/30 rounded-2xl p-5">
            <p className="text-gray-400">Completion Rate</p>
            <h3 className="text-4xl font-bold mt-2">{completionRate}%</h3>

            <div className="h-3 bg-white/10 rounded-full mt-5">
              <div
                className="h-3 bg-cyan-400 rounded-full"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-5">Account Details</h2>

          <div className="space-y-4">
            <Detail label="Name" value={user?.fullName || "Not available"} />
            <Detail label="Email" value={user?.email || "Not available"} />
            <Detail
              label="Goal"
              value={user?.primaryGoal || "Build consistency"}
            />
            <Detail label="Account Type" value="Standard User" />
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
      <p className="text-gray-400">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/30 rounded-2xl p-4 flex justify-between gap-4">
      <p className="text-gray-400">{label}</p>
      <p className="font-semibold text-right">{value}</p>
    </div>
  );
}