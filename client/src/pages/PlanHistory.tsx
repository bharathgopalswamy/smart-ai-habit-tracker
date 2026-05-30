import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import { Brain, Trash2 } from "lucide-react";


function cleanAIText(text: string) {
  return text
    .replace(/\*\*/g, "")
    .replace(/###/g, "")
    .replace(/---/g, "")
    .replace(/\*/g, "•")
    .trim();
}

type AIPlan = {
  _id: string;
  goal: string;
  focus: string;
  duration: string;
  intensity: string;
  plan: string;
  createdAt: string;
};

export default function PlanHistory() {
  const [plans, setPlans] = useState<AIPlan[]>([]);

  async function fetchPlans() {
    const response = await api.get("/ai/plans");
    setPlans(response.data);
  }

  async function deletePlan(id: string) {
    await api.delete(`/ai/plans/${id}`);
    fetchPlans();
  }

  useEffect(() => {
    fetchPlans();
  }, []);


  
  return (
    <Layout>
      <div className="mb-8">
        <p className="text-cyan-400 font-medium">AI Memory</p>
        <h1 className="text-4xl font-bold mt-2">Saved AI Plans</h1>
        <p className="text-gray-400 mt-2">
          Revisit, review, and delete your generated routines.
        </p>
      </div>

      <div className="space-y-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="bg-white/5 border border-white/10 rounded-3xl p-6"
          >
            <div className="flex justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <Brain size={20} />
                  <p>{plan.focus} · {plan.duration} · {plan.intensity}</p>
                </div>
                <h2 className="text-2xl font-bold">{plan.goal}</h2>
              </div>

              <button
                onClick={() => deletePlan(plan._id)}
                className="text-red-300 hover:bg-red-500/10 p-3 rounded-2xl"
              >
                <Trash2 />
              </button>
            </div>

            <div className="bg-black/40 rounded-2xl p-5 text-slate-200 whitespace-pre-line leading-7">
              {cleanAIText(plan.plan)}
            </div>
          </div>
        ))}

        {plans.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-gray-400">
            No AI plans saved yet. Generate one from Planner.
          </div>
        )}
      </div>
    </Layout>
  );
}