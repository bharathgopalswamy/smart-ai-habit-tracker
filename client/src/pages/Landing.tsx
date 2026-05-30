import { Link } from "react-router-dom";
import { Brain, BarChart3, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <main className="min-h-screen bg-[#050816] text-white px-6 py-10">
      <nav className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-cyan-400">HabitIQ</h1>
        <Link to="/login" className="bg-white text-black px-5 py-2 rounded-xl">
          Login
        </Link>
      </nav>

      <section className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center pt-24">
        <div>
          <h2 className="text-6xl font-bold leading-tight">
            Build better habits with AI intelligence.
          </h2>
          <p className="text-gray-400 mt-6 text-lg">
            Track habits, predict burnout, generate routines, and improve consistency using smart AI coaching.
          </p>
          <Link
            to="/dashboard"
            className="inline-block mt-8 bg-cyan-400 text-black px-8 py-4 rounded-2xl font-semibold"
          >
            Launch Dashboard
          </Link>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-5">
          <Feature icon={<Brain />} title="AI Coach" />
          <Feature icon={<BarChart3 />} title="Smart Analytics" />
          <Feature icon={<Sparkles />} title="Personalized Plans" />
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title }: any) {
  return (
    <div className="flex items-center gap-4 bg-black/30 p-5 rounded-2xl">
      <div className="text-cyan-400">{icon}</div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
  );
}