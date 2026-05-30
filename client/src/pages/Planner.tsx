import { useState } from "react";
import Layout from "../components/Layout";
import {
  Brain,
  CalendarDays,
  Flame,
  Sparkles,
  Target,
  Clock,
  Loader2,
} from "lucide-react";
import api from "../services/api";



function cleanAIText(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/###/g, "")
    .replace(/---/g, "")
    .replace(/\*/g, "•")
    .trim();
}



export default function Planner() {
  const [goal, setGoal] = useState("");
  const [focus, setFocus] = useState("Productivity");
  const [duration, setDuration] = useState("30 days");
  const [intensity, setIntensity] = useState("Balanced");
  const [loading, setLoading] = useState(false);
  const [aiPlan, setAiPlan] = useState("");

  async function generatePlan() {
    if (!goal.trim()) {
      alert("Please enter your goal first");
      return;
    }

    try {
      setLoading(true);
      setAiPlan("");

      const response = await api.post("/ai/plan", {
        goal,
        focus,
        duration,
        intensity,
      });

      setAiPlan(response.data.plan);
    } catch (error: any) {
      alert(error?.response?.data?.message || "AI generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <p className="text-cyan-300 font-semibold">AI Planning Studio</p>
        <h1 className="text-4xl font-bold mt-2 text-white">
          AI Routine Planner
        </h1>
        <p className="text-slate-300 mt-2">
          Ask HabitIQ to generate a realistic habit plan using Gemini AI.
        </p>
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <section className="xl:col-span-2 bg-white/10 border border-white/10 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-cyan-400 text-black flex items-center justify-center">
              <Brain />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                What do you want to improve?
              </h2>
              <p className="text-slate-300">
                Example: I want to study daily and sleep earlier.
              </p>
            </div>
          </div>

          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full h-40 bg-black/40 text-white placeholder:text-slate-400 border border-white/20 rounded-2xl p-4 outline-none focus:border-cyan-400"
            placeholder="Describe your goal..."
          />

          <div className="grid md:grid-cols-3 gap-4 mt-5">
            <Select
              label="Focus Area"
              value={focus}
              setValue={setFocus}
              options={["Productivity", "Fitness", "Study", "Mindfulness"]}
            />
            <Select
              label="Duration"
              value={duration}
              setValue={setDuration}
              options={["7 days", "14 days", "30 days", "60 days"]}
            />
            <Select
              label="Intensity"
              value={intensity}
              setValue={setIntensity}
              options={["Light", "Balanced", "Intense"]}
            />
          </div>

          <button
            onClick={generatePlan}
            disabled={loading}
            className="mt-6 bg-cyan-400 text-black px-6 py-4 rounded-2xl font-semibold hover:bg-cyan-300 transition flex items-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {loading ? "Generating..." : "Generate Gemini Plan"}
          </button>
        </section>

        <section className="bg-gradient-to-br from-cyan-300 to-blue-500 text-slate-950 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-4">Coach Preview</h2>
          <p className="text-sm leading-6 font-medium">
            HabitIQ will convert your goal into small repeatable actions,
            suggest risk warnings, and recommend a realistic routine.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <Preview icon={<Target />} label="Goal Based" />
            <Preview icon={<Clock />} label="Time Aware" />
            <Preview icon={<Flame />} label="Streak Ready" />
            <Preview icon={<CalendarDays />} label="Weekly Plan" />
          </div>
        </section>
      </div>

      <section className="mt-8 bg-white/10 border border-white/10 rounded-3xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Gemini AI Response
        </h2>

        {!aiPlan && !loading && (
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-slate-300">
            Your AI-generated plan will appear here after you submit a goal.
          </div>
        )}

        {loading && (
          <div className="bg-black/40 border border-white/10 rounded-2xl p-5 text-slate-300">
            Gemini is creating your personalized routine...
          </div>
        )}

      {aiPlan && (
  <div className="space-y-4">
    <div className="bg-black/50 border border-cyan-400/20 rounded-2xl p-6 text-slate-100 whitespace-pre-line leading-7">
      {cleanAIText(aiPlan)}
    </div>

    <p className="text-emerald-300">
      Saved to AI Plans history automatically.
    </p>
  </div>
)}
      </section>
    </Layout>
  );
}

function Select({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <p className="text-slate-300 text-sm mb-2">{label}</p>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-4 rounded-2xl bg-black/40 text-white border border-white/20 outline-none focus:border-cyan-400"
      >
        {options.map((option) => (
          <option key={option} className="bg-slate-900 text-white">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Preview({ icon, label }: any) {
  return (
    <div className="bg-black/20 rounded-2xl p-4">
      <div className="mb-2">{icon}</div>
      <p className="font-bold">{label}</p>
    </div>
  );
}