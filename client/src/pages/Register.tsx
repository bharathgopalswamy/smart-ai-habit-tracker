import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, CheckCircle2, ShieldCheck, UserPlus } from "lucide-react";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    primaryGoal: "Build consistency",
  });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        primaryGoal: formData.primaryGoal,
      });

      alert("Account created successfully. Please login.");

      navigate("/login");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  function updateField(name: string, value: string) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white grid lg:grid-cols-2">
      <section className="hidden lg:flex flex-col justify-center px-20 bg-gradient-to-br from-cyan-400/20 to-purple-600/20">
        <div className="max-w-lg">
          <div className="h-16 w-16 rounded-3xl bg-cyan-400 text-black flex items-center justify-center mb-8">
            <Brain size={34} />
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Start building better habits.
          </h1>

          <p className="text-gray-300 mt-6 text-lg">
            Create your HabitIQ account and use AI-powered tracking to improve consistency.
          </p>

          <div className="space-y-4 mt-10">
            <Feature icon={<CheckCircle2 />} title="Track daily habits" />
            <Feature icon={<Brain />} title="Get AI habit insights" />
            <Feature icon={<ShieldCheck />} title="Save your progress securely" />
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <form
          onSubmit={handleRegister}
          className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-cyan-400 text-black flex items-center justify-center">
              <UserPlus />
            </div>

            <div>
              <h2 className="text-3xl font-bold">Create account</h2>
              <p className="text-gray-400">Signup takes less than a minute.</p>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e: any) => updateField("fullName", e.target.value)}
            />

            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e: any) => updateField("email", e.target.value)}
            />

            <Input
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={(e: any) => updateField("password", e.target.value)}
            />

            <Input
              placeholder="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e: any) =>
                updateField("confirmPassword", e.target.value)
              }
            />

            <select
              value={formData.primaryGoal}
              onChange={(e) => updateField("primaryGoal", e.target.value)}
              className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400 text-gray-300"
            >
              <option>Build consistency</option>
              <option>Improve productivity</option>
              <option>Improve health</option>
              <option>Study better</option>
              <option>Reduce stress</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-cyan-400 text-black p-4 rounded-2xl font-semibold hover:bg-cyan-300 transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-gray-400 text-sm mt-5 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan-400">
              Login
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

function Input({ placeholder, type = "text", value, onChange }: any) {
  return (
    <input
      required
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none focus:border-cyan-400"
    />
  );
}

function Feature({ icon, title }: any) {
  return (
    <div className="flex items-center gap-4 bg-black/30 rounded-2xl p-4">
      <div className="text-cyan-400">{icon}</div>
      <p className="font-semibold">{title}</p>
    </div>
  );
}